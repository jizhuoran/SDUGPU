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
  "conv-square-3d": "三维立方卷积",
  "conv2d-relu-hardswish": "二维卷积融合 ReLU 与 HardSwish",
  "cosine-similarity": "余弦相似度损失",
  cumprod: "累积乘积",
  cumsum: "累积求和",
  "diagonal-matmul": "对角矩阵乘法",
  "ecc-point-negation": "批量椭圆曲线点取负",
  "edge-detect": "边缘检测",
  elu: "ELU 激活",
  "frobenius-norm": "弗罗贝尼乌斯范数归一化",
  gelu: "GELU 激活",
  "gemm-multiply-leakyrelu": "矩阵乘法融合逐元素乘法与带泄漏 ReLU",
  "gemm-relu": "矩阵乘法融合偏置与 ReLU",
  grayscale: "灰度转换",
  "hard-sigmoid": "硬 Sigmoid 激活",
  "hinge-loss": "合页损失",
  histogram: "图像直方图",
  "huber-loss": "胡伯损失",
  "kl-loss": "KL 散度",
  "l1-norm": "L1 范数归一化",
  "l2-norm": "L2 范数归一化",
  "layer-norm": "层归一化",
  "leaky-relu": "带泄漏 ReLU",
  "log-softmax": "对数 Softmax",
  "lower-trig-matmul": "下三角矩阵乘法",
  "matmul-3d": "三维张量矩阵乘法",
  "matmul-4d": "四维张量矩阵乘法",
  "matmul-sigmoid-sum": "矩阵乘法融合 Sigmoid 与求和",
  "matmul-swish": "矩阵乘法融合 Swish 与缩放",
  "matmul-swish-scaling": "矩阵乘法融合 Swish 与缩放因子",
  "matrix-multiplication": "矩阵乘法",
  "matrix-power": "矩阵整数幂",
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
  "mxfp4-gemm": "MXFP4 矩阵乘法",
  "mxfp4-quantize": "MXFP4 量化",
  "mxfp8-dequantize": "MXFP8 反量化",
  "mxfp8-gemm": "MXFP8 矩阵乘法",
  "mxfp8-quantize": "MXFP8 量化",
  "poly-multiply-ff": "有限域多项式乘法",
  "product-dim": "按维度求乘积",
  relu: "ReLU 激活",
  "rms-norm": "RMS 归一化",
  "running-sum-1d": "一维滑动求和",
  "scaled-dot-attention": "缩放点积注意力",
  selu: "SELU 激活",
  "shortest-path": "单源最短路径",
  sigmoid: "Sigmoid 激活",
  "soft-plus": "Softplus 激活",
  softmax: "Softmax",
  "square-matmul": "方阵矩阵乘法",
  "sum-dim": "按维度求和",
  swish: "Swish 激活",
  "symmetric-matmul": "对称矩阵乘法",
  tanh: "Tanh 激活",
  threshold: "图像阈值化",
  "triplet-margin": "三元组边距损失",
  "upper-trig-matmul": "上三角矩阵乘法",
  "vector-addition": "向量加法",
  "vector-multiply-ff": "有限域向量乘法",
};

type DescriptionBuilder = (source: string) => string;

function normalizeTestCases(section: string) {
  return section
    .replace(/(?<=\d)\s*x\s*(?=\d)/g, "×")
    .replace(/\bshape=/g, "形状=")
    .replace(/\bdim=/g, "维度=")
    .replace(/\bdist=normal/g, "分布=正态")
    .replace(/\bdist=uniform/g, "分布=均匀")
    .replace(/\bBatch=/g, "批大小=")
    .replace(/\bHeads=/g, "头数=")
    .replace(/\bSeq_len=/g, "序列长度=")
    .replace(/\bEmbed_dim=/g, "嵌入维度=")
    .replace(/\bbatch=/g, "批大小=")
    .replace(/\bembedding_dim=/g, "嵌入维度=")
    .replace(/\bkernel=/g, "卷积核=")
    .replace(/\bthreshold=/g, "阈值=")
    .replace(/\bbins=/g, "直方图桶数=")
    .replace(/\bpower=/g, "幂次=")
    .replace(/\bsize\s*=/g, "大小=")
    .replace(/\bscalar=/g, "标量=")
    .replace(/\bdilation=/g, "膨胀=")
    .replace(/\bd=/g, "膨胀=")
    .replace(/\balpha=/g, "α=")
    .replace(/\bScale=/g, "缩放=")
    .replace(/\bIn=/g, "输入特征=")
    .replace(/\bOut=/g, "输出特征=")
    .replace(/\bSparse_targets\b/g, "目标稀疏分布");
}

function testCases(source: string) {
  const match = /## Test Case Sizes\s*\n\n?([\s\S]*)$/.exec(source);
  if (!match) return "";
  return `## 测试规模\n\n${normalizeTestCases(match[1]!.trim())}`;
}

function adaptedFrom(source: string) {
  const match = /This problem is adapted from \[([^\]]+)\]\(([^)]+)\)/.exec(
    source
  );
  return match ? `- 本题改编自 [${match[1]}](${match[2]})` : "";
}

function compose(source: string, body: string, notes: string[] = []) {
  const noteLines = [...notes, adaptedFrom(source)].filter(Boolean);
  return [
    body.trim(),
    noteLines.length ? `## 说明\n${noteLines.join("\n")}` : "",
    testCases(source),
  ]
    .filter(Boolean)
    .join("\n\n");
}

function activation(
  source: string,
  name: string,
  formula: string,
  definition: string,
  extraNotes: string[] = []
) {
  return compose(
    source,
    `对输入矩阵执行 ${name} 激活函数：
${formula}

${definition}

## 输入
- 大小为 $M \\times N$ 的矩阵 $A$

## 输出
- 大小为 $M \\times N$ 的矩阵 $C$，保存激活后的结果`,
    ["- 矩阵 $A$ 和 $C$ 均按行主序存储", ...extraNotes]
  );
}

function simpleMatmul(
  source: string,
  intro: string,
  inputs: string,
  output: string,
  notes: string[] = []
) {
  return compose(
    source,
    `${intro}
$$
C[i][j] = \\sum_{k=0}^{K-1} A[i][k] \\cdot B[k][j]
$$

## 输入
${inputs}

## 输出
${output}`,
    ["- 相关矩阵均按行主序存储", ...notes]
  );
}

function reductionOverDim(
  source: string,
  verb: string,
  formula: string,
  resultLine: string,
  keepDimLine: string,
  tieNote?: string
) {
  return compose(
    source,
    `对输入张量的指定维度执行${verb}：
${formula}

其中 $d$ 是要处理的维度，$n$ 是张量维度数量，$S_d$ 是第 $d$ 维的大小。

## 输入
- 张量 \`input\`，形状为 $S_1 \\times S_2 \\times \\cdots \\times S_n$
- \`dim\`（$d$）：要处理的维度，从 0 开始编号
- \`shape\`：保存输入张量各维大小的数组
- \`ndim\`（$n$）：输入张量的维度数量

## 输出
- 张量 \`output\`，${resultLine}
  - ${keepDimLine}`,
    [
      "- 输入张量按行主序存储",
      tieNote ? `- ${tieNote}` : "",
      "- 输出索引和维度编号均从 0 开始",
    ].filter(Boolean)
  );
}

function pooling(
  source: string,
  dimensionality: "一维" | "二维" | "三维",
  kind: "平均" | "最大",
  formula: string,
  shapeLine: string,
  outputLine: string,
  notes: string[] = []
) {
  const window =
    dimensionality === "一维"
      ? "$k$"
      : dimensionality === "二维"
        ? "$k \\times k$"
        : "$k \\times k \\times k$";
  return compose(
    source,
    `对输入张量执行${dimensionality}${kind}池化：
${formula}

池化窗口大小为 ${window}，以步幅 $S$ 在输入上滑动，并按参数 $P$ 做零填充。

## 输入
- \`input\`：${shapeLine}
- \`kernel_size\`（$k$）：池化窗口大小
- \`stride\`（$S$）：相邻窗口之间的步幅
- \`padding\`（$P$）：输入两侧补零的数量
${kind === "最大" ? "- `dilation`：窗口内采样点之间的间隔" : ""}

## 输出
- \`output\`：${outputLine}`,
    notes
  );
}

const descriptionZh: Record<string, DescriptionBuilder> = {
  "vector-addition": (source) =>
    compose(
      source,
      `对两个向量执行逐元素加法：
$$
c_i = a_i + b_i
$$

## 输入
- 长度为 $N$ 的向量 $a$ 和 $b$

## 输出
- 长度为 $N$ 的向量 $c$，其中每个元素都是对应位置的和`
    ),

  "leaky-relu": (source) =>
    activation(
      source,
      "带泄漏 ReLU",
      `$$
C[i][j] = \\max(\\alpha \\cdot A[i][j], A[i][j])
$$`,
      `函数定义为：
$$
f(x) = \\begin{cases}
x & \\text{当 } x > 0 \\\\
\\alpha x & \\text{当 } x \\leq 0
\\end{cases}
$$
其中 $\\alpha$ 是负半轴斜率。`
    ),

  "matrix-multiplication": (source) =>
    simpleMatmul(
      source,
      "执行两个矩阵的矩阵乘法：",
      "- 大小为 $M \\times K$ 的矩阵 $A$\n- 大小为 $K \\times N$ 的矩阵 $B$",
      "- 大小为 $M \\times N$ 的矩阵 $C$"
    ),

  "scaled-dot-attention": (source) =>
    compose(
      source,
      `实现缩放点积注意力：
$$
\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{E}}\\right)V
$$

其中 $Q$、$K$、$V$ 分别是查询、键和值矩阵，$E$ 是嵌入维度。

## 输入
- 大小为 $B \\times H \\times S \\times E$ 的矩阵 $Q$、$K$、$V$

## 输出
- 大小为 $B \\times H \\times S \\times E$ 的矩阵 \`output\`

## 说明
- 输入矩阵按行主序存储
- 查询、键和值的嵌入维度相同
- 查询、键和值的注意力头数量相同`
    ),

  "all-pairs-shortest-path": (source) =>
    compose(
      source,
      `给定一个用邻接矩阵表示的带权有向图，使用弗洛伊德算法计算任意两点之间的最短距离。

## 输入
- \`adj_matrix\`：形状为 $n \\times n$ 的带权邻接矩阵
  - \`adj_matrix[i][j]\` 表示从顶点 \`i\` 到顶点 \`j\` 的边权
  - 若不存在直接边，则 \`adj_matrix[i][j] = 0\`；对角线表示自环
  - 所有边权均为正整数

## 输出
- 形状为 $n \\times n$ 的矩阵，保存所有点对之间的最短距离
- \`output[i][j]\` 表示从顶点 \`i\` 到顶点 \`j\` 的最短距离
- 若两个顶点之间不可达，对应距离为 \`-1\``
    ),

  argmax: (source) =>
    reductionOverDim(
      source,
      "最大值索引计算",
      `$$
\\text{output}[i_1,\\ldots,i_{d-1},i_{d+1},\\ldots,i_n] = \\arg\\max_{i_d} \\text{input}[i_1,\\ldots,i_d,\\ldots,i_n]
$$`,
      "形状为 $S_1 \\times \\cdots \\times S_{d-1} \\times S_{d+1} \\times \\cdots \\times S_n$",
      "保存指定维度上的最大值索引，被处理的维度会从输出形状中移除",
      "若最大值并列，返回第一次出现的位置"
    ),

  argmin: (source) =>
    reductionOverDim(
      source,
      "最小值索引计算",
      `$$
\\text{output}[i_1,\\ldots,i_{d-1},i_{d+1},\\ldots,i_n] = \\arg\\min_{i_d} \\text{input}[i_1,\\ldots,i_d,\\ldots,i_n]
$$`,
      "形状为 $S_1 \\times \\cdots \\times S_{d-1} \\times S_{d+1} \\times \\cdots \\times S_n$",
      "保存指定维度上的最小值索引，被处理的维度会从输出形状中移除",
      "若最小值并列，返回第一次出现的位置"
    ),

  "array-sort": (source) =>
    compose(
      source,
      `将整数数组按升序排序。

## 输入
- 长度为 $n$ 的整数数组 $a$

## 输出
- 数组 $b$，保存 $a$ 的升序排序结果`,
      ["- 输入数组在内存中连续存储"]
    ),

  "avg-pool-1d": (source) =>
    pooling(
      source,
      "一维",
      "平均",
      `$$
\\text{output}[i] = \\frac{1}{k}\\sum_{m=0}^{k-1} \\text{input}[S \\cdot i + m - P]
$$`,
      "长度为 $H$ 的一维输入张量",
      "长度为 $H_{out}$ 的一维张量，其中 $H_{out}=\\left\\lfloor\\frac{H+2P-k}{S}+1\\right\\rfloor$",
      ["- 指定填充时，越界位置按 0 参与平均", "- 分母始终使用完整窗口大小 $k$"]
    ),

  "avg-pool-2d": (source) =>
    pooling(
      source,
      "二维",
      "平均",
      `$$
\\text{output}[i,j] = \\frac{1}{k^2}\\sum_{m=0}^{k-1}\\sum_{n=0}^{k-1} \\text{input}[S \\cdot i + m - P, S \\cdot j + n - P]
$$`,
      "大小为 $H \\times W$ 的二维输入张量",
      "大小为 $H_{out} \\times W_{out}$ 的二维张量",
      [
        "- 输入和输出均按行主序存储",
        "- 指定填充时，越界位置按 0 参与平均",
        "- 分母始终使用完整窗口大小 $k^2$",
      ]
    ),

  "avg-pool-3d": (source) =>
    pooling(
      source,
      "三维",
      "平均",
      `$$
\\text{output}[i,j,k] = \\frac{1}{k^3}\\sum_{m=0}^{k-1}\\sum_{n=0}^{k-1}\\sum_{o=0}^{k-1} \\text{input}[S \\cdot i + m - P, S \\cdot j + n - P, S \\cdot k + o - P]
$$`,
      "大小为 $H \\times W \\times D$ 的三维输入张量",
      "大小为 $H_{out} \\times W_{out} \\times D_{out}$ 的三维张量",
      [
        "- 输入和输出均按行主序存储",
        "- 指定填充时，越界位置按 0 参与平均",
        "- 分母始终使用完整窗口大小 $k^3$",
      ]
    ),

  "batch-norm": (source) =>
    compose(
      source,
      `对四维张量的每个特征通道执行批归一化，统计量沿批维度 $B$ 计算：
$$
\\text{y} = \\frac{x - \\mathrm{E}[x]}{\\sqrt{\\mathrm{Var}[x] + \\epsilon}}
$$

其中均值和方差针对每个特征通道独立计算，$\\epsilon$ 用于提升数值稳定性。

## 输入
- 形状为 $B \\times F \\times D1 \\times D2$ 的张量 $X$
- $\\epsilon$：较小的浮点数，通常取 $10^{-5}$

## 输出
- 形状为 $B \\times F \\times D1 \\times D2$ 的归一化张量 $Y$`,
      [
        "- 每个特征通道和每个空间位置都独立计算批维度上的均值与方差",
        "- 本题只实现核心归一化，不包含可学习参数，也不维护运行时统计量",
      ]
    ),

  "box-blur": (source) =>
    compose(
      source,
      `对灰度图像应用方框模糊，即对方形邻域内的像素求平均：
$$
\\text{Output}[i][j] = \\frac{1}{N} \\sum_{u=-k}^{k} \\sum_{v=-k}^{k} \\text{Input}[i+u][j+v]
$$

其中 $k = \\lfloor \\text{kernel\\_size}/2 \\rfloor$，$N$ 是邻域内有效像素数量。卷积核越大，模糊效果越强。

## 输入
- 大小为 $height \\times width$ 的灰度图像
- 卷积核大小，必须为奇数，例如 3、5、7

## 输出
- 大小为 $height \\times width$ 的模糊后图像`,
      ["- 输入是单通道灰度图像", "- 边界处只对实际存在的像素求平均，不做填充"]
    ),

  "conv-1d": (source) =>
    compose(
      source,
      `对输入信号和卷积核执行一维卷积，边界使用零填充，卷积核以当前位置为中心。

令 $r = \\frac{K-1}{2}$，访问 $A$ 的越界位置时按 0 处理：
$$
\\text{C}[i] = \\sum_{j=0}^{K-1} \\text{A}[\\,i + j - r\\,] \\cdot \\text{B}[j]
$$

## 输入
- 长度为 $N$ 的向量 $A$，表示输入信号
- 长度为 $K$ 的向量 $B$，表示卷积核

## 输出
- 长度为 $N$ 的向量 $C$，表示卷积后的信号`,
      [
        "- $K$ 为奇数，且小于 $N$",
        "- 输出长度与输入相同",
        "- 语义与 PyTorch `torch.nn.functional.conv1d(..., padding=K//2)` 一致：这里使用互相关形式，卷积核不翻转",
      ]
    ),

  "conv-2d": (source) =>
    compose(
      source,
      `对输入图像和卷积核执行二维卷积：
$$
\\text{C}[i,j] = \\sum_{k=0}^{K_h-1}\\sum_{l=0}^{K_w-1} \\text{A}[i+k,j+l] \\cdot \\text{B}[k,l]
$$

## 输入
- 大小为 $H \\times W$ 的矩阵 $A$，表示输入图像
- 大小为 $K_h \\times K_w$ 的矩阵 $B$，表示卷积核
- $K_h$ 与 $K_w$ 均为奇数，且分别小于 $H$ 与 $W$

## 输出
- 大小为 $H \\times W$ 的矩阵 $C$，表示卷积后的图像`,
      [
        "- 矩阵 $A$、$B$ 和 $C$ 均按行主序存储",
        "- 边界处使用零填充",
        "- 卷积核以每个输出位置为中心",
      ]
    ),

  "conv2d-relu-hardswish": (source) =>
    compose(
      source,
      `依次执行二维卷积、ReLU 激活和 HardSwish 激活：

1. 二维卷积：
$$
C[i][j] = \\sum_{u=0}^{K_h-1} \\sum_{v=0}^{K_w-1} I\\left[i+u-\\frac{K_h-1}{2}\\right]\\left[j+v-\\frac{K_w-1}{2}\\right] \\cdot K[u][v]
$$

2. ReLU 激活：
$$
R[i][j] = \\max(0, C[i][j])
$$

3. HardSwish 激活：
$$
O[i][j] = R[i][j] \\cdot \\frac{\\text{ReLU6}(R[i][j] + 3)}{6}
$$

其中 $\\text{ReLU6}(x) = \\min(6, \\max(0, x))$。

## 输入
- \`image\`：大小为 $H \\times W$ 的图像
- \`kernel\`：大小为 $K_h \\times K_w$ 的卷积核，两个维度都必须为奇数

## 输出
- \`output\`：大小为 $H \\times W$ 的输出图像`,
      ["- 边界处使用零填充"]
    ),

  "conv-square-3d": (source) =>
    compose(
      source,
      `对输入体数据和立方卷积核执行三维卷积：
$$
\\text{C}[i,j,k] = \\sum_{x=0}^{K-1}\\sum_{y=0}^{K-1}\\sum_{z=0}^{K-1} \\text{A}[i+x,j+y,k+z] \\cdot \\text{B}[x,y,z]
$$

## 输入
- 大小为 $size \\times size \\times size$ 的体数据 $A$
- 大小为 $K \\times K \\times K$ 的立方卷积核 $B$
- $K$ 为奇数，且小于 $size$

## 输出
- 大小为 $size \\times size \\times size$ 的体数据 $C$`,
      [
        "- 体数据 $A$、$B$ 和 $C$ 均按行主序存储",
        "- 边界处使用零填充",
        "- 卷积核在三个维度上都以当前位置为中心",
      ]
    ),

  "cosine-similarity": (source) =>
    compose(
      source,
      `计算 \`predictions\` 与 \`targets\` 中每一对向量的负余弦相似度。

余弦相似度定义为：
$$
\\text{cosine\\_similarity}(x, y) = \\frac{x \\cdot y}{\\max(\\epsilon, ||x||) \\cdot \\max(\\epsilon, ||y||)}
$$

本题输出：
$$
\\text{loss}(x, y) = 1 - \\text{cosine\\_similarity}(x, y)
$$

## 输入
- 大小为 $N \\times D$ 的张量 \`predictions\`
- 大小为 $N \\times D$ 的张量 \`targets\`

## 输出
- 长度为 $N$ 的张量 \`output\`，其中 \`output[i]\` 是第 $i$ 对向量的负余弦相似度`,
      [
        "- 使用 $\\epsilon = 10^{-8}$ 避免除零",
        "- 向量范数按元素平方和的平方根计算",
      ]
    ),

  cumprod: (source) =>
    compose(
      source,
      `计算输入数组的累积乘积：
$$
\\text{output}[i] = \\prod_{j=0}^{i} \\text{input}[j]
$$

## 输入
- 长度为 $N$ 的向量 \`input\`

## 输出
- 长度为 $N$ 的向量 \`output\`，保存每个位置之前所有元素的乘积`,
      ["- 输出首元素等于输入首元素", "- 注意极大或极小数值带来的数值稳定性问题"]
    ),

  cumsum: (source) =>
    compose(
      source,
      `计算输入数组的累积和：
$$
\\text{output}[i] = \\sum_{j=0}^{i} \\text{input}[j]
$$

## 输入
- 长度为 $N$ 的向量 \`input\`

## 输出
- 长度为 $N$ 的向量 \`output\`，保存每个位置之前所有元素的和`,
      ["- 输出首元素等于输入首元素"]
    ),

  "diagonal-matmul": (source) =>
    compose(
      source,
      `计算对角矩阵与普通矩阵的乘法：
$$
C[i][j] = A[i][i] \\cdot B[i][j]
$$

## 输入
- 对角矩阵 $A$，大小为 $N \\times N$
- 矩阵 $B$，大小为 $N \\times N$

## 输出
- 矩阵 $C = AB$，大小为 $N \\times N$`,
      ["- 对角矩阵只需使用主对角线元素", "- 矩阵按行主序存储"]
    ),

  "ecc-point-negation": (source) =>
    compose(
      source,
      `在椭圆曲线上批量计算点取负：
$$
(x_i, y_i) \\mapsto (x_i, -y_i \\bmod p)
$$

## 输入
- 长度为 $N$ 的点坐标数组，按 $(x, y)$ 成对存储
- 素数模数 $p$

## 输出
- 数组 \`out_xy\`，按 $(x, -y \\bmod p)$ 成对保存结果`,
      ["- 必须为每个输入点产生精确的有限域取负结果"]
    ),

  "edge-detect": (source) =>
    compose(
      source,
      `使用简单梯度方法检测灰度图像边缘：
$$
G_x = \\frac{\\text{Input}[i][j+1] - \\text{Input}[i][j-1]}{2}, \\quad
G_y = \\frac{\\text{Input}[i+1][j] - \\text{Input}[i-1][j]}{2}
$$
$$
\\text{Output}[i][j] = \\sqrt{G_x^2 + G_y^2}
$$

## 输入
- 大小为 $height \\times width$ 的灰度图像

## 输出
- 大小为 $height \\times width$ 的边缘强度图`,
      ["- 只计算内部像素，边界像素保持为 0", "- 结果归一化到 $[0, 255]$ 范围"]
    ),

  elu: (source) =>
    activation(
      source,
      "ELU",
      `$$
C[i][j] = \\begin{cases}
A[i][j] & \\text{当 } A[i][j] > 0 \\\\
\\alpha(e^{A[i][j]} - 1) & \\text{当 } A[i][j] \\leq 0
\\end{cases}
$$`,
      "$\\alpha$ 控制负半轴的饱和值，默认测试使用给定参数。",
      ["- ELU 相比 ReLU 在 0 附近更平滑，有助于缓解神经元失活问题"]
    ),

  "frobenius-norm": (source) =>
    compose(
      source,
      `对任意形状张量执行弗罗贝尼乌斯范数归一化，即用整个张量的弗罗贝尼乌斯范数缩放每个元素：
$$
\\text{y} = \\frac{x}{\\|x\\|_F}
$$
$$
\\|x\\|_F = \\sqrt{\\sum_i x_i^2}
$$

## 输入
- 任意形状的张量 $X$
- 张量元素总数 \`size\`

## 输出
- 与输入形状相同的张量 $Y$`,
      [
        "- 弗罗贝尼乌斯范数等价于把张量展平成向量后计算 L2 范数",
        "- 所有输出元素使用同一个归一化因子",
      ]
    ),

  gelu: (source) =>
    activation(
      source,
      "GELU",
      `$$
C[i][j] = A[i][j] \\cdot \\Phi(A[i][j])
$$`,
      `其中 $\\Phi$ 是标准正态分布的累积分布函数。可使用常见近似：
$$
\\text{GELU}(x) \\approx 0.5x\\left(1 + \\tanh\\left(\\sqrt{\\frac{2}{\\pi}}(x + 0.044715x^3)\\right)\\right)
$$`,
      ["- 请实现上述近似公式", "- GELU 常见于 Transformer 类神经网络"]
    ),

  "gemm-multiply-leakyrelu": (source) =>
    compose(
      source,
      `依次执行矩阵乘法、逐元素乘法和带泄漏 ReLU 激活：
$$
O[i][j] = \\text{LeakyReLU}\\left(\\left(\\sum_{k=0}^{K-1} A[i][k] \\cdot B[k][j]\\right) \\cdot C[i][j], \\alpha\\right)
$$

其中：
$$
\\text{LeakyReLU}(x, \\alpha) = \\begin{cases}
x & \\text{当 } x \\geq 0 \\\\
\\alpha x & \\text{当 } x < 0
\\end{cases}
$$

## 输入
- 大小为 $M \\times K$ 的矩阵 $A$
- 大小为 $K \\times N$ 的矩阵 $B$
- 大小为 $M \\times N$ 的矩阵 $C$，用于逐元素乘法
- 带泄漏 ReLU 参数 $\\alpha$

## 输出
- 大小为 $M \\times N$ 的矩阵 $O$`,
      ["- 所有矩阵均按行主序存储"]
    ),

  "gemm-relu": (source) =>
    compose(
      source,
      `执行矩阵乘法，加上偏置后再应用 ReLU：
$$
Y[i][j] = \\max\\left(0, \\sum_{k=0}^{K-1} X[i][k] \\cdot W[j][k] + b[j]\\right)
$$

## 输入
- 输入矩阵 $X$，大小为 $batch\\_size \\times input\\_features$
- 权重矩阵 $W$，大小为 $output\\_features \\times input\\_features$
- 偏置向量 $b$，长度为 $output\\_features$

## 输出
- 输出矩阵 $Y$，大小为 $batch\\_size \\times output\\_features$`,
      ["- 所有矩阵均按行主序存储"]
    ),

  grayscale: (source) =>
    compose(
      source,
      `使用标准亮度权重将三通道彩色图像转换为灰度图：
$$
\\text{Gray} = 0.299R + 0.587G + 0.114B
$$

该公式近似人眼对不同颜色通道亮度的感知，其中绿色通道权重最高。

## 输入
- 大小为 $height \\times width$ 的三通道彩色图像

## 输出
- 大小为 $height \\times width$ 的灰度图像`,
      [
        "- 输入按 HWC 格式存储，三个通道在内存中交错排列",
        "- 每个像素输出一个灰度值",
      ]
    ),

  "hard-sigmoid": (source) =>
    activation(
      source,
      "硬 Sigmoid",
      `$$
C[i][j] = \\text{hard\\_sigmoid}(A[i][j])
$$`,
      `函数定义为：
$$
\\text{hard\\_sigmoid}(x) =
\\begin{cases}
0 & \\text{当 } x \\leq -3 \\\\
1 & \\text{当 } x \\geq 3 \\\\
\\frac{x}{6} + \\frac{1}{2} & \\text{其他情况}
\\end{cases}
$$`,
      ["- 硬 Sigmoid 是标准 Sigmoid 的分段线性近似"]
    ),

  "hinge-loss": (source) =>
    compose(
      source,
      `计算预测值与二分类标签之间的逐元素合页损失：
$$
\\text{loss}(x, y) = \\max(0, 1 - xy)
$$

其中 $y \\in \\{-1, 1\\}$。本题要求输出每个元素的损失：
$$
\\text{output}[i] = \\max(0, 1 - x_i y_i)
$$

## 输入
- 长度为 $N$ 的张量 \`predictions\`，保存实数预测值
- 长度为 $N$ 的张量 \`targets\`，每个元素为 -1 或 1

## 输出
- 长度为 $N$ 的张量 \`output\`，保存逐元素合页损失`,
      [
        "- 所有张量都是连续存储的一维数组，或可视为一维数组",
        "- 当预测符号正确且幅值不小于 1 时，损失为 0",
      ]
    ),

  histogram: (source) =>
    compose(
      source,
      `统计灰度图像中各像素强度出现的次数：
$$
\\text{Histogram}[k] = \\sum_{i=0}^{H-1} \\sum_{j=0}^{W-1} \\mathbf{1}_{\\{\\text{Input}[i][j] = k\\}}
$$

其中指示函数在条件成立时为 1，否则为 0。

## 输入
- 大小为 $height \\times width$ 的灰度图像
- 直方图桶数，通常为 64、128 或 256

## 输出
- 长度为 $num\\_bins$ 的直方图数组，保存每个强度值对应的像素数量`,
      [
        "- 输入像素值范围为 $[0, num\\_bins-1]$",
        "- 所有直方图桶的总和等于图像像素总数",
      ]
    ),

  "huber-loss": (source) =>
    compose(
      source,
      `计算 \`predictions\` 与 \`targets\` 之间的逐元素胡伯损失。本题采用 $\\delta=1$，也就是平滑 L1 损失：
$$
z_i = \\begin{cases}
0.5 (x_i - y_i)^2 & \\text{当 } |x_i - y_i| < 1 \\\\
|x_i - y_i| - 0.5 & \\text{其他情况}
\\end{cases}
$$

本题只要求计算求和或平均之前的逐元素损失：
$$
\\text{output}[i] = z_i
$$

## 输入
- 长度为 $N$ 的张量 \`predictions\`
- 长度为 $N$ 的张量 \`targets\`

## 输出
- 长度为 $N$ 的张量 \`output\`，其中 \`output[i]\` 为第 $i$ 个元素的胡伯损失`,
      ["- 所有张量都是连续存储的一维数组，或可视为一维数组"]
    ),

  "kl-loss": (source) =>
    compose(
      source,
      `计算两个概率分布之间的逐元素 KL 散度贡献。

离散分布 $P$ 与 $Q$ 的 KL 散度定义为：
$$
D_{KL}(P || Q) = \\sum_i P(i) \\log\\left(\\frac{P(i)}{Q(i)}\\right)
$$

本题只计算求和之前的逐元素贡献：
$$
\\text{output}[i] = \\text{targets}[i] \\cdot (\\log(\\text{targets}[i]) - \\log(\\text{predictions}[i]))
$$

## 输入
- 长度为 $N$ 的张量 \`predictions\`，表示分布 $Q$，所有值大于 0 且总和为 1
- 长度为 $N$ 的张量 \`targets\`，表示分布 $P$，所有值不小于 0 且总和为 1

## 输出
- 长度为 $N$ 的张量 \`output\`，保存逐元素 KL 散度贡献`,
      [
        "- 当 `targets[i]` 为 0 时，对应贡献按约定为 0",
        "- 计算对数前可加入较小的 $\\epsilon$，例如 $10^{-10}$，以避免数值问题",
      ]
    ),

  "l1-norm": (source) =>
    compose(
      source,
      `对二维张量逐行执行 L1 范数归一化。每一行都除以该行元素绝对值之和：
$$
\\text{y} = \\frac{x}{\\sum |x_i|}
$$

## 输入
- 形状为 $B \\times D$ 的张量 $X$

## 输出
- 形状为 $B \\times D$ 的张量 $Y$`,
      [
        "- 可在分母中加入 $\\epsilon = 10^{-10}$ 避免除零",
        "- 归一化后，每一行的 L1 范数应约为 1",
      ]
    ),

  "l2-norm": (source) =>
    compose(
      source,
      `对二维张量逐行执行 L2 范数归一化。每一行都除以该行的欧几里得范数：
$$
\\text{y} = \\frac{x}{\\sqrt{\\sum x_i^2}}
$$

## 输入
- 形状为 $B \\times D$ 的张量 $X$

## 输出
- 形状为 $B \\times D$ 的张量 $Y$`,
      [
        "- 可在分母中加入 $\\epsilon = 10^{-10}$ 避免除零",
        "- 归一化后，每一行的 L2 范数应约为 1",
      ]
    ),

  "layer-norm": (source) =>
    compose(
      source,
      `对四维张量的最后三个维度 $F$、$D1$、$D2$ 执行层归一化：
$$
\\text{y} = \\frac{x - \\mathrm{E}[x]}{\\sqrt{\\mathrm{Var}[x] + \\epsilon}} \\cdot \\gamma + \\beta
$$

均值和方差在每个样本内部独立计算，$\\gamma$ 与 $\\beta$ 分别是逐元素缩放和平移参数。

## 输入
- 形状为 $B \\times F \\times D1 \\times D2$ 的张量 $X$
- 形状为 $F \\times D1 \\times D2$ 的向量 $\\gamma$
- 形状为 $F \\times D1 \\times D2$ 的向量 $\\beta$
- $\\epsilon$：较小的浮点数，通常取 $10^{-5}$

## 输出
- 形状为 $B \\times F \\times D1 \\times D2$ 的张量 $Y$`,
      [
        "- 对每个批内样本，独立统计最后三个维度的均值和方差",
        "- 使用给定的 $\\gamma$ 和 $\\beta$ 完成仿射变换",
      ]
    ),

  "log-softmax": (source) =>
    compose(
      source,
      `按行计算对数 Softmax：
$$
\\text{output}_{ij} = \\log\\left(\\frac{e^{\\text{input}_{ij}}}{\\sum_{k=0}^{N-1} e^{\\text{input}_{ik}}}\\right)
$$

## 输入
- 大小为 $M \\times N$ 的矩阵 \`input\`

## 输出
- 大小为 $M \\times N$ 的矩阵 \`output\`，保存每一行的对数 Softmax 值`,
      [
        "- 输入和输出矩阵均按行主序存储",
        "- 每一行独立计算",
        "- 为提升数值稳定性，可先减去该行最大值",
      ]
    ),

  "lower-trig-matmul": (source) =>
    compose(
      source,
      `执行两个下三角矩阵的矩阵乘法：
$$
C = A \\cdot B
$$

结果 $C$ 仍然是下三角矩阵。

## 输入
- 大小为 $N \\times N$ 的下三角矩阵 $A$
- 大小为 $N \\times N$ 的下三角矩阵 $B$

## 输出
- 大小为 $N \\times N$ 的下三角矩阵 $C$`,
      ["- 所有矩阵均按行主序存储", "- 若 $i < j$，下三角矩阵对应元素为 0"]
    ),

  "matmul-3d": (source) =>
    compose(
      source,
      `对三维张量的每个切片执行矩阵乘法：
$$
C[b][i][j] = \\sum_{k=0}^{K-1} A[b][i][k] \\cdot B[k][j]
$$

## 输入
- 张量 $A$，大小为 $B \\times M \\times K$
- 矩阵 $B$，大小为 $K \\times N$

## 输出
- 张量 $C$，大小为 $B \\times M \\times N$`,
      ["- 所有张量和矩阵均按行主序存储"]
    ),

  "matmul-4d": (source) =>
    compose(
      source,
      `对四维张量的每个切片执行矩阵乘法：
$$
C[b][h][i][j] = \\sum_{l=0}^{L-1} A[b][h][i][l] \\cdot B[l][j]
$$

## 输入
- 张量 $A$，大小为 $B \\times H \\times M \\times L$
- 矩阵 $B$，大小为 $L \\times N$

## 输出
- 张量 $C$，大小为 $B \\times H \\times M \\times N$`,
      ["- 所有张量和矩阵均按行主序存储"]
    ),

  "matmul-sigmoid-sum": (source) =>
    compose(
      source,
      `执行矩阵乘法、Sigmoid 激活，然后对结果求和：
$$
\\text{result} = \\sum_{i=0}^{M-1}\\sum_{j=0}^{N-1}\\sigma\\left(\\sum_{k=0}^{K-1} A[i][k] \\cdot B[k][j]\\right)
$$

其中 $\\sigma(x)=\\frac{1}{1+e^{-x}}$。

## 输入
- 大小为 $M \\times K$ 的矩阵 $A$
- 大小为 $K \\times N$ 的矩阵 $B$

## 输出
- 一个标量，表示所有激活结果之和`,
      ["- 输入矩阵按行主序存储"]
    ),

  "matmul-swish": (source) =>
    compose(
      source,
      `执行线性变换、Swish 激活和缩放：
$$
\\text{output} = \\text{scaling\\_factor} \\cdot z \\cdot \\sigma(z)
$$
其中：
$$
z = \\text{input} \\cdot \\text{weight}^T + \\text{bias}, \\quad
\\sigma(x)=\\frac{1}{1+e^{-x}}
$$

## 输入
- \`input_matrix\`：大小为 $batch\\_size \\times in\\_features$ 的矩阵
- \`weight_matrix\`：大小为 $out\\_features \\times in\\_features$ 的矩阵
- \`bias\`：长度为 $out\\_features$ 的向量
- \`scaling_factor\`：最终缩放因子

## 输出
- \`output\`：大小为 $batch\\_size \\times out\\_features$ 的矩阵`,
      ["- 所有矩阵均按行主序存储"]
    ),

  "matmul-swish-scaling": (source) =>
    compose(
      source,
      `执行矩阵乘法、Swish 激活和缩放：
$$
O[i][j] = scale \\cdot \\left(\\sum_{k=0}^{K-1} A[i][k] \\cdot B[k][j]\\right) \\cdot \\sigma\\left(\\sum_{k=0}^{K-1} A[i][k] \\cdot B[k][j]\\right)
$$

其中 $\\sigma(x)=\\frac{1}{1+e^{-x}}$。

## 输入
- 大小为 $M \\times K$ 的矩阵 $A$
- 大小为 $K \\times N$ 的矩阵 $B$
- 缩放因子 $scale$

## 输出
- 大小为 $M \\times N$ 的矩阵 $O$`,
      ["- 输入矩阵按行主序存储"]
    ),

  "matrix-power": (source) =>
    compose(
      source,
      `计算方阵的非负整数次幂：
$$
C = A^n
$$

## 输入
- 大小为 $size \\times size$ 的方阵 $A$
- 非负整数幂次 $n$

## 输出
- 大小为 $size \\times size$ 的矩阵 $C = A^n$

## 数学定义
- $A^0 = I$
- $A^1 = A$
- $A^2 = A \\times A$
- $A^n = \\underbrace{A \\times A \\times \\cdots \\times A}_{n \\text{ 次}}$`,
      ["- 矩阵 $A$ 按行主序存储"]
    ),

  "matrix-scalar": (source) =>
    compose(
      source,
      `执行矩阵与标量的乘法：
$$
C[i][j] = A[i][j] \\cdot s
$$

## 输入
- 大小为 $M \\times N$ 的矩阵 $A$
- 标量 $s$

## 输出
- 大小为 $M \\times N$ 的矩阵 $C$`,
      ["- 矩阵按行主序存储"]
    ),

  "matrix-vector": (source) =>
    compose(
      source,
      `执行矩阵向量乘法：
$$
y[i] = \\sum_{k=0}^{K-1} A[i][k] \\cdot x[k]
$$

## 输入
- 大小为 $M \\times K$ 的矩阵 $A$
- 长度为 $K$ 的向量 $x$

## 输出
- 长度为 $M$ 的向量 $y$`,
      ["- 矩阵按行主序存储"]
    ),

  "max-dim": (source) =>
    reductionOverDim(
      source,
      "最大值归约",
      `$$
\\text{output}[i_1,\\ldots,i_{d-1},1,i_{d+1},\\ldots,i_n] = \\max_{i_d=0}^{S_d-1} \\text{input}[i_1,\\ldots,i_d,\\ldots,i_n]
$$`,
      "形状为 $S_1 \\times \\cdots \\times S_{d-1} \\times 1 \\times S_{d+1} \\times \\cdots \\times S_n$",
      "被归约的维度保留为大小 1"
    ),

  "max-pool-1d": (source) =>
    pooling(
      source,
      "一维",
      "最大",
      `$$
\\text{output}[i] = \\max_{m=0}^{k-1} \\text{input}[S \\cdot i + m \\cdot D - P]
$$`,
      "长度为 $H$ 的一维输入张量",
      "长度为 $H_{out}$ 的一维张量",
      ["- 指定填充时，越界位置不参与最大值计算", "- 输入和输出均按行主序存储"]
    ),

  "max-pool-2d": (source) =>
    pooling(
      source,
      "二维",
      "最大",
      `$$
\\text{output}[i,j] = \\max_{m,n=0}^{k-1} \\text{input}[S \\cdot i + m \\cdot D - P, S \\cdot j + n \\cdot D - P]
$$`,
      "大小为 $H \\times W$ 的二维输入张量",
      "大小为 $H_{out} \\times W_{out}$ 的二维张量",
      ["- 指定填充时，越界位置不参与最大值计算", "- 输入和输出均按行主序存储"]
    ),

  "max-pool-3d": (source) =>
    pooling(
      source,
      "三维",
      "最大",
      `$$
\\text{output}[i,j,k] = \\max_{m,n,o=0}^{k-1} \\text{input}[S \\cdot i + m \\cdot D - P, S \\cdot j + n \\cdot D - P, S \\cdot k + o \\cdot D - P]
$$`,
      "大小为 $H \\times W \\times D$ 的三维输入张量",
      "大小为 $H_{out} \\times W_{out} \\times D_{out}$ 的三维张量",
      ["- 指定填充时，越界位置不参与最大值计算", "- 输入和输出均按行主序存储"]
    ),

  "mean-dim": (source) =>
    reductionOverDim(
      source,
      "均值归约",
      `$$
\\text{output}[i_1,\\ldots,i_{d-1},1,i_{d+1},\\ldots,i_n] = \\frac{1}{S_d}\\sum_{i_d=0}^{S_d-1} \\text{input}[i_1,\\ldots,i_d,\\ldots,i_n]
$$`,
      "形状为 $S_1 \\times \\cdots \\times S_{d-1} \\times 1 \\times S_{d+1} \\times \\cdots \\times S_n$",
      "被归约的维度保留为大小 1"
    ),

  "min-dim": (source) =>
    reductionOverDim(
      source,
      "最小值归约",
      `$$
\\text{output}[i_1,\\ldots,i_{d-1},1,i_{d+1},\\ldots,i_n] = \\min_{i_d=0}^{S_d-1} \\text{input}[i_1,\\ldots,i_d,\\ldots,i_n]
$$`,
      "形状为 $S_1 \\times \\cdots \\times S_{d-1} \\times 1 \\times S_{d+1} \\times \\cdots \\times S_n$",
      "被归约的维度保留为大小 1"
    ),

  "min-spanning-tree": (source) =>
    compose(
      source,
      `给定带权无向图，求连接所有顶点且总边权最小的生成树。
$$
\\text{MST} = \\arg\\min_{T \\in \\text{trees}} \\sum_{(u,v) \\in T} w(u,v)
$$

## 输入
- 大小为 $N \\times N$ 的带权邻接矩阵，表示无向图
- 若 $A[i][j] = 0$，表示顶点 $i$ 与顶点 $j$ 之间没有边
- 矩阵对称，所有存在的边权均为正数

## 输出
- 最小生成树的总边权`,
      ["- 图应连通；若测试中出现不可连通图，以题目参考实现为准"]
    ),

  mse_loss: (source) =>
    compose(
      source,
      `计算预测值与目标值之间的均方误差损失：
$$
\\text{MSE} = \\frac{1}{N} \\sum_{i=1}^{N} (y_i - \\hat{y}_i)^2
$$

其中 $N$ 是元素总数。

## 输入
- 任意形状的张量 \`predictions\`
- 与 \`predictions\` 形状相同的张量 \`targets\`
- \`shape\`：保存输入张量各维大小的数组
- \`ndim\`：输入张量的维度数量

## 输出
- 标量 \`output\`，保存均方误差`,
      ["- 输入张量按行主序存储", "- 需要支持任意形状输入"]
    ),

  "mxfp4-dequantize": (source) =>
    compose(
      source,
      `将 MXFP4 编码矩阵反量化回 FP32。概念上，需要把打包的 MXFP4 数据和缩放因子解码为矩阵 $A_{\\mathrm{dequant}} \\in \\mathbb{R}^{M \\times K}$。
$$
out_{ij} = A_{\\mathrm{dequant},ij}
$$

## 输入
- $q$：矩阵 $A$ 的 MXFP4 打包数据，形状为 $M \\times K$，以 \`uint8_t\` 指针给出
- $scale$：$A$ 的逐块 E8M0 缩放字节，逻辑形状为 $M \\times K/32$
- $M$、$K$：矩阵维度，且 $K$ 能被 32 整除

## 输出
- $out$：形状为 $M \\times K$ 的 FP32 矩阵`,
      [
        "- 反量化语义与 TorchAO MXTensor 的 `to_dtype` 保持一致",
        "- `scale` 采用行主序块布局，不是交错重排后的布局",
        "- MXFP4 格式说明见 [OCP Microscaling Formats](https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf)",
      ]
    ),

  "mxfp4-gemm": (source) =>
    compose(
      source,
      `计算两个 MXFP4 矩阵的矩阵乘法。参考语义如下：
$$
c_{ij} = \\sum_{\\ell=0}^{K-1} A_{\\mathrm{dequant},i\\ell} \\, B_{\\mathrm{dequant},j\\ell}
$$

矩阵 $B$ 以 $N \\times K$ 的行主序形式存储，因此逻辑上计算的是：
$$
C = A_{\\mathrm{dequant}} B_{\\mathrm{dequant}}^T
$$

## 输入
- $q_a$：矩阵 $A$ 的 MXFP4 数据，形状为 $M \\times K$
- $scale_a$：$A$ 的逐块 E8M0 缩放字节，逻辑形状为 $M \\times K/32$
- $q_b$：矩阵 $B$ 的 MXFP4 数据，形状为 $N \\times K$
- $scale_b$：$B$ 的逐块 E8M0 缩放字节，逻辑形状为 $N \\times K/32$
- $M$、$N$、$K$：矩阵维度，且 $K$ 和 $N$ 能被 32 整除

## 输出
- $c$：形状为 $M \\times N$ 的 FP32 矩阵`,
      [
        "- 优化实现应尽量边解码边计算，避免完整物化 FP32 中间矩阵",
        "- 缩放张量按 `scaled_mm` 使用的同一块级交错重排格式传入，不要再次重排",
      ]
    ),

  "mxfp4-quantize": (source) =>
    compose(
      source,
      `将 FP32 输入矩阵量化为 MXFP4。量化约定如下：
- 沿 $K$ 维每 32 个元素为一块
- 每块使用 E8M0 缩放因子
- 数据部分使用 FP4 E2M1 打包字节

## 输入
- $a$：指向行主序 FP32 张量的指针，形状为 $M \\times K$
- $M$、$K$：矩阵维度，且 $K$ 能被 32 整除

## 输出
- $q$：MXFP4 载荷字节，打包 E2M1 值，形状为 $M \\times K/2$
- $scale$：逐块 E8M0 缩放字节，行主序布局，形状为 $M \\times K/32$`,
      [
        "- 需要输出行主序块布局，不做额外交错重排",
        "- 校验时会通过 TorchAO MXTensor 反量化参考结果和提交结果后再比较",
        "- MXFP4 格式说明见 [OCP Microscaling Formats](https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf)",
      ]
    ),

  "mxfp8-dequantize": (source) =>
    compose(
      source,
      `将 MXFP8 编码矩阵反量化回 FP32。概念上，需要把 MXFP8 数据和缩放因子解码为矩阵 $A_{\\mathrm{dequant}} \\in \\mathbb{R}^{M \\times K}$。
$$
out_{ij} = A_{\\mathrm{dequant},ij}
$$

## 输入
- $q$：矩阵 $A$ 的 MXFP8 数据，形状为 $M \\times K$，以 \`uint8_t\` 指针给出
- $scale$：$A$ 的逐块 E8M0 缩放字节，逻辑形状为 $M \\times K/32$
- $M$、$K$：矩阵维度，且 $K$ 能被 32 整除

## 输出
- $out$：形状为 $M \\times K$ 的 FP32 矩阵`,
      [
        "- 反量化语义与 TorchAO MXTensor 的 `to_dtype` 保持一致",
        "- `scale` 采用行主序块布局，不是交错重排后的布局",
        "- MXFP8 格式说明见 [OCP Microscaling Formats](https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf)",
      ]
    ),

  "mxfp8-gemm": (source) =>
    compose(
      source,
      `计算两个 MXFP8 矩阵的矩阵乘法。参考语义如下：
$$
c_{ij} = \\sum_{\\ell=0}^{K-1} A_{\\mathrm{dequant},i\\ell} \\, B_{\\mathrm{dequant},j\\ell}
$$

矩阵 $B$ 以 $N \\times K$ 的行主序形式存储，因此逻辑上计算的是：
$$
C = A_{\\mathrm{dequant}} B_{\\mathrm{dequant}}^T
$$

## 输入
- $q_a$：矩阵 $A$ 的 MXFP8 数据，形状为 $M \\times K$
- $scale_a$：$A$ 的逐块 E8M0 缩放字节，逻辑形状为 $M \\times K/32$
- $q_b$：矩阵 $B$ 的 MXFP8 数据，形状为 $N \\times K$
- $scale_b$：$B$ 的逐块 E8M0 缩放字节，逻辑形状为 $N \\times K/32$
- $M$、$N$、$K$：矩阵维度，且 $K$ 和 $N$ 能被 32 整除

## 输出
- $c$：形状为 $M \\times N$ 的 FP32 矩阵`,
      [
        "- 优化实现应尽量边解码边计算，避免完整物化 FP32 中间矩阵",
        "- 缩放张量按 `scaled_mm` 使用的同一块级交错重排格式传入，不要再次重排",
        "- MXFP8 格式说明见 [OCP Microscaling Formats](https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf)",
      ]
    ),

  "mxfp8-quantize": (source) =>
    compose(
      source,
      `将 FP32 输入矩阵量化为 MXFP8。量化约定如下：
- 沿 $K$ 维每 32 个元素为一块
- 每块使用 E8M0 缩放因子
- 数据部分使用 FP8 E4M3 存储字节

## 输入
- $a$：指向行主序 FP32 张量的指针，形状为 $M \\times K$
- $M$、$K$：矩阵维度，且 $K$ 能被 32 整除

## 输出
- $q$：MXFP8 载荷字节，形状为 $M \\times K$
- $scale$：逐块 E8M0 缩放字节，行主序布局，形状为 $M \\times K/32$`,
      [
        "- 需要输出行主序块布局，不做额外交错重排",
        "- 校验时会通过 TorchAO MXTensor 反量化参考结果和提交结果后再比较",
        "- MXFP8 格式说明见 [OCP Microscaling Formats](https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf)",
      ]
    ),

  "poly-multiply-ff": (source) =>
    compose(
      source,
      `在 Mersenne 有限域上计算两个多项式的乘积：
$$
p = 2^{31} - 1 = 2147483647
$$

设 $a(x)$ 和 $b(x)$ 是次数为 $n-1$ 的多项式，系数均位于 $[0,p)$：
$$
a(x) = \\sum_{i=0}^{n-1} a_i x^i, \\qquad
b(x) = \\sum_{j=0}^{n-1} b_j x^j
$$

计算：
$$
c(x) = a(x) \\cdot b(x) \\pmod{p}
$$

输出系数满足：
$$
c_k = \\sum_{i+j=k} a_i b_j \\pmod{p}
$$

## 输入
- 两个长度为 $n$ 的数组 \`d_input1\` 和 \`d_input2\`，元素位于 $[0,p)$
- $n$ 是 2 的幂，例如 64、256、1024

## 输出
- 长度为 $2n-1$ 的数组 \`d_output\`，保存 $c(x)$ 的系数`,
      ["- 所有加法和乘法中间结果都必须模 $p$ 规约"]
    ),

  "product-dim": (source) =>
    reductionOverDim(
      source,
      "乘积归约",
      `$$
\\text{output}[i_1,\\ldots,i_{d-1},1,i_{d+1},\\ldots,i_n] = \\prod_{i_d=0}^{S_d-1} \\text{input}[i_1,\\ldots,i_d,\\ldots,i_n]
$$`,
      "形状为 $S_1 \\times \\cdots \\times S_{d-1} \\times 1 \\times S_{d+1} \\times \\cdots \\times S_n$",
      "被归约的维度保留为大小 1"
    ),

  relu: (source) =>
    activation(
      source,
      "ReLU",
      `$$
C[i][j] = \\max(0, A[i][j])
$$`,
      `函数定义为：
$$
f(x) = \\begin{cases}
x & \\text{当 } x > 0 \\\\
0 & \\text{当 } x \\leq 0
\\end{cases}
$$`
    ),

  "rms-norm": (source) =>
    compose(
      source,
      `对二维张量执行 RMS 归一化，即每个元素除以该样本特征维度上的均方根：
$$
\\text{y} = \\frac{x}{\\sqrt{\\text{mean}(x^2) + \\epsilon}}
$$

## 输入
- 形状为 $B \\times N$ 的张量 $X$

## 输出
- 与输入形状相同的张量 $Y$`,
      [
        "- 对每个样本，沿特征维度计算 RMS",
        "- 使用 $\\epsilon = 10^{-5}$ 提升数值稳定性",
      ]
    ),

  "running-sum-1d": (source) =>
    compose(
      source,
      `使用固定大小滑动窗口计算一维滑动求和：
$$
\\text{output}[i] = \\sum_{j=0}^{W-1} \\text{input}[i + j]
$$

## 输入
- 长度为 $N$ 的向量 \`input\`

## 输出
- 长度为 $N$ 的向量 \`output\`，保存每个窗口的求和结果`,
      [
        "- $W$ 为奇数，且小于 $N$",
        "- 边界处使用零填充",
        "- 窗口以当前位置为中心",
      ]
    ),

  selu: (source) =>
    activation(
      source,
      "SELU",
      `$$
C[i][j] = \\text{selu}(A[i][j])
$$`,
      `函数定义为：
$$
\\text{selu}(x) = \\lambda \\cdot (\\max(0,x) + \\min(0, \\alpha(e^x - 1)))
$$
其中 $\\lambda \\approx 1.0507$，$\\alpha \\approx 1.67326$。`,
      ["- SELU 来自自归一化神经网络，用于帮助保持信号均值和方差"]
    ),

  "shortest-path": (source) =>
    compose(
      source,
      `给定带权有向图，求源点到所有其他顶点的最短距离。

邻接矩阵 $A$ 大小为 $N \\times N$，源点为 $s$：
$$
d[v] = \\min_{path\\ from\\ s\\ to\\ v} \\sum_{(u,w) \\in path} A[u][w]
$$

## 输入
- 大小为 $N \\times N$ 的带权邻接矩阵 $A$
- 若 $A[i][j] = 0$，表示不存在从 $i$ 到 $j$ 的边
- 源点编号 $s$

## 输出
- 长度为 $N$ 的数组 $d$，保存源点 $s$ 到所有顶点的最短距离；不可达时为 $-1$`
    ),

  sigmoid: (source) =>
    activation(
      source,
      "Sigmoid",
      `$$
C[i][j] = \\sigma(A[i][j])
$$`,
      `函数定义为：
$$
\\sigma(x) = \\frac{1}{1 + e^{-x}}
$$`
    ),

  softmax: (source) =>
    reductionOverDim(
      source,
      "Softmax 计算",
      `$$
\\text{softmax}(x_i) = \\frac{\\exp(x_i)}{\\sum_{j=1}^{S_d} \\exp(x_j)}
$$`,
      "形状与输入相同，保存 Softmax 概率",
      "输出每个值位于 $(0,1)$，并在指定维度上归一化"
    ),

  "soft-plus": (source) =>
    activation(
      source,
      "Softplus",
      `$$
C[i][j] = \\text{softplus}(A[i][j])
$$`,
      `函数定义为：
$$
\\text{softplus}(x) = \\ln(1 + e^x)
$$`,
      ["- Softplus 可视为 ReLU 的平滑近似，并能在所有输入处保持非零梯度"]
    ),

  "square-matmul": (source) =>
    compose(
      source,
      `执行两个方阵的矩阵乘法：
$$
C[i][j] = \\sum_{k=0}^{N-1} A[i][k] \\cdot B[k][j]
$$

## 输入
- 大小为 $N \\times N$ 的矩阵 $A$
- 大小为 $N \\times N$ 的矩阵 $B$

## 输出
- 大小为 $N \\times N$ 的矩阵 $C = AB$`,
      ["- 所有矩阵均按行主序存储"]
    ),

  "sum-dim": (source) =>
    reductionOverDim(
      source,
      "求和归约",
      `$$
\\text{output}[i_1,\\ldots,i_{d-1},1,i_{d+1},\\ldots,i_n] = \\sum_{i_d=0}^{S_d-1} \\text{input}[i_1,\\ldots,i_d,\\ldots,i_n]
$$`,
      "形状为 $S_1 \\times \\cdots \\times S_{d-1} \\times 1 \\times S_{d+1} \\times \\cdots \\times S_n$",
      "被归约的维度保留为大小 1"
    ),

  swish: (source) =>
    activation(
      source,
      "Swish",
      `$$
C[i][j] = A[i][j] \\cdot \\sigma(A[i][j])
$$`,
      `函数定义为：
$$
\\text{swish}(x) = x \\cdot \\sigma(x)
$$`
    ),

  "symmetric-matmul": (source) =>
    compose(
      source,
      `执行两个对称矩阵的矩阵乘法：
$$
C[i][j] = \\sum_{k=0}^{N-1} A[i][k] \\cdot B[k][j]
$$

## 输入
- 大小为 $N \\times N$ 的对称矩阵 $A$
- 大小为 $N \\times N$ 的对称矩阵 $B$

## 输出
- 大小为 $N \\times N$ 的矩阵 $C = AB$`,
      ["- 所有矩阵均按行主序存储"]
    ),

  tanh: (source) =>
    activation(
      source,
      "Tanh",
      `$$
C[i][j] = \\tanh(A[i][j])
$$`,
      `函数定义为：
$$
\\tanh(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}
$$`
    ),

  threshold: (source) =>
    compose(
      source,
      `对灰度图像执行二值阈值化：
$$
\\text{Output}[i][j] =
\\begin{cases}
255 & \\text{当 } \\text{Input}[i][j] > \\text{threshold\\_value} \\\\
0 & \\text{其他情况}
\\end{cases}
$$

## 输入
- 大小为 $height \\times width$ 的灰度图像
- 阈值，通常位于 $[0,255]$

## 输出
- 大小为 $height \\times width$ 的二值图像，像素值为 0 或 255`,
      [
        "- 输入是单通道灰度图像",
        "- 张量在内存中按行主序存储",
        "- 输出值严格为二值：不大于阈值为 0，大于阈值为 255",
      ]
    ),

  "triplet-margin": (source) =>
    compose(
      source,
      `实现三元组边距损失：
$$
\\text{Loss}(a, p, n) = \\frac{1}{B}\\sum_{i=1}^B \\max(0, d(a_i, p_i) - d(a_i, n_i) + \\text{margin})
$$

其中 $a$ 是锚点嵌入，$p$ 是同类正样本嵌入，$n$ 是异类负样本嵌入，$d(x,y)$ 通常取 L2 距离。

## 输入
- 形状为 $B \\times E$ 的锚点张量
- 形状为 $B \\times E$ 的正样本张量
- 形状为 $B \\times E$ 的负样本张量
- 边距参数

## 输出
- 一个标量，表示批内平均损失`,
      [
        "- 对每个三元组计算损失后再对批次求平均",
        "- 默认边距为 `1.0`，实现应支持任意正边距",
      ]
    ),

  "upper-trig-matmul": (source) =>
    compose(
      source,
      `执行两个上三角矩阵的矩阵乘法：
$$
C = A \\cdot B
$$

结果 $C$ 仍然是上三角矩阵。

## 输入
- 大小为 $N \\times N$ 的上三角矩阵 $A$
- 大小为 $N \\times N$ 的上三角矩阵 $B$

## 输出
- 大小为 $N \\times N$ 的上三角矩阵 $C$`,
      ["- 所有矩阵均按行主序存储", "- 若 $i > j$，上三角矩阵对应元素为 0"]
    ),

  "vector-multiply-ff": (source) =>
    compose(
      source,
      `在有限域中对两个向量执行逐元素乘法：
$$
c_i = (a_i \\cdot b_i) \\bmod p
$$

模数为 31 位 Mersenne 素数：
$$
p = 2^{31} - 1 = 2147483647
$$

## 输入
- 长度为 $n$ 的向量 \`a\` 和 \`b\`，每个元素位于 $[0,p)$

## 输出
- 长度为 $n$ 的向量 \`c\`，满足 $c_i = a_i \\cdot b_i \\bmod p$`,
      ["- 输入和输出均为 32 位无符号整数", "- 中间乘积必须模 $p$ 规约"]
    ),
};

export function getProblemTitle(slug: string, title: string, locale: Locale) {
  if (locale === "zh") return problemTitleZh[slug] ?? title;
  return title;
}

export function getProblemDescription(
  slug: string,
  description: string,
  locale: Locale
) {
  if (locale === "en") return description;
  return descriptionZh[slug]?.(description) ?? description;
}
