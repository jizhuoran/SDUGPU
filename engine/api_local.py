"""
Local GPU evaluation API — drop-in replacement for Modal's engine/api.py.

Uses Docker containers with GPU passthrough for secure, isolated execution.
"""

import json
import subprocess
import tempfile
import time
import os
import shutil
import threading
from pathlib import Path
from typing import Iterator

from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
import simplejson

IMAGE_NAME = "tensara-engine"
DOCKER_COMMAND = shutil.which("docker") or "docker"

ENGINE_DIR = Path(__file__).parent

web_app = FastAPI()
GPU_EXECUTION_LOCK = threading.Lock()

# RTX 4060 Ti — compute capability 8.9
LOCAL_GPU_SM = "89"
LOCAL_GPU_NAME = "RTX_4060_Ti"

GPU_COMPUTE_CAPABILITIES = {
    "T4": "75",
    "H100": "90a",
    "H200": "90a",
    "B200": "100a",
    "A100-80GB": "80",
    "A10G": "86",
    "L40S": "89",
    "L4": "89",
    "RTX_4060_Ti": "89",
    "RTX_4070": "89",
    "RTX_4080": "89",
    "RTX_4090": "89",
    "RTX_3060": "86",
    "RTX_3070": "86",
    "RTX_3080": "86",
    "RTX_3090": "86",
}


def _slug_to_module(name: str) -> str:
    return name.replace("-", "_")


def _build_image_if_needed():
    """Build the Docker image if it doesn't exist."""
    try:
        result = subprocess.run(
            [DOCKER_COMMAND, "images", "-q", IMAGE_NAME],
            capture_output=True, text=True, timeout=10,
        )
    except Exception:
        print("WARNING: Cannot check Docker images (permission issue?). Skipping build check.")
        return

    if not result.stdout.strip():
        print(f"Building Docker image {IMAGE_NAME}...")
        try:
            subprocess.run(
                [DOCKER_COMMAND, "build", "-t", IMAGE_NAME, str(ENGINE_DIR)],
                check=True,
            )
            print("Docker image built.")
        except Exception as e:
            print(f"WARNING: Docker build failed: {e}")


def _run_in_docker(request_payload: dict, gpu: str) -> Iterator[dict]:
    """
    Run evaluation in a Docker container with GPU access.
    Yields parsed JSON events from the container's stdout.
    """
    payload_json = json.dumps(request_payload)

    cmd = [
        DOCKER_COMMAND, "run", "--rm",
        "--gpus", "all",
        "--network=none",
        "--memory=14g",
        "--read-only",
        "--tmpfs", "/tmp:exec,uid=1000,gid=1000",
        "--security-opt", "no-new-privileges",
        "--pids-limit", "200",
        "--ulimit", "cpu=300",
        "-e", "HOME=/tmp",
        "-e", "XDG_CACHE_HOME=/tmp/.cache",
        "-e", "FLASHINFER_WORKSPACE_DIR=/tmp/flashinfer",
        "-i",  # stdin
        IMAGE_NAME,
    ]

    if GPU_EXECUTION_LOCK.locked():
        yield {
            "status": "IN_QUEUE",
            "message": "Waiting for the local GPU to become available",
        }

    with GPU_EXECUTION_LOCK:
        proc = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        try:
            stdout, stderr = proc.communicate(input=payload_json, timeout=300)
        except subprocess.TimeoutExpired:
            proc.kill()
            yield {"status": "TIME_LIMIT_EXCEEDED",
                   "message": "Docker container timed out",
                   "details": "Execution exceeded 5 minute limit"}
            return

        if stderr:
            print(f"[docker stderr] {stderr[:500]}")

        for line in stdout.strip().split("\n"):
            line = line.strip()
            if not line:
                continue
            try:
                event = json.loads(line)
                yield event
            except json.JSONDecodeError:
                continue


def _sse_stream(generator: Iterator[dict]):
    """Wrap a generator as SSE stream."""
    for event in generator:
        if event is None or event == {}:
            continue
        data = simplejson.dumps(event, ignore_nan=True)
        yield f"data: {data}\n\n"


def _resolve_gpu(gpu: str) -> str:
    """Replace unsupported GPU names with the local GPU."""
    known = GPU_COMPUTE_CAPABILITIES
    if gpu in known:
        return gpu
    print(f"GPU '{gpu}' not found, using local {LOCAL_GPU_NAME}")
    return LOCAL_GPU_NAME


# ---- Endpoints (mirror Modal api.py) ----


@web_app.post("/checker-{gpu}")
async def checker(gpu: str, request: Request):
    req = await request.json()
    gpu = _resolve_gpu(gpu)

    def create_stream():
        yield {"status": "COMPILING"}

        problem_name = _slug_to_module(req["problem"])
        for event in _run_in_docker({
            "type": "checker",
            "solution_code": req["solution_code"],
            "problem_name": problem_name,
            "problem_def": req["problem_def"],
            "language": req["language"],
            "gpu": gpu,
        }, gpu):
            yield event

    return StreamingResponse(
        _sse_stream(create_stream()),
        media_type="text/event-stream",
    )


@web_app.post("/benchmark-{gpu}")
async def benchmark(gpu: str, request: Request):
    req = await request.json()
    gpu = _resolve_gpu(gpu)

    def create_stream():
        problem_name = _slug_to_module(req["problem"])
        for event in _run_in_docker({
            "type": "benchmark",
            "solution_code": req["solution_code"],
            "problem_name": problem_name,
            "problem_def": req["problem_def"],
            "language": req["language"],
            "gpu": gpu,
        }, gpu):
            yield event

    return StreamingResponse(
        _sse_stream(create_stream()),
        media_type="text/event-stream",
    )


@web_app.post("/benchmark_cli-{gpu}")
async def benchmark_cli(gpu: str, request: Request):
    req = await request.json()
    gpu = _resolve_gpu(gpu)

    def create_stream():
        yield {"status": "COMPILING"}
        problem_name = _slug_to_module(req["problem"])

        # Sanity check first
        for event in _run_in_docker({
            "type": "sanity_check",
            "solution_code": req["solution_code"],
            "problem_name": problem_name,
            "problem_def": req["problem_def"],
            "language": req["language"],
            "gpu": gpu,
        }, gpu):
            yield event
            if event.get("status") in ("RUNTIME_ERROR", "ERROR", "COMPILE_ERROR", "WRONG_ANSWER"):
                return
            if event.get("status") == "SANITY_CHECK_PASSED":
                break

        # Then benchmark
        for event in _run_in_docker({
            "type": "benchmark",
            "solution_code": req["solution_code"],
            "problem_name": problem_name,
            "problem_def": req["problem_def"],
            "language": req["language"],
            "gpu": gpu,
        }, gpu):
            yield event

    return StreamingResponse(
        _sse_stream(create_stream()),
        media_type="text/event-stream",
    )


@web_app.post("/sample-{gpu}")
async def sample(gpu: str, request: Request):
    req = await request.json()
    gpu = _resolve_gpu(gpu)

    def create_stream():
        yield {"status": "COMPILING"}
        problem_name = _slug_to_module(req["problem"])
        for event in _run_in_docker({
            "type": "sample",
            "solution_code": req["solution_code"],
            "problem_name": problem_name,
            "problem_def": req["problem_def"],
            "language": req["language"],
            "gpu": gpu,
        }, gpu):
            yield event

    return StreamingResponse(
        _sse_stream(create_stream()),
        media_type="text/event-stream",
    )


@web_app.post("/sandbox-{gpu}")
async def sandbox(gpu: str, request: Request):
    req = await request.json()
    gpu = _resolve_gpu(gpu)

    def create_stream():
        yield {"status": "COMPILING"}
        for event in _run_in_docker({
            "type": "sandbox",
            "solution_code": req["code"],
            "language": req.get("language", "cuda"),
            "gpu": gpu,
        }, gpu):
            status = event.get("status", "")
            if status == "TIME_LIMIT_EXCEEDED":
                yield {
                    "status": "SANDBOX_TIMEOUT",
                    "message": event.get("message", "Sandbox time limit exceeded"),
                    "details": event.get("details", ""),
                }
                return
            yield event

    return StreamingResponse(
        _sse_stream(create_stream()),
        media_type="text/event-stream",
    )

if __name__ == "__main__":
    import uvicorn, os
    port = int(os.environ.get("ENGINE_PORT", "8000"))
    _build_image_if_needed()
    print(f"Tensara local engine starting on port {port}")
    print(f"GPU: {LOCAL_GPU_NAME} (SM {LOCAL_GPU_SM})")
    uvicorn.run(web_app, host="0.0.0.0", port=port)
