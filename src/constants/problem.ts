import { isSubmissionError } from "~/types/submission";
import { FaCheck, FaTimes, FaExclamationCircle, FaClock } from "react-icons/fa";
import type { Locale } from "~/i18n";

export const DEFAULT_LANGUAGE = "cuda";

export const PROBLEM_DIFFICULTY_MULTIPLIERS = {
  EASY: 1,
  MEDIUM: 1.5,
  HARD: 3,
} as const;

export const FIRST_SOLVE_BONUS = 15;

export const ADJUSTMENT_FACTOR = 32; // No reasoning for this, i just like 2^5

export const START_RATING = 1000;

export const formatStatus = (status: string | null, locale: Locale = "zh") => {
  if (locale === "en") {
    switch (status) {
      case "ACCEPTED":
        return "Accepted";
      case "WRONG_ANSWER":
        return "Wrong Answer";
      case "ERROR":
        return "Error";
      case "CHECKING":
        return "Checking";
      case "BENCHMARKING":
        return "Benchmarking";
      case "COMPILE_ERROR":
        return "Compile Error";
      case "RUNTIME_ERROR":
        return "Runtime Error";
      case "MEMORY_LIMIT_EXCEEDED":
        return "Memory Limit Exceeded";
      case "TIME_LIMIT_EXCEEDED":
        return "Time Limit Exceeded";
      default:
        return status ?? "Unknown";
    }
  }

  switch (status) {
    case "ACCEPTED":
      return "已通过";
    case "WRONG_ANSWER":
      return "答案错误";
    case "ERROR":
      return "错误";
    case "CHECKING":
      return "测试中";
    case "BENCHMARKING":
      return "评测中";
    case "COMPILE_ERROR":
      return "编译错误";
    case "RUNTIME_ERROR":
      return "运行错误";
    case "MEMORY_LIMIT_EXCEEDED":
      return "超出内存限制";
    case "TIME_LIMIT_EXCEEDED":
      return "超出时间限制";

    default:
      return status ?? "未知状态";
  }
};

export const getStatusColor = (status: string | null) => {
  switch (status) {
    case "ACCEPTED":
      return "green";
    case "WRONG_ANSWER":
      return "red";
    case "CHECKING":
    case "BENCHMARKING":
      return "blue";
    default:
      if (isSubmissionError(status ?? "")) {
        return "red";
      }
      return "gray";
  }
};
export const getStatusIcon = (status: string | null) => {
  if (status === "ACCEPTED") {
    return FaCheck;
  } else if (status === "WRONG_ANSWER") {
    return FaTimes;
  } else if (isSubmissionError(status ?? "")) {
    return FaExclamationCircle;
  } else {
    return FaClock;
  }
};

export const tags = [
  "attention",
  "convolution",
  "crypto",
  "pooling",
  "normalization",
  "activation-function",
  "graphics",
  "graphs",
  "fused",
  "loss-function",
  "sorting",
  "scalar",
  "vector",
  "matmul",
  "scan",
  "statistics",
  "reduction",
  "quantization",
  "nvfp4",
  "mxfp8",
  "mxfp4",
] as const;

export const tagNames = {
  attention: "注意力",
  convolution: "卷积",
  pooling: "池化",
  normalization: "归一化",
  "activation-function": "激活",
  graphics: "图形",
  graphs: "图",
  fused: "融合",
  crypto: "密码学",
  "loss-function": "损失",
  scalar: "标量",
  sorting: "排序",
  vector: "向量",
  matmul: "矩阵乘",
  scan: "Scan",
  statistics: "统计",
  reduction: "归约",
  quantization: "量化",
  nvfp4: "NVFP4",
  mxfp8: "MXFP8",
  mxfp4: "MXFP4",
} as const;

export const tagNamesEn = {
  attention: "Attention",
  convolution: "Convolution",
  pooling: "Pooling",
  normalization: "Normalization",
  "activation-function": "Activation",
  graphics: "Graphics",
  graphs: "Graphs",
  fused: "Fused",
  crypto: "Crypto",
  "loss-function": "Loss",
  scalar: "Scalar",
  sorting: "Sorting",
  vector: "Vector",
  matmul: "MatMul",
  scan: "Scan",
  statistics: "Statistics",
  reduction: "Reduction",
  quantization: "Quantization",
  nvfp4: "NVFP4",
  mxfp8: "MXFP8",
  mxfp4: "MXFP4",
} as const;

export const tagAltNames = {
  attention: "注意力",
  convolution: "卷积",
  crypto: "密码学",
  pooling: "池化",
  normalization: "归一化",
  "activation-function": "激活函数",
  graphics: "图形",
  graphs: "图算法",
  fused: "融合算子",
  "loss-function": "损失函数",
  sorting: "排序",
  scalar: "标量",
  vector: "向量",
  matmul: "矩阵乘法",
  scan: "Scan",
  statistics: "统计",
  reduction: "归约",
  quantization: "量化",
  nvfp4: "NVFP4",
  mxfp8: "MXFP8",
  mxfp4: "MXFP4",
} as const;

export const tagAltNamesEn = {
  attention: "Attention",
  convolution: "Convolution",
  crypto: "Cryptography",
  pooling: "Pooling",
  normalization: "Normalization",
  "activation-function": "Activation Function",
  graphics: "Graphics",
  graphs: "Graph Algorithms",
  fused: "Fused Operators",
  "loss-function": "Loss Function",
  sorting: "Sorting",
  scalar: "Scalar",
  vector: "Vector",
  matmul: "Matrix Multiplication",
  scan: "Scan",
  statistics: "Statistics",
  reduction: "Reduction",
  quantization: "Quantization",
  nvfp4: "NVFP4",
  mxfp8: "MXFP8",
  mxfp4: "MXFP4",
} as const;

export function getTagName(tag: string, locale: Locale, long = false) {
  if (locale === "en") {
    const source = long ? tagAltNamesEn : tagNamesEn;
    return source[tag as keyof typeof source] ?? tag;
  }
  const source = long ? tagAltNames : tagNames;
  return source[tag as keyof typeof source] ?? tag;
}
