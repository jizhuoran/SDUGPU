/**
 * Seed script: keep the local database focused on the SDUGPU starter problems.
 * Run: npx tsx prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const VECTOR_ADD_DESCRIPTION = String.raw`
对两个向量做逐元素加法：

$$
c_i = a_i + b_i
$$

## 输入

长度为 $N$ 的向量 $a$ 和 $b$。

## 输出

长度为 $N$ 的向量 $c$，其中每个元素满足 $c_i = a_i + b_i$。

## 测试规模

- $n = 2^{20}$
- $n = 2^{22}$
- $n = 2^{23}$
- $n = 2^{25}$
- $n = 2^{26}$
`;

const VECTOR_ADD_DEF = String.raw`
from problem import Problem
import torch


class vector_addition(Problem):
    parameters = [
        {"name": "d_input1", "type": "float", "const": True, "pointer": True},
        {"name": "d_input2", "type": "float", "const": True, "pointer": True},
        {"name": "d_output", "type": "float", "pointer": True},
        {"name": "n", "type": "size_t"},
    ]

    def __init__(self):
        super().__init__("vector_addition")

    def reference_solution(self, d_input1, d_input2):
        return d_input1 + d_input2

    def generate_test_cases(self):
        sizes = [(20, 2**20), (22, 2**22), (23, 2**23), (25, 2**25), (26, 2**26)]
        return [
            {
                "name": f"n = 2^{power}",
                "n": n,
                "create_inputs": lambda n=n: (
                    torch.randn(n, device="cuda", dtype=torch.float32),
                    torch.randn(n, device="cuda", dtype=torch.float32),
                ),
            }
            for power, n in sizes
        ]

    def generate_sample(self):
        return {
            "name": "sample_n_8",
            "n": 8,
            "create_inputs": lambda: (
                torch.tensor([1.0, -2.0, 3.5, 4.0, 0.0, 8.0, -1.25, 2.25], device="cuda"),
                torch.tensor([2.0, 5.0, -1.5, 0.5, 7.0, -3.0, 1.25, -2.25], device="cuda"),
            ),
        }

    def get_extra_params(self, test_case):
        return [test_case["n"]]

    def verify_result(self, expected, actual):
        match = torch.allclose(expected, actual, atol=1e-4, rtol=1e-5)
        if match:
            return True, {}

        diff = (expected - actual).abs()
        max_diff = diff.max().item()
        mismatch_index = diff.argmax().item()
        return False, {
            "max_diff": max_diff,
            "mismatch_index": mismatch_index,
            "expected": expected.flatten()[mismatch_index].item(),
            "actual": actual.flatten()[mismatch_index].item(),
        }

    def get_flops(self, test_case):
        return test_case["n"]
`;

const LEAKY_RELU_DESCRIPTION = String.raw`
对输入矩阵执行 Leaky ReLU（Leaky Rectified Linear Unit）激活函数：

$$
C[i][j] = \max(\alpha \cdot A[i][j], A[i][j])
$$

其中 $\alpha$ 是一个较小的正数，例如 $0.01$。

Leaky ReLU 定义为：

$$
f(x)=
\begin{cases}
x, & x > 0 \\
\alpha x, & x \le 0
\end{cases}
$$

## 输入

- 大小为 $M \times N$ 的矩阵 $A$
- $\alpha$：负值区域的斜率

## 输出

大小为 $M \times N$ 的矩阵 $C$。

## 说明

- 矩阵 $A$ 和 $C$ 都按 row-major 顺序存储
- 函数签名中的 n 表示列数，m 表示行数
- 本题借鉴自 KernelBench

## 测试规模

- $4096 \times 4096$, $\alpha = 0.01$
- $4096 \times 4096$, $\alpha = 0.05$
- $4096 \times 4096$, $\alpha = 0.1$
- $4096 \times 4096$, $\alpha = 0.2$
- $6144 \times 4096$, $\alpha = 0.01$
- $6144 \times 4096$, $\alpha = 0.05$
- $6144 \times 4096$, $\alpha = 0.1$
- $6144 \times 4096$, $\alpha = 0.2$
`;

const LEAKY_RELU_DEF = String.raw`
from problem import Problem
import torch


class leaky_relu(Problem):
    parameters = [
        {"name": "input", "type": "float", "const": True, "pointer": True},
        {"name": "alpha", "type": "float"},
        {"name": "output", "type": "float", "pointer": True},
        {"name": "n", "type": "size_t"},
        {"name": "m", "type": "size_t"},
    ]

    def __init__(self):
        super().__init__("leaky_relu")

    def reference_solution(self, input, alpha):
        return torch.where(input > 0, input, alpha * input)

    def generate_test_cases(self):
        sizes = [
            (4096, 4096, 0.01),
            (4096, 4096, 0.05),
            (4096, 4096, 0.1),
            (4096, 4096, 0.2),
            (6144, 4096, 0.01),
            (6144, 4096, 0.05),
            (6144, 4096, 0.1),
            (6144, 4096, 0.2),
        ]
        return [
            {
                "name": f"{m}x{n}, alpha={alpha}",
                "m": m,
                "n": n,
                "alpha": alpha,
                "create_inputs": lambda m=m, n=n, alpha=alpha: (
                    torch.randn((m, n), device="cuda", dtype=torch.float32) * 3.0,
                    float(alpha),
                ),
            }
            for m, n, alpha in sizes
        ]

    def generate_sample(self):
        return {
            "name": "sample_2x4_alpha_0.1",
            "m": 2,
            "n": 4,
            "alpha": 0.1,
            "create_inputs": lambda: (
                torch.tensor(
                    [[1.0, -2.0, 0.0, 4.0], [-0.5, 3.0, -8.0, 2.5]],
                    device="cuda",
                    dtype=torch.float32,
                ),
                0.1,
            ),
        }

    def get_extra_params(self, test_case):
        return [test_case["n"], test_case["m"]]

    def verify_result(self, expected, actual):
        match = torch.allclose(expected, actual, atol=1e-4, rtol=1e-5)
        if match:
            return True, {}

        diff = (expected - actual).abs()
        flat_diff = diff.flatten()
        flat_expected = expected.flatten()
        flat_actual = actual.flatten()
        topk = min(10, flat_diff.numel())
        values, indices = torch.topk(flat_diff, topk)

        return False, {
            "message": "Output does not match the Leaky ReLU reference.",
            "max_difference": values[0].item(),
            "mean_difference": diff.mean().item(),
            "sample_differences": {
                str(indices[i].item()): {
                    "expected": flat_expected[indices[i]].item(),
                    "actual": flat_actual[indices[i]].item(),
                    "diff": values[i].item(),
                }
                for i in range(topk)
            },
        }

    def get_flops(self, test_case):
        return 2 * test_case["m"] * test_case["n"]
`;

const vectorAdditionProblem = {
  title: "Vector Addition",
  slug: "vector-addition",
  description: VECTOR_ADD_DESCRIPTION.trim(),
  difficulty: "EASY" as const,
  author: "SDUGPU",
  parameters: [
    { name: "d_input1", type: "float", const: "true", pointer: "true" },
    { name: "d_input2", type: "float", const: "true", pointer: "true" },
    { name: "d_output", type: "float", const: "false", pointer: "true" },
    { name: "n", type: "size_t", const: "false", pointer: "false" },
  ],
  tags: ["vector"],
  gpus: ["RTX_4060_Ti"],
  definition: VECTOR_ADD_DEF,
  referenceSolution: `#include <cuda_runtime.h>

__global__ void vector_add_kernel(const float* d_input1, const float* d_input2, float* d_output, size_t n) {
    size_t idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < n) {
        d_output[idx] = d_input1[idx] + d_input2[idx];
    }
}

extern "C" void solution(const float* d_input1, const float* d_input2, float* d_output, size_t n) {
    constexpr int block_size = 256;
    int grid_size = static_cast<int>((n + block_size - 1) / block_size);
    vector_add_kernel<<<grid_size, block_size>>>(d_input1, d_input2, d_output, n);
}`,
  getFlops: `def get_flops(test_case):
    return test_case["n"]`,
};

const leakyReluProblem = {
  title: "Leaky ReLU",
  slug: "leaky-relu",
  description: LEAKY_RELU_DESCRIPTION.trim(),
  difficulty: "EASY" as const,
  author: "SDUGPU",
  parameters: [
    { name: "input", type: "float", const: "true", pointer: "true" },
    { name: "alpha", type: "float", const: "false", pointer: "false" },
    { name: "output", type: "float", const: "false", pointer: "true" },
    { name: "n", type: "size_t", const: "false", pointer: "false" },
    { name: "m", type: "size_t", const: "false", pointer: "false" },
  ],
  tags: ["activation-function"],
  gpus: ["RTX_4060_Ti"],
  definition: LEAKY_RELU_DEF,
  referenceSolution: `#include <cuda_runtime.h>

__global__ void leaky_relu_kernel(const float* input, float alpha, float* output, size_t total) {
    size_t idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < total) {
        float x = input[idx];
        output[idx] = x > 0.0f ? x : alpha * x;
    }
}

extern "C" void solution(const float* input, float alpha, float* output, size_t n, size_t m) {
    size_t total = n * m;
    constexpr int block_size = 256;
    int grid_size = static_cast<int>((total + block_size - 1) / block_size);
    leaky_relu_kernel<<<grid_size, block_size>>>(input, alpha, output, total);
}`,
  getFlops: `def get_flops(test_case):
    return 2 * test_case["m"] * test_case["n"]`,
};

async function main() {
  const problems = [vectorAdditionProblem, leakyReluProblem];

  for (const problem of problems) {
    await db.problem.upsert({
      where: { slug: problem.slug },
      create: problem,
      update: problem,
    });
  }

  console.log("Done! Seeded SDUGPU local starter problems.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
