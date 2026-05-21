import type { Locale } from "./index";

export const problemTitleZh: Record<string, string> = {
  "all-pairs-shortest-path": "全源最短路径",
  argmax: "按维度求最大值索引",
  argmin: "按维度求最小值索引",
  "array-sort": "数组排序",
  "avg-pool-1d": "一维平均池化",
  "avg-pool-2d": "二维平均池化",
  "avg-pool-3d": "三维平均池化",
  "batch-norm": "批归一化",
  "box-blur": "方框模糊",
  "conv-1d": "一维卷积",
  "conv-2d": "二维卷积",
  "conv-square-3d": "三维方形卷积",
  "conv2d-relu-hardswish": "二维卷积融合 ReLU 与 HardSwish",
  "cosine-similarity": "余弦相似度",
  cumprod: "累积乘积",
  cumsum: "累积求和",
  "diagonal-matmul": "对角矩阵乘法",
  "ecc-point-negation": "批量 ECC 点取负",
  "edge-detect": "边缘检测",
  elu: "ELU",
  "frobenius-norm": "Frobenius 归一化",
  gelu: "GELU",
  "gemm-multiply-leakyrelu": "GEMM 融合逐元素乘法与 LeakyReLU",
  "gemm-relu": "GEMM 融合偏置与 ReLU",
  grayscale: "灰度转换",
  "hard-sigmoid": "Hard Sigmoid",
  "hinge-loss": "Hinge Loss",
  histogram: "图像直方图",
  "huber-loss": "Huber Loss",
  "kl-loss": "KL 散度",
  "l1-norm": "L1 归一化",
  "l2-norm": "L2 归一化",
  "layer-norm": "层归一化",
  "leaky-relu": "Leaky ReLU",
  "log-softmax": "Log Softmax",
  "lower-trig-matmul": "下三角矩阵乘法",
  "matmul-3d": "三维张量-矩阵乘法",
  "matmul-4d": "四维张量-矩阵乘法",
  "matmul-sigmoid-sum": "矩阵乘法融合 Sigmoid 与求和",
  "matmul-swish": "矩阵乘法融合 Swish 激活",
  "matmul-swish-scaling": "矩阵乘法融合 Swish 与缩放",
  "matrix-multiplication": "矩阵乘法",
  "matrix-power": "矩阵 N 次幂",
  "matrix-scalar": "矩阵标量乘法",
  "matrix-vector": "矩阵向量乘法",
  "max-dim": "按维度求最大值",
  "max-pool-1d": "一维最大池化",
  "max-pool-2d": "二维最大池化",
  "max-pool-3d": "三维最大池化",
  "mean-dim": "按维度求均值",
  "min-dim": "按维度求最小值",
  "min-spanning-tree": "最小生成树",
  mse_loss: "均方误差损失",
  "mxfp4-dequantize": "MXFP4 反量化",
  "mxfp4-gemm": "MXFP4 GEMM",
  "mxfp4-quantize": "MXFP4 量化",
  "mxfp8-dequantize": "MXFP8 反量化",
  "mxfp8-gemm": "MXFP8 GEMM",
  "mxfp8-quantize": "MXFP8 量化",
  "poly-multiply-ff": "有限域多项式乘法",
  "product-dim": "按维度求乘积",
  relu: "ReLU",
  "rms-norm": "RMS 归一化",
  "running-sum-1d": "一维滑动求和",
  "scaled-dot-attention": "缩放点积注意力",
  selu: "SELU",
  "shortest-path": "单源最短路径",
  sigmoid: "Sigmoid",
  "soft-plus": "Softplus",
  softmax: "Softmax",
  "square-matmul": "方阵矩阵乘法",
  "sum-dim": "按维度求和",
  swish: "Swish",
  "symmetric-matmul": "对称矩阵乘法",
  tanh: "Tanh",
  threshold: "图像阈值化",
  "triplet-margin": "Triplet Margin Loss",
  "upper-trig-matmul": "上三角矩阵乘法",
  "vector-addition": "向量加法",
  "vector-multiply-ff": "有限域向量乘法",
};

const descriptionZh: Record<string, string> = {
  "vector-addition": `对两个向量执行逐元素加法：
$$
c_i = a_i + b_i
$$

## 输入
- 长度为 $N$ 的向量 $a$ 和 $b$

## 输出
- 长度为 $N$ 的向量 $c$，其中每个元素都是对应位置的和

## 测试规模

- n = 2^20
- n = 2^22
- n = 2^23
- n = 2^25
- n = 2^26
- n = 2^29
- n = 2^30`,
  "leaky-relu": `对输入矩阵执行 Leaky ReLU 激活函数：
$$
\\text{C}[i][j] = \\max(\\alpha \\cdot \\text{A}[i][j], \\text{A}[i][j])
$$
其中 $\\alpha$ 是一个较小的正数常量，例如 0.01。

Leaky ReLU 定义为：
$$
f(x) = \\begin{cases}
x & \\text{if } x > 0 \\\\
\\alpha x & \\text{if } x \\leq 0
\\end{cases}
$$

## 输入
- 大小为 $M \\times N$ 的矩阵 $\\text{A}$
- $\\alpha$：负数区域的斜率

## 输出
- 大小为 $M \\times N$ 的矩阵 $\\text{C}$

## 说明
- 矩阵 $\\text{A}$ 和 $\\text{C}$ 均按行主序存储
- 本题改编自 [KernelBench](https://github.com/ScalingIntelligence/KernelBench/blob/main/KernelBench/level1/20_LeakyReLU.py)

## 测试规模

- 4096x4096, alpha=0.01
- 4096x4096, alpha=0.05
- 4096x4096, alpha=0.1
- 4096x4096, alpha=0.2
- 6144x4096, alpha=0.01
- 6144x4096, alpha=0.05
- 6144x4096, alpha=0.1
- 6144x4096, alpha=0.2`,
  "matrix-multiplication": `执行两个矩阵的矩阵乘法：
$$
C[i][j] = \\sum_{k=0}^{K-1} A[i][k] \\cdot B[k][j]
$$

## 输入
- 大小为 $M \\times K$ 的矩阵 $A$
- 大小为 $K \\times N$ 的矩阵 $B$

## 输出
- 大小为 $M \\times N$ 的矩阵 $C$

## 说明
- 矩阵 $\\text{A}$、$\\text{B}$ 和 $\\text{C}$ 均按行主序存储

## 测试规模

- 4096x4096 x 4096x4096
- 8192x8192 x 8192x4096
- 4096x4096 x 4096x8192
- 8192x8192 x 8192x8192`,
  "scaled-dot-attention": `实现缩放点积注意力，这是 Transformer 架构中的关键组件：
$$
\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{E}}\\right)V
$$

其中 $Q$、$K$、$V$ 分别是 query、key、value 矩阵，$E$ 是 embedding 维度。

## 输入
- 大小为 $(\\text{B} \\times \\text{H} \\times \\text{S} \\times \\text{E})$ 的矩阵 $Q$、$K$、$V$

## 输出
- 大小为 $(\\text{B} \\times \\text{H} \\times \\text{S} \\times \\text{E})$ 的 $\\text{output}$ 矩阵

## 说明
- 输入矩阵按行主序存储
- 可以假设 query、key、value 的 embedding 维度相同
- 同样，query、key、value 的 head 数也相同

## 测试规模

- Batch=8, Heads=16, Seq_len=512, Embed_dim=64
- Batch=16, Heads=32, Seq_len=256, Embed_dim=64
- Batch=4, Heads=32, Seq_len=1024, Embed_dim=32
- Batch=32, Heads=8, Seq_len=512, Embed_dim=128
- Batch=8, Heads=16, Seq_len=512, Embed_dim=256
- Batch=8, Heads=16, Seq_len=2048, Embed_dim=64`,
};

const markdownHeadingZh: Record<string, string> = {
  "## Input": "## 输入",
  "## Input:": "## 输入",
  "## Output": "## 输出",
  "## Output:": "## 输出",
  "## Notes": "## 说明",
  "## Notes:": "## 说明",
  "## Test Case Sizes": "## 测试规模",
};

const markdownPhraseReplacements: Array<[RegExp, string]> = [
  [/Perform element-wise addition of two vectors:/g, "对两个向量执行逐元素加法："],
  [/Perform element-wise multiplication of two vectors in the finite field:/g, "在有限域中对两个向量执行逐元素乘法："],
  [/Sort an array of integers in ascending order\./g, "将整数数组按升序排序。"],
  [/Find the indices of maximum values along a specified dimension of an input tensor:/g, "求输入张量在指定维度上的最大值索引："],
  [/Find the indices of minimum values along a specified dimension of an input tensor:/g, "求输入张量在指定维度上的最小值索引："],
  [/Perform product reduction over a specified dimension of an input tensor:/g, "对输入张量的指定维度执行乘积归约："],
  [/Perform sum reduction over a specified dimension of an input tensor:/g, "对输入张量的指定维度执行求和归约："],
  [/Compute the softmax function over a specified dimension of an input tensor:/g, "在输入张量的指定维度上计算 softmax 函数："],
  [/Perform matrix multiplication of two matrices:/g, "执行两个矩阵的矩阵乘法："],
  [/Perform multiplication of two square matrices:/g, "执行两个方阵的矩阵乘法："],
  [/Perform multiplication of two symmetric matrices:/g, "执行两个对称矩阵的矩阵乘法："],
  [/Perform matrix multiplication of a diagonal matrix with another matrix:/g, "执行对角矩阵与普通矩阵的矩阵乘法："],
  [/Perform matrix multiplication of two upper triangular matrices:/g, "执行两个上三角矩阵的矩阵乘法："],
  [/Perform matrix multiplication of two lower triangular matrices:/g, "执行两个下三角矩阵的矩阵乘法："],
  [/Perform matrix-vector multiplication:/g, "执行矩阵向量乘法："],
  [/Perform scalar multiplication of a matrix:/g, "执行矩阵的标量乘法："],
  [/Perform 1D convolution between an input signal and a kernel with zero padding and centered kernel\./g, "对输入信号和卷积核执行一维卷积，使用零填充并让卷积核居中。"],
  [/Perform 2D convolution between an input image and a kernel:/g, "对输入图像和卷积核执行二维卷积："],
  [/Perform 3D convolution between an input volume and a cubic kernel:/g, "对输入体数据和立方卷积核执行三维卷积："],
  [/Perform 1D average pooling on an input tensor:/g, "对输入张量执行一维平均池化："],
  [/Perform 2D average pooling on an input tensor:/g, "对输入张量执行二维平均池化："],
  [/Perform 3D average pooling on an input tensor:/g, "对输入张量执行三维平均池化："],
  [/Perform 1D max pooling on an input tensor:/g, "对输入张量执行一维最大池化："],
  [/Perform 2D max pooling on an input tensor:/g, "对输入张量执行二维最大池化："],
  [/Perform 3D max pooling on an input tensor:/g, "对输入张量执行三维最大池化："],
  [/Implement Batch Normalization over the batch dimension \(B\) for each feature channel in a 4D tensor\./g, "对四维张量的每个特征通道，在 batch 维度 $B$ 上实现批归一化。"],
  [/Implement RMS \(Root Mean Square\) Normalization for a 2D tensor\./g, "为二维张量实现 RMS（均方根）归一化。"],
  [/Implement Frobenius Normalization for a tensor of arbitrary shape\./g, "为任意形状的张量实现 Frobenius 归一化。"],
  [/Implement Layer Normalization for a 2D tensor\./g, "为二维张量实现层归一化。"],
  [/Implement Triplet Margin Loss:/g, "实现 Triplet Margin Loss："],
  [/Compute the cumulative sum \(also known as prefix sum or scan\) of an input array:/g, "计算输入数组的累积和（也称前缀和或 scan）："],
  [/Compute the cumulative product \(also known as prefix product or scan\) of an input array:/g, "计算输入数组的累积乘积（也称前缀乘积或 scan）："],
  [/Calculate 1D running sum with fix sized sliding window:/g, "使用固定大小滑动窗口计算一维滑动求和："],
  [/Compute the element-wise cosine similarity between two input tensors, `predictions` and `targets`\./g, "计算两个输入张量 `predictions` 和 `targets` 的逐元素余弦相似度。"],
  [/Apply a box blur filter to a grayscale image by averaging pixels in a square neighborhood:/g, "通过对方形邻域内的像素求平均，对灰度图像应用方框模糊滤波："],
  [/Detect edges in a grayscale image using simple gradient-based edge detection:/g, "使用基于梯度的简单边缘检测方法检测灰度图像中的边缘："],
  [/Perform binary thresholding on an input grayscale image:/g, "对输入灰度图像执行二值阈值化："],
  [/Convert an RGB image to grayscale using standard luminance weights/g, "使用标准亮度权重将 RGB 图像转换为灰度图"],
  [/Negate \*\*N\*\* elliptic curve points in parallel over the curve:/g, "在给定椭圆曲线上并行计算 **N** 个点的取负："],
  [/Multiply two polynomials over the Mersenne field:/g, "在 Mersenne 有限域上计算两个多项式的乘积："],
  [/Find the shortest path distances from a source node to all other nodes in a weighted directed graph\./g, "在带权有向图中，求源点到所有其他节点的最短路径距离。"],
  [/Given a weighted directed graph represented as an adjacency matrix, compute the shortest distances between all pairs of vertices using the Floyd-Warshall algorithm\./g, "给定由邻接矩阵表示的带权有向图，使用 Floyd-Warshall 算法计算所有点对之间的最短距离。"],
  [/Compute matrix multiplication where both matrix \$A\$ and matrix \$B\$ are stored in MXFP4 format\./g, "计算矩阵乘法，其中矩阵 $A$ 和矩阵 $B$ 均以 MXFP4 格式存储。"],
  [/Compute matrix multiplication where both matrix \$A\$ and matrix \$B\$ are stored in MXFP8 format\./g, "计算矩阵乘法，其中矩阵 $A$ 和矩阵 $B$ 均以 MXFP8 格式存储。"],
  [/Quantize an input FP32 matrix into MXFP4/g, "将输入 FP32 矩阵量化为 MXFP4"],
  [/Quantize an input FP32 matrix into MXFP8/g, "将输入 FP32 矩阵量化为 MXFP8"],
  [/Dequantize an MXFP4-encoded matrix back to FP32\./g, "将 MXFP4 编码的矩阵反量化回 FP32。"],
  [/Dequantize an MXFP8-encoded matrix back to FP32\./g, "将 MXFP8 编码的矩阵反量化回 FP32。"],
  [/Implement scaled dot-product attention, a key component of transformer architectures:/g, "实现缩放点积注意力，这是 Transformer 架构中的关键组件："],

  [/The .* operation slides/g, "该操作会滑动"],
  [/The convolution operation slides/g, "卷积操作会滑动"],
  [/The average pooling operation slides/g, "平均池化操作会滑动"],
  [/The max pooling operation slides/g, "最大池化操作会滑动"],
  [/a window of size/g, "大小为"],
  [/over the input tensor with/g, "的窗口，并以"],
  [/over the input data and computing the sum for each window/g, "的窗口，并为每个窗口计算求和"],
  [/over the input signal/g, "输入信号上的卷积核"],
  [/over the input image/g, "输入图像上的卷积核"],
  [/over the input volume/g, "输入体数据上的卷积核"],
  [/computing the sum of element-wise multiplications at each position/g, "并在每个位置计算逐元素乘积之和"],
  [/computing the average value within each window position/g, "并在每个窗口位置计算平均值"],
  [/computing the maximum value within each window position/g, "并在每个窗口位置计算最大值"],
  [/Zero padding is used at the boundaries/g, "边界处使用零填充"],
  [/Use zero padding at the boundaries where the kernel extends beyond the input image/g, "当卷积核越过输入图像边界时使用零填充"],
  [/Use zero padding at the boundaries where the kernel extends beyond the input signal/g, "当卷积核越过输入信号边界时使用零填充"],
  [/Use zero padding at the boundaries where the kernel extends beyond the input volume/g, "当卷积核越过输入体数据边界时使用零填充"],
  [/Use zero padding at the boundaries where the window extends beyond the input data/g, "当窗口越过输入数据边界时使用零填充"],
  [/The input tensor is stored in row-major order/g, "输入张量按行主序存储"],
  [/All matrices .* are stored in row-major order/g, "所有矩阵均按行主序存储"],
  [/Both matrices .* are stored in row-major order/g, "两个矩阵均按行主序存储"],
  [/Input matrices are stored in a row-major format/g, "输入矩阵按行主序存储"],
  [/The input tensor is a single-channel grayscale image/g, "输入张量是单通道灰度图像"],
  [/The result is normalized to the range \[0, 255\]\./g, "结果会归一化到 $[0, 255]$ 范围。"],
  [/This problem is adapted from/g, "本题改编自"],

  [/where /g, "其中 "],
  [/Where /g, "其中 "],
  [/A 2D tensor of shape/g, "形状为"],
  [/A 1D tensor of shape/g, "形状为"],
  [/A single array/g, "一个数组"],
  [/Arrays/g, "数组"],
  [/arrays/g, "数组"],
  [/ of arbitrary shape/g, "，形状任意"],
  [/ of size/g, "，大小为"],
  [/ of shape/g, "，形状为"],
  [/ representing/g, "，表示"],
  [/ with shape/g, "，形状为"],
  [/ with the same shape as input/g, "，形状与输入相同"],
  [/ with values in/g, "，取值范围为"],
  [/ with each element in/g, "，每个元素位于"],
  [/ in ascending order/g, "按升序"],
  [/The same array \$a\$ sorted in ascending order stored in \$b\$/g, "将数组 $a$ 按升序排序后存入 $b$"],
  [/integers/g, "整数"],
  [/integer/g, "整数"],
  [/edge from vertex/g, "从顶点"],
  [/to vertex/g, "到顶点"],
  [/if there is no direct edge/g, "如果没有直接边"],
  [/except diagonal which represents self-loops/g, "对角线除外，对角线表示自环"],
  [/All weights are positive integers/g, "所有权重均为正整数"],
  [/If no path exists between vertices/g, "如果两个顶点之间不存在路径"],
  [/the distance should be/g, "距离应为"],
  [/containing/g, "包含"],
  [/containing the/g, "包含"],
  [/arbitrary shape/g, "任意形状"],
  [/specified dimension/g, "指定维度"],
  [/0-based indexing/g, "从 0 开始编号"],
  [/Number of dimensions/g, "维度数量"],
  [/Dimension to reduce over/g, "要归约的维度"],
  [/Dimension to perform argmax over/g, "执行 argmax 的维度"],
  [/Dimension to perform argmin over/g, "执行 argmin 的维度"],
  [/Dimension to compute softmax over/g, "计算 softmax 的维度"],
  [/Array containing the dimensions of the input tensor/g, "包含输入张量各维度大小的数组"],
  [/The reduced dimension is kept with size 1/g, "被归约的维度保留为大小 1"],
  [/The dimension being reduced is removed from the output shape/g, "被归约的维度会从输出形状中移除"],
  [/same shape as input/g, "与输入相同的形状"],
  [/same shape/g, "相同形状"],
  [/input data/g, "输入数据"],
  [/output data/g, "输出数据"],
  [/input tensor/g, "输入张量"],
  [/output tensor/g, "输出张量"],
  [/input matrix/g, "输入矩阵"],
  [/input image/g, "输入图像"],
  [/input signal/g, "输入信号"],
  [/input volume/g, "输入体数据"],
  [/convolution kernel/g, "卷积核"],
  [/pooling window/g, "池化窗口"],
  [/Kernel size/g, "卷积核大小"],
  [/kernel size/g, "卷积核大小"],
  [/Stride/g, "步幅"],
  [/stride/g, "步幅"],
  [/Padding/g, "填充"],
  [/padding/g, "填充"],
  [/Batch size/g, "批大小"],
  [/source node/g, "源点"],
  [/shortest distances/g, "最短距离"],
  [/weighted adjacency matrix/g, "带权邻接矩阵"],
  [/direct edge/g, "直接边"],
  [/positive integers/g, "正整数"],
  [/unreachable/g, "不可达"],
  [/Loss value/g, "损失值"],
  [/scalar/g, "标量"],
  [/floating-point values/g, "浮点数值"],
  [/binary image/g, "二值图像"],
  [/grayscale image/g, "灰度图像"],
  [/row-major/g, "行主序"],
  [/column-major/g, "列主序"],
  [/Block size/g, "块大小"],
  [/block size/g, "块大小"],
  [/per-block/g, "逐块"],
  [/payload bytes/g, "载荷字节"],
  [/matrix dimensions/g, "矩阵维度"],
  [/logical shape/g, "逻辑形状"],
  [/shape/g, "形状"],
  [/size/g, "大小"],
  [/Tensor/g, "张量"],
  [/tensor/g, "张量"],
  [/Matrix/g, "矩阵"],
  [/matrix/g, "矩阵"],
  [/Vector/g, "向量"],
  [/vector/g, "向量"],
  [/Array/g, "数组"],
  [/array/g, "数组"],
  [/Output/g, "输出"],
  [/Input/g, "输入"],
];

function translateProblemMarkdown(description: string) {
  const protectedSpans: string[] = [];
  const protect = (value: string) =>
    value.replace(/```[\s\S]*?```|`[^`\n]+`/g, (match) => {
      const token = `@@SDUGPU_CODE_${protectedSpans.length}@@`;
      protectedSpans.push(match);
      return token;
    });
  const restore = (value: string) =>
    protectedSpans.reduce(
      (text, span, index) => text.replaceAll(`@@SDUGPU_CODE_${index}@@`, span),
      value
    );

  const protectedDescription = protect(description);
  const withHeadings = Object.entries(markdownHeadingZh).reduce(
    (text, [from, to]) => text.replaceAll(from, to),
    protectedDescription
  );

  const translated = markdownPhraseReplacements.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    withHeadings
  );

  return restore(translated);
}

export function getProblemTitle(
  slug: string,
  title: string,
  locale: Locale
) {
  if (locale === "zh") return problemTitleZh[slug] ?? title;
  return title;
}

export function getProblemDescription(
  slug: string,
  description: string,
  locale: Locale
) {
  if (locale === "en") return description;
  const exact = descriptionZh[slug];
  if (exact) return exact;

  return translateProblemMarkdown(description);
}
