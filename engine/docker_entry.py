"""
Entrypoint for GPU evaluation inside Docker container.
Reads JSON from stdin, compiles and executes, outputs JSON lines on stdout.
"""

import sys
import json
import traceback

sys.path.insert(0, "/app")

import runner
import utils

# Register common consumer GPUs
utils.GPU_COMPUTE_CAPABILITIES.update({
    "RTX_4060_Ti": "89",
    "RTX_4060": "89",
    "RTX_4070": "89",
    "RTX_4080": "89",
    "RTX_4090": "89",
    "RTX_3060": "86",
    "RTX_3070": "86",
    "RTX_3080": "86",
    "RTX_3090": "86",
    "GTX_1080_Ti": "61",
})


def main():
    raw = sys.stdin.read()
    try:
        req = json.loads(raw)
    except json.JSONDecodeError as e:
        output({"status": "ERROR", "message": f"Invalid JSON: {e}"})
        sys.exit(1)

    req_type = req.get("type", "checker")
    language = req.get("language", "cuda")
    solution_code = req.get("solution_code", "")
    problem_name = req.get("problem_name", "")
    problem_def = req.get("problem_def", "")
    gpu = req.get("gpu", "T4")

    # Fallback: if GPU not in known list, use local GPU's SM
    if gpu not in utils.GPU_COMPUTE_CAPABILITIES:
        gpu = "RTX_4060_Ti"

    try:
        if req_type == "sandbox":
            _run_sandbox(req_type, language, solution_code, gpu)
        elif req_type == "reference_sample":
            _run_reference_sample(problem_name, problem_def)
        elif req_type == "sample":
            _run_sample(req_type, language, solution_code, problem_name, problem_def, gpu)
        else:
            _run_solution(req_type, language, solution_code, problem_name, problem_def, gpu)
    except utils.NVCCError as e:
        output({"status": "COMPILE_ERROR", "message": "NVCC Compilation Failed", "details": str(e)})
    except utils.MojoError as e:
        output({"status": "COMPILE_ERROR", "message": "Mojo Compilation Failed", "details": str(e)})
    except utils.SolutionSignatureError as e:
        output({"status": "COMPILE_ERROR", "message": "Invalid solution signature", "details": str(e)})
    except Exception as e:
        output({"status": "ERROR", "message": str(e.__class__.__name__), "details": traceback.format_exc()})


def _run_solution(req_type, language, solution_code, problem_name, problem_def, gpu):
    """Standard checker / benchmark / sanity_check flow."""
    compiled = _compile(language, solution_code, gpu, req_type)
    problem = utils.load_problem_module(problem_name, problem_def)
    solution_func = utils.make_solution_func(language, solution_code, compiled, problem)

    if req_type == "checker":
        gen = runner.run_checker(problem_name, problem_def, solution_func, language)
    elif req_type == "benchmark":
        gen = runner.run_benchmark(problem_name, problem_def, solution_func, language)
    elif req_type == "sanity_check":
        gen = runner.run_sanity_check(problem_name, problem_def, solution_func, language)
    else:
        output({"status": "ERROR", "message": f"Unknown type: {req_type}"})
        return

    for event in gen:
        if event:
            output(event)


def _run_sample(req_type, language, solution_code, problem_name, problem_def, gpu):
    """Sample test case — uses run_sample_case which compiles internally."""
    compiled = _compile(language, solution_code, gpu, "sample")
    gen = runner.run_sample_case(problem_name, problem_def, solution_code, compiled, language)
    for event in gen:
        if event:
            output(event)


def _run_reference_sample(problem_name, problem_def):
    """Internal audit path for problems that do not ship a runnable baseline."""
    gen = runner.run_reference_sample_case(problem_name, problem_def)
    for event in gen:
        if event:
            output(event)


def _run_sandbox(req_type, language, solution_code, gpu):
    """Sandbox execution — compile to executable, run binary."""
    if language == "cuda":
        compiled = utils.run_nvcc_and_return_executable(gpu, solution_code)
    elif language == "mojo":
        try:
            compiled = utils.run_mojo_and_return_executable(solution_code, "sandbox")
        except utils.MojoError:
            compiled = None
    else:
        compiled = None

    gen = runner.run_sandbox(compiled, solution_code)
    for event in gen:
        if event:
            output(event)


def _compile(language, solution_code, gpu, output_name):
    """Compile source code to shared library bytes."""
    if language == "cuda":
        return utils.run_nvcc_and_return_bytes(gpu, solution_code, output_name)
    elif language == "mojo":
        utils.reject_forbidden_patterns("mojo", solution_code)
        try:
            return utils.run_mojo_and_return_bytes(solution_code, output_name)
        except utils.MojoError:
            return None
    else:
        # Python / Triton / CuTile / PyPTX — no pre-compilation
        return None


def output(event):
    sys.stdout.write(json.dumps(event, default=str) + "\n")
    sys.stdout.flush()


if __name__ == "__main__":
    main()
