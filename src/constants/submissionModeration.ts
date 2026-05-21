export const SUBMISSION_MODERATION_LABELS = {
  SUSPICIOUS: "审核中",
  INVALIDATED: "已作废",
} as const;

export const SUBMISSION_MODERATION_TOOLTIPS = {
  SUSPICIOUS:
    "这次提交被标记为可疑。在开发者审核期间，它会暂时从公开展示中隐藏。",
  INVALIDATED:
    "这次提交已被开发者移除，不再计入公开展示或评测结果。如有疑问，请联系维护者。",
} as const;
