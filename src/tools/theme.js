// localStorage 的键名：用于记录用户最后一次选择的主题。
const THEME_STORAGE_KEY = "blog-theme";

// 读取本地保存的主题值。
// 返回值可能是 "dark"、"light"，或者空字符串（表示没有历史记录）。
export function getStoredTheme() {
  // 某些非浏览器环境下没有 window，直接返回默认浅色，避免报错。
  if (typeof window === "undefined") return "light";
  return localStorage.getItem(THEME_STORAGE_KEY) || "";
}

// 应用主题到整个页面。
// 通过给 html 挂载 data-theme 属性，让 CSS 统一根据这个标记切换变量。
// persist 默认开启，表示切换主题时顺手把结果保存到本地。
export function applyTheme(theme, persist = true) {
  // 没有 document 的环境下无法操作页面 DOM，直接返回。
  if (typeof document === "undefined") return;

  // 这里是全站主题切换的核心：CSS 会读取 html[data-theme] 来决定用哪套变量。
  // document.documentElement 就是 <html> 标签的 DOM 对象。此处给它设置一个自定义属性 data-theme。
  document.documentElement.setAttribute("data-theme", theme);

  // 只有在明确需要持久化时才写入 localStorage。
  // 初始化阶段通常只想“恢复页面状态”，不希望重复写入。
  if (persist && typeof window !== "undefined") {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}

// 页面启动时的主题初始化入口。
// 优先恢复本地记录，其次才根据系统暗色偏好决定默认主题。
export function initializeTheme() {
  // 先读取用户上次手动选择的主题。
  const stored = getStoredTheme();

  // 如果本地已经有明确记录，直接恢复，避免每次刷新都重新判断系统主题。
  if (stored === "dark" || stored === "light") {
    applyTheme(stored, false);
    return stored;
  }

  // 没有历史记录时，检测系统是否偏好深色模式。
  // 这会让首次打开网站时更贴近用户系统设置。
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  // 根据系统偏好得到初始主题：深色优先，否则浅色。
  const initialTheme = prefersDark ? "dark" : "light";

  // 初始化时也要把主题写到 html 上，供全站 CSS 变量读取。
  // 这里会顺手写入本地存储，作为后续刷新时的默认恢复值。
  applyTheme(initialTheme, true);
  return initialTheme;
}
