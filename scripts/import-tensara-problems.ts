import { PrismaClient } from "@prisma/client";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import matter from "gray-matter";

const db = new PrismaClient();

const SOURCE_REPO = "https://github.com/tensara/problems.git";
const LOCAL_GPU = "RTX_4060_Ti";
const LOCAL_UNSUPPORTED_SLUGS = new Set([
  "nvfp4-dequantize",
  "nvfp4-gemm",
  "nvfp4-gemv",
  "nvfp4-quantize",
]);
const LOCAL_REFERENCE_OVERRIDES_DIR = path.resolve(
  "scripts",
  "problem-reference-overrides"
);

type Parameter = Record<string, unknown>;

const getArg = (name: string) => {
  const prefix = `--${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : undefined;
};

const sourceArg = getArg("source");
const shouldDeleteMissing = process.argv.includes("--delete-missing");

function ensureSourceRepo() {
  if (sourceArg) {
    return path.resolve(sourceArg);
  }

  const destination = mkdtempSync(path.join(tmpdir(), "tensara-problems-"));
  execFileSync("git", ["clone", "--depth", "1", SOURCE_REPO, destination], {
    stdio: "inherit",
  });
  return destination;
}

function safeRead(filePath: string) {
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : null;
}

function extractMethod(pythonCode: string, methodName: string) {
  const lines = pythonCode.split("\n");
  let inMethod = false;
  let methodIndent = 0;
  const methodLines: string[] = [];

  for (const line of lines) {
    if (!inMethod && line.trim().startsWith(`def ${methodName}(`)) {
      inMethod = true;
      methodIndent = line.search(/\S/);
      methodLines.push(line);
      continue;
    }

    if (!inMethod) continue;

    const currentIndent = line.search(/\S/);
    const isEmpty = line.trim() === "";
    if (!isEmpty && currentIndent <= methodIndent && currentIndent >= 0) {
      break;
    }

    methodLines.push(line);
  }

  if (methodLines.length === 0) return null;

  return methodLines
    .map((line) => {
      if (line.trim() === "") return line;
      return line.slice(methodIndent);
    })
    .join("\n");
}

function extractParameters(pythonCode: string): Parameter[] | null {
  const markerIndex = pythonCode.indexOf("parameters");
  if (markerIndex === -1) return null;

  const startIndex = pythonCode.indexOf("[", markerIndex);
  if (startIndex === -1) return null;

  let depth = 0;
  let endIndex = -1;
  for (let index = startIndex; index < pythonCode.length; index++) {
    const char = pythonCode[index];
    if (char === "[") depth++;
    if (char === "]") {
      depth--;
      if (depth === 0) {
        endIndex = index;
        break;
      }
    }
  }

  if (endIndex === -1) return null;

  const literal = pythonCode
    .slice(startIndex, endIndex + 1)
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false")
    .replace(/\bNone\b/g, "null")
    .replace(/'/g, '"')
    .replace(/,\s*([}\]])/g, "$1");

  try {
    const parsed = JSON.parse(literal) as Parameter[];
    if (!Array.isArray(parsed)) return null;

    return parsed.map((parameter) => ({
      ...parameter,
      pointer:
        typeof parameter.pointer === "boolean"
          ? String(parameter.pointer)
          : parameter.pointer,
      const:
        typeof parameter.const === "boolean"
          ? String(parameter.const)
          : parameter.const,
    }));
  } catch {
    return null;
  }
}

function adaptDefinition(slug: string, definition: string) {
  if (slug === "mxfp4-gemm") {
    return definition
      .replace("import torch.nn.functional as F\n", "")
      .replace(
        "from torchao.prototype.mx_formats.mx_tensor import to_mx",
        "from torchao.prototype.mx_formats.mx_tensor import to_mx, to_dtype"
      )
      .replace("        return to_mx\n", "        return to_mx, to_dtype\n")
      .replace(
        "            to_mx = self._mx_tensor_api()\n",
        "            to_mx, _ = self._mx_tensor_api()\n"
      )
      .replaceAll("is_swizzled_scales=True", "is_swizzled_scales=False")
      .replace(
        `    def reference_solution(self, q_a: torch.Tensor, scale_a: torch.Tensor, q_b: torch.Tensor, scale_b: torch.Tensor) -> torch.Tensor:
        if not hasattr(F, "scaled_mm"):
            raise RuntimeError("torch.nn.functional.scaled_mm is required for this problem.")

        with torch.no_grad():
            a_q = q_a.contiguous().view(torch.float4_e2m1fn_x2)
            b_q = q_b.contiguous().view(torch.float4_e2m1fn_x2)
            s_a = scale_a.contiguous().view(torch.float8_e8m0fnu).flatten()
            s_b = scale_b.contiguous().view(torch.float8_e8m0fnu).flatten()

            return F.scaled_mm(
                a_q,
                b_q.t(),
                scale_a=s_a,
                scale_recipe_a=F.ScalingType.BlockWise1x32,
                swizzle_a=F.SwizzleType.SWIZZLE_32_4_4,
                scale_b=s_b,
                scale_recipe_b=F.ScalingType.BlockWise1x32,
                swizzle_b=F.SwizzleType.SWIZZLE_32_4_4,
                output_dtype=torch.float32,
            )
`,
        `    def reference_solution(self, q_a: torch.Tensor, scale_a: torch.Tensor, q_b: torch.Tensor, scale_b: torch.Tensor) -> torch.Tensor:
        _, to_dtype = self._mx_tensor_api()

        with torch.no_grad():
            a = to_dtype(
                q_a.contiguous().view(torch.uint8),
                scale_a.contiguous().view(torch.float8_e8m0fnu),
                torch.float4_e2m1fn_x2,
                BLOCK_SIZE,
                torch.float32,
            ).float()
            b = to_dtype(
                q_b.contiguous().view(torch.uint8),
                scale_b.contiguous().view(torch.float8_e8m0fnu),
                torch.float4_e2m1fn_x2,
                BLOCK_SIZE,
                torch.float32,
            ).float()
            return torch.matmul(a, b.t())
`
      );
  }

  if (slug === "mxfp8-gemm") {
    return definition
      .replace("import torch.nn.functional as F\n", "")
      .replaceAll("is_swizzled_scales=True", "is_swizzled_scales=False")
      .replace(
        `    def reference_solution(self, q_a: torch.Tensor, scale_a: torch.Tensor, q_b: torch.Tensor, scale_b: torch.Tensor) -> torch.Tensor:
        if not hasattr(F, "scaled_mm"):
            raise RuntimeError("torch.nn.functional.scaled_mm is required for this problem.")

        with torch.no_grad():
            a_q = q_a.view(torch.float8_e4m3fn)
            b_q = q_b.view(torch.float8_e4m3fn)
            s_a = scale_a.view(torch.float8_e8m0fnu).flatten()
            s_b = scale_b.view(torch.float8_e8m0fnu).flatten()

            return F.scaled_mm(
                a_q,
                b_q.t(),
                scale_a=s_a,
                scale_recipe_a=F.ScalingType.BlockWise1x32,
                swizzle_a=F.SwizzleType.SWIZZLE_32_4_4,
                scale_b=s_b,
                scale_recipe_b=F.ScalingType.BlockWise1x32,
                swizzle_b=F.SwizzleType.SWIZZLE_32_4_4,
                output_dtype=torch.float32,
            )
`,
        `    def reference_solution(self, q_a: torch.Tensor, scale_a: torch.Tensor, q_b: torch.Tensor, scale_b: torch.Tensor) -> torch.Tensor:
        _, to_dtype = self._mx_tensor_api()

        with torch.no_grad():
            a = to_dtype(
                q_a.contiguous().view(torch.float8_e4m3fn),
                scale_a.contiguous().view(torch.float8_e8m0fnu),
                torch.float8_e4m3fn,
                BLOCK_SIZE,
                torch.float32,
            ).float()
            b = to_dtype(
                q_b.contiguous().view(torch.float8_e4m3fn),
                scale_b.contiguous().view(torch.float8_e8m0fnu),
                torch.float8_e4m3fn,
                BLOCK_SIZE,
                torch.float32,
            ).float()
            return torch.matmul(a, b.t())
`
      );
  }

  return definition;
}

function readReferenceImplementation(
  slug: string,
  problemDir: string,
  definition: string
) {
  const overridePath = path.join(LOCAL_REFERENCE_OVERRIDES_DIR, `${slug}.py`);
  if (existsSync(overridePath)) {
    return readFileSync(overridePath, "utf8");
  }

  const torchPath = path.join(problemDir, "torch.py");
  if (existsSync(torchPath)) {
    return readFileSync(torchPath, "utf8");
  }

  const tinygradPath = path.join(problemDir, "tinygrad.py");
  if (existsSync(tinygradPath)) {
    return readFileSync(tinygradPath, "utf8");
  }

  return extractMethod(definition, "reference_solution");
}

async function main() {
  const sourceRoot = ensureSourceRepo();
  const problemsDir = path.join(sourceRoot, "problems");

  if (!existsSync(problemsDir)) {
    throw new Error(`Could not find problems directory at ${problemsDir}`);
  }

  const slugs = readdirSync(problemsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "__pycache__")
    .map((entry) => entry.name)
    .sort();

  const importedSlugs: string[] = [];

  for (const slug of slugs) {
    if (LOCAL_UNSUPPORTED_SLUGS.has(slug)) {
      console.warn(`Skipping ${slug}: unsupported on local ${LOCAL_GPU}.`);
      continue;
    }

    const problemDir = path.join(problemsDir, slug);
    const problemPath = path.join(problemDir, "problem.md");
    const definitionPath = path.join(problemDir, "def.py");

    const markdown = safeRead(problemPath);
    const upstreamDefinition = safeRead(definitionPath);
    if (!markdown || !upstreamDefinition) {
      console.warn(`Skipping ${slug}: missing problem.md or def.py`);
      continue;
    }

    const definition = adaptDefinition(slug, upstreamDefinition);
    const { data, content } = matter(markdown);
    const parameters = extractParameters(definition) ?? data.parameters ?? [];
    const referenceSolution = readReferenceImplementation(
      slug,
      problemDir,
      definition
    );
    const getFlops = extractMethod(definition, "get_flops");

    if (!data.slug || !data.title || !data.difficulty || !data.author) {
      throw new Error(`Problem ${slug} is missing required frontmatter`);
    }

    await db.problem.upsert({
      where: { slug: String(data.slug) },
      create: {
        slug: String(data.slug),
        title: String(data.title),
        description: content.trim(),
        difficulty: String(data.difficulty) as "EASY" | "MEDIUM" | "HARD",
        author: String(data.author),
        definition,
        referenceSolution,
        getFlops,
        parameters,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        gpus: [LOCAL_GPU],
      },
      update: {
        title: String(data.title),
        description: content.trim(),
        difficulty: String(data.difficulty) as "EASY" | "MEDIUM" | "HARD",
        author: String(data.author),
        definition,
        referenceSolution,
        getFlops,
        parameters,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        gpus: [LOCAL_GPU],
      },
    });

    importedSlugs.push(String(data.slug));
    console.log(`Imported ${data.slug}`);
  }

  if (shouldDeleteMissing) {
    const staleProblems = await db.problem.findMany({
      where: { slug: { notIn: importedSlugs } },
      select: { id: true },
    });
    const staleProblemIds = staleProblems.map((problem) => problem.id);

    if (staleProblemIds.length > 0) {
      await db.submission.deleteMany({
        where: { problemId: { in: staleProblemIds } },
      });
      await db.problem.deleteMany({ where: { id: { in: staleProblemIds } } });
    }
  }

  console.log(
    `Done! Imported ${importedSlugs.length} Tensara problems for ${LOCAL_GPU}.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
