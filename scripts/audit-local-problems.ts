import { PrismaClient } from "@prisma/client";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const db = new PrismaClient();

type AuditResult = {
  slug: string;
  title: string;
  difficulty: string;
  solution: "override" | "torch.py" | "reference" | "missing";
  ok: boolean;
  seconds: number;
  statuses: string[];
  finalStatus: string | null;
  message?: string;
  details?: string;
};

const sourceRoot =
  getArg("source") ??
  process.env.TENSARA_PROBLEMS_DIR ??
  "/tmp/tensara-problems";
const gpu = getArg("gpu") ?? "RTX_4060_Ti";
const limit = Number(getArg("limit") ?? "0");
const onlySlugs = new Set(
  (getArg("only") ?? "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean)
);
const outputPath =
  getArg("output") ?? path.join("reports", "local-problem-audit.json");
const dockerCommand = process.env.DOCKER_COMMAND ?? "docker";
const dockerImage = getArg("image") ?? "tensara-engine";
const localReferenceOverridesDir = path.resolve(
  "scripts",
  "problem-reference-overrides"
);

function getArg(name: string) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : undefined;
}

function parseJsonLine(line: string) {
  try {
    return JSON.parse(line) as {
      status?: string;
      message?: string;
      details?: string;
    };
  } catch {
    return {};
  }
}

async function runSample(problem: {
  slug: string;
  title: string;
  difficulty: string;
  definition: string | null;
}): Promise<AuditResult> {
  const overridePath = path.join(localReferenceOverridesDir, `${problem.slug}.py`);
  const upstreamTorchPath = path.join(sourceRoot, "problems", problem.slug, "torch.py");
  const hasOverride = existsSync(overridePath);
  const solutionPath = hasOverride ? overridePath : upstreamTorchPath;
  const solutionLabel = hasOverride ? "override" : "torch.py";
  const startedAt = Date.now();

  const statuses: string[] = [];
  let finalStatus: string | null = null;
  let message: string | undefined;
  let details: string | undefined;
  const hasRunnableSolution = existsSync(solutionPath);

  try {
    const stdout = execFileSync(
      dockerCommand,
      [
        "run",
        "--rm",
        "--gpus",
        "all",
        "--network=none",
        "--memory=14g",
        "--read-only",
        "--tmpfs",
        "/tmp:exec,uid=1000,gid=1000",
        "--security-opt",
        "no-new-privileges",
        "--pids-limit",
        "200",
        "--ulimit",
        "cpu=300",
        "-e",
        "SDUGPU_AUDIT_ALLOW_TORCH=1",
        "-e",
        "HOME=/tmp",
        "-e",
        "XDG_CACHE_HOME=/tmp/.cache",
        "-e",
        "FLASHINFER_WORKSPACE_DIR=/tmp/flashinfer",
        "-i",
        dockerImage,
      ],
      {
        input: JSON.stringify({
          type: hasRunnableSolution ? "sample" : "reference_sample",
          solution_code: hasRunnableSolution
            ? readFileSync(solutionPath, "utf8")
            : "",
          problem: problem.slug,
          problem_name: problem.slug.replaceAll("-", "_"),
          problem_def: problem.definition,
          language: "python",
          gpu,
        }),
        encoding: "utf8",
        timeout: 180_000,
      }
    );

    for (const line of stdout.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const event = parseJsonLine(line);
      if (!event.status) continue;
      statuses.push(event.status);
      finalStatus = event.status;
      message = event.message ?? message;
      details = event.details ?? details;
    }
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "stdout" in error &&
      typeof (error as { stdout?: unknown }).stdout === "string"
    ) {
      const stdout = (error as { stdout: string }).stdout;
      for (const line of stdout.split(/\r?\n/)) {
        if (!line.trim()) continue;
        const event = parseJsonLine(line);
        if (!event.status) continue;
        statuses.push(event.status);
        finalStatus = event.status;
        message = event.message ?? message;
        details = event.details ?? details;
      }
    }

    message =
      message ?? (error instanceof Error ? error.message : String(error));
    if (
      error &&
      typeof error === "object" &&
      "stderr" in error &&
      typeof (error as { stderr?: unknown }).stderr === "string"
    ) {
      details = details ?? (error as { stderr: string }).stderr;
    }
  }

  return {
    slug: problem.slug,
    title: problem.title,
    difficulty: problem.difficulty,
    solution: hasRunnableSolution ? solutionLabel : "reference",
    ok: finalStatus === "PASSED",
    seconds: elapsedSeconds(startedAt),
    statuses,
    finalStatus,
    message,
    details,
  };
}

function elapsedSeconds(startedAt: number) {
  return Number(((Date.now() - startedAt) / 1000).toFixed(2));
}

async function main() {
  const problems = await db.problem.findMany({
    orderBy: [{ difficulty: "asc" }, { slug: "asc" }],
    select: {
      slug: true,
      title: true,
      difficulty: true,
      definition: true,
    },
  });

  const filtered =
    onlySlugs.size > 0
      ? problems.filter((problem) => onlySlugs.has(problem.slug))
      : problems;
  const selected = limit > 0 ? filtered.slice(0, limit) : filtered;
  const results: AuditResult[] = [];

  for (const [index, problem] of selected.entries()) {
    const result = await runSample(problem);
    results.push(result);
    console.log(
      `[${index + 1}/${selected.length}] ${result.ok ? "PASS" : "FAIL"} ${result.slug} (${result.seconds}s) ${result.finalStatus ?? result.message ?? ""}`
    );
  }

  const summary = {
    total: results.length,
    passed: results.filter((result) => result.ok).length,
    failed: results.filter((result) => !result.ok).length,
    missingSolution: results.filter((result) => result.solution === "missing")
      .length,
    sourceRoot,
    gpu,
    dockerImage,
    results,
  };

  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`Wrote ${outputPath}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
