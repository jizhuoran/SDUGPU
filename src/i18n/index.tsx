import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "zh" | "en";

const STORAGE_KEY = "sdugpu_locale";

const messages = {
  zh: {
    "nav.problems": "题目",
    "nav.allProblems": "全部题目",
    "nav.menu": "菜单",
    "auth.profile": "个人主页",
    "auth.submissions": "提交记录",
    "auth.signOut": "退出登录",
    "auth.signIn": "登录",
    "a11y.openMenu": "打开菜单",
    "a11y.logo": "SDUGPU 标志",
    "locale.zh": "中文",
    "locale.en": "EN",

    "home.title": "首页",
    "home.hero.write": "编写",
    "home.hero.benchmark": "评测",
    "home.hero.iterate": "迭代",
    "home.hero.copy":
      "SDUGPU 是一个 GPU 编程练习平台。你可以在这里编写 CUDA kernel、运行样例，并在平台提供的 GPU 上完成性能评测。",
    "home.cta.start": "开始做题",
    "home.why.title": "为什么使用 SDUGPU？",
    "home.why.copy":
      "SDUGPU 把流程保持得很直接：写 kernel、跑样例、提交评测，然后看清楚它在评测 GPU 上的表现。",
    "home.feature.hardware.title": "真实硬件评测",
    "home.feature.hardware.copy":
      "提交会在平台可用的 GPU 上运行，结果会展示实际运行时间、带宽和 GPU 状态。",
    "home.feature.kernel.title": "专注 Kernel 练习",
    "home.feature.kernel.copy":
      "先从一个 CUDA 题目开始，快速修改、运行样例，并查看稳定的测试结果。",
    "home.feature.signature.title": "清晰题面与签名",
    "home.feature.signature.copy":
      "题目会给出明确的函数签名、固定测试规模和样例运行入口，提交前更容易确认代码是否写对。",
    "home.cta.title": "准备开始优化了吗？",
    "home.cta.copy": "进入 GPU 编程题目，提交你的 kernel，并在平台 GPU 上查看评测结果。",
    "home.cta.button": "现在开始做题",
    "home.footer.copy": "GPU 编程练习与性能评测平台。",
    "home.footer.adapted": "本项目从开源项目",
    "home.footer.adaptedSuffix": "适配而来。",
    "home.footer.nav": "导航",
    "home.footer.legal": "法务",
    "home.footer.terms": "服务条款",
    "home.footer.privacy": "隐私政策",

    "problems.title": "题目",
    "problems.og": "SDUGPU 的 GPU 编程题目列表。",
    "problems.search": "搜索题目...",
    "problems.allDifficulty": "全部难度",
    "problems.allTags": "全部标签",
    "problems.tagCount": "{count} 个标签",
    "problems.clearTags": "清除标签筛选",
    "problems.searchTags": "搜索标签...",
    "problems.status": "状态",
    "problems.allStatus": "全部状态",
    "problems.solved": "已通过",
    "problems.unsolved": "未通过",
    "problems.attempting": "尝试中",
    "problems.count": "共 {total} 题，当前显示 {shown} 题。",
    "problems.table.problem": "题目",
    "problems.table.difficulty": "难度",
    "problems.table.tags": "标签",
    "problems.table.submissions": "提交次数",
    "problems.empty.search": "没有找到匹配题目。",
    "problems.empty.none": "暂无题目。",
    "problems.empty.hint": "换个关键词试试，或清除当前筛选条件。",

    "problem.reference": "参考答案",
    "problem.mySubmissions": "我的提交",
    "problem.params": "查看参数",
    "problem.noParams": "暂无参数",
    "problem.gpu": "评测 GPU",
    "problem.languageResources": "语言资源",
    "problem.notFoundTitle": "未找到",
    "problem.notFound": "未找到题目",
    "problem.problemPanel": "题目",
    "problem.console": "控制台",
    "problem.editor": "编辑器",
    "problem.viewReference": "查看参考答案",
    "problem.noReference": "暂无参考答案",
    "problem.resetCode": "重置代码",
    "problem.showPtx": "查看 PTX/SASS",
    "problem.hidePtx": "隐藏 PTX/SASS",
    "problem.vim": "切换 Vim 模式",
    "problem.run": "运行",
    "problem.submit": "提交",
    "problem.mobileTitle": "代码提交需要桌面设备",
    "problem.mobileCopy": "为了获得更好的编程体验，请切换到桌面设备编写并提交代码。",
    "problem.functionParams": "函数参数",
    "problem.noFunctionParams": "当前 solution 函数没有参数。",
    "problem.functionSignature": "函数签名",
    "problem.pointer": "指针",
    "problem.cancel": "取消",
    "problem.resetConfirm": "确定要恢复到初始代码吗？当前修改会丢失。",
    "problem.sampleResult": "样例运行结果",
    "problem.sampleHint": "点击“运行”来用样例输入测试代码",
    "problem.diff": "差异",
    "problem.backToProblem": "返回题目",
    "problem.noSubmissions": "还没有提交记录",
    "problem.filterAll": "全部",
    "problem.filterWrongAnswer": "答案错误",
    "problem.filterError": "错误",
    "problem.filter": "筛选",
    "problem.performance": "性能",
    "problem.runtime": "运行时间",
    "problem.toast.helpTitle": "需要帮助？",
    "problem.toast.helpCopy": "可以先运行样例，对照期望输出，再重新提交。",
    "problem.toast.loginTitle": "尚未登录",
    "problem.toast.loginSubmit": "请先登录再提交答案",
    "problem.toast.loginRun": "请先登录再运行代码",
    "problem.toast.unsupportedGpu": "不支持的 GPU",
    "problem.toast.invalidCode": "代码无效",
    "problem.toast.submitting": "正在提交",
    "problem.toast.waitSubmit": "请等待本次提交完成",
    "problem.toast.running": "正在运行",
    "problem.toast.waitRun": "请等待本次样例运行完成",

    "difficulty.easy": "简单",
    "difficulty.medium": "中等",
    "difficulty.hard": "困难",
  },
  en: {
    "nav.problems": "Problems",
    "nav.allProblems": "All Problems",
    "nav.menu": "Menu",
    "auth.profile": "Profile",
    "auth.submissions": "Submissions",
    "auth.signOut": "Sign out",
    "auth.signIn": "Sign in",
    "a11y.openMenu": "Open menu",
    "a11y.logo": "SDUGPU logo",
    "locale.zh": "中文",
    "locale.en": "EN",

    "home.title": "Home",
    "home.hero.write": "Write",
    "home.hero.benchmark": "Benchmark",
    "home.hero.iterate": "Iterate",
    "home.hero.copy":
      "SDUGPU is a GPU programming practice platform. Write CUDA kernels, run samples, and benchmark them on platform-provided GPUs.",
    "home.cta.start": "Start solving",
    "home.why.title": "Why SDUGPU?",
    "home.why.copy":
      "SDUGPU keeps the loop direct: write a kernel, run a sample, submit for evaluation, and inspect how it performs on the benchmark GPU.",
    "home.feature.hardware.title": "Real Hardware Benchmarks",
    "home.feature.hardware.copy":
      "Submissions run on platform GPUs, with runtime, throughput, and GPU status shown in the result.",
    "home.feature.kernel.title": "Kernel-Focused Practice",
    "home.feature.kernel.copy":
      "Start from a CUDA problem, iterate quickly, run samples, and review stable test results.",
    "home.feature.signature.title": "Clear Statements And Signatures",
    "home.feature.signature.copy":
      "Each problem provides a precise function signature, fixed test sizes, and a sample runner before submission.",
    "home.cta.title": "Ready to optimize?",
    "home.cta.copy": "Open a GPU programming problem, submit your kernel, and view benchmark results on the platform GPU.",
    "home.cta.button": "Start now",
    "home.footer.copy": "GPU programming practice and performance benchmarking platform.",
    "home.footer.adapted": "Adapted from the open-source project",
    "home.footer.adaptedSuffix": ".",
    "home.footer.nav": "Navigation",
    "home.footer.legal": "Legal",
    "home.footer.terms": "Terms",
    "home.footer.privacy": "Privacy",

    "problems.title": "Problems",
    "problems.og": "SDUGPU GPU programming problem set.",
    "problems.search": "Search problems...",
    "problems.allDifficulty": "All difficulties",
    "problems.allTags": "All tags",
    "problems.tagCount": "{count} tags",
    "problems.clearTags": "Clear tag filters",
    "problems.searchTags": "Search tags...",
    "problems.status": "Status",
    "problems.allStatus": "All statuses",
    "problems.solved": "Solved",
    "problems.unsolved": "Unsolved",
    "problems.attempting": "Attempting",
    "problems.count": "{total} problems, showing {shown}.",
    "problems.table.problem": "Problem",
    "problems.table.difficulty": "Difficulty",
    "problems.table.tags": "Tags",
    "problems.table.submissions": "Submissions",
    "problems.empty.search": "No matching problems found.",
    "problems.empty.none": "No problems yet.",
    "problems.empty.hint": "Try a different keyword or clear the current filters.",

    "problem.reference": "Reference",
    "problem.mySubmissions": "My Submissions",
    "problem.params": "View parameters",
    "problem.noParams": "No parameters",
    "problem.gpu": "Benchmark GPU",
    "problem.languageResources": "Language resources",
    "problem.notFoundTitle": "Not Found",
    "problem.notFound": "Problem not found",
    "problem.problemPanel": "Problem",
    "problem.console": "Console",
    "problem.editor": "Editor",
    "problem.viewReference": "View reference",
    "problem.noReference": "No reference available",
    "problem.resetCode": "Reset Code",
    "problem.showPtx": "Show PTX/SASS",
    "problem.hidePtx": "Hide PTX/SASS",
    "problem.vim": "Toggle Vim mode",
    "problem.run": "Run",
    "problem.submit": "Submit",
    "problem.mobileTitle": "Code submission requires a desktop device",
    "problem.mobileCopy": "For a better programming experience, switch to a desktop device to write and submit code.",
    "problem.functionParams": "Function Parameters",
    "problem.noFunctionParams": "The current solution function has no parameters.",
    "problem.functionSignature": "Function Signature",
    "problem.pointer": "Pointer",
    "problem.cancel": "Cancel",
    "problem.resetConfirm": "Restore the starter code? Your current edits will be lost.",
    "problem.sampleResult": "Sample Run Result",
    "problem.sampleHint": "Click Run to test your code with the sample input.",
    "problem.diff": "Diff",
    "problem.backToProblem": "Back to Problem",
    "problem.noSubmissions": "No submissions yet",
    "problem.filterAll": "All",
    "problem.filterWrongAnswer": "Wrong Answer",
    "problem.filterError": "Error",
    "problem.filter": "Filter",
    "problem.performance": "Performance",
    "problem.runtime": "Runtime",
    "problem.toast.helpTitle": "Need help?",
    "problem.toast.helpCopy": "Run the sample first, compare against the expected output, then submit again.",
    "problem.toast.loginTitle": "Not signed in",
    "problem.toast.loginSubmit": "Sign in before submitting a solution.",
    "problem.toast.loginRun": "Sign in before running code.",
    "problem.toast.unsupportedGpu": "Unsupported GPU",
    "problem.toast.invalidCode": "Invalid code",
    "problem.toast.submitting": "Submitting",
    "problem.toast.waitSubmit": "Please wait for the current submission to finish.",
    "problem.toast.running": "Running",
    "problem.toast.waitRun": "Please wait for the current sample run to finish.",

    "difficulty.easy": "Easy",
    "difficulty.medium": "Medium",
    "difficulty.hard": "Hard",
  },
} as const;

type MessageKey = keyof typeof messages.zh;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "zh" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(STORAGE_KEY, nextLocale);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "zh" ? "en" : "zh");
  }, [locale, setLocale]);

  const t = useCallback(
    (key: MessageKey, params?: Record<string, string | number>) => {
      const template: string = messages[locale][key] ?? messages.zh[key] ?? key;
      if (!params) return template;
      return Object.entries(params).reduce<string>(
        (value, [name, replacement]) =>
          value.replaceAll(`{${name}}`, String(replacement)),
        template
      );
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
