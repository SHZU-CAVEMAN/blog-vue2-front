// 全局错误监控：统一采集前端运行错误与请求异常。
const DEFAULT_REPORT_URL = "";
const DEDUP_WINDOW_MS = 5000;

const recentErrorMap = new Map();

function now() {
  return Date.now();
}
// 规范化错误对象
function normalizeError(err) {
  if (!err) {
    return {
      message: "Unknown error",
      stack: "",
      name: "UnknownError",
    };
  }
  if (typeof err === "string") {
    return {
      message: err,
      stack: "",
      name: "StringError",
    };
  }
  return {
    message: err.message || "Unknown error",
    stack: err.stack || "",
    name: err.name || "Error",
  };
}
// 简单去重：同一类型、同一消息、同一文件/URL 的错误在短时间内只上报一次，避免重复错误暴击监控系统。
function shouldReport(payload) {
  const dedupKey = `${payload.type}|${payload.message}|${payload.file || ""}|${payload.url || ""}`;
  const last = recentErrorMap.get(dedupKey) || 0;
  const current = now();

  if (current - last < DEDUP_WINDOW_MS) {
    return false;
  }

  recentErrorMap.set(dedupKey, current);
  return true;
}

// 发送错误报告到服务器
// 优先使用 sendBeacon，兼容性不好时 fallback 到 fetch。
function sendToServer(reportUrl, payload) {
  if (!reportUrl) {
    return;
  }
  const body = JSON.stringify(payload);
  // 优先使用 sendBeacon，页面卸载阶段也能尽量送达。
  if (navigator && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(reportUrl, blob);
    return;
  }
  fetch(reportUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  }).catch(() => {
    // 上报失败不再抛错，避免错误监控反向影响业务。
  });
}
// 创建错误报告函数
function createReporter({ appName, reportUrl }) {
  return function report(type, err, extra = {}) {
    // 规范化错误对象
    const normalized = normalizeError(err);
    // 构造上报负载
    const payload = {
      appName,
      type,
      level: "error",
      message: normalized.message,
      stack: normalized.stack,
      errorName: normalized.name,
      route: window.location ? window.location.href : "",
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      ...extra,
    };

    if (!shouldReport(payload)) {
      return;
    }
    //开发环境保留可读日志，生产环境交给监控平台。
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorMonitor]", payload);
    }
    sendToServer(reportUrl, payload);
  };
}

export function initErrorMonitor(Vue, axios, options = {}) {
  const config = {
    appName: options.appName || "vue2-app",
    reportUrl: options.reportUrl || DEFAULT_REPORT_URL,
  };
  const report = createReporter(config);

  // 挂在全局 vue实例上，方便组件内调用。
  Vue.prototype.$reportError = report;

  // 1) Vue 渲染/生命周期错误
  // Vue.config.errorHandler 可以捕获大部分 Vue 组件内的错误，但不包括事件处理函数、异步回调等非渲染错误，因此还需配合全局 window 错误监听。
  Vue.config.errorHandler = (err, vm, info) => {
    report("vue-error", err, {
      componentName: vm && vm.$options ? vm.$options.name : "UnknownComponent",
      info,
    });
  };
  // 2) JS 运行时全局错误（含资源加载失败）
  // Vue 组件内的错误会先被 Vue.config.errorHandler 捕获，不会冒泡到 window.onerror，所以这里主要捕获非 Vue 组件内的错误，以及资源加载失败的错误。
  window.addEventListener(
    "error",
    (event) => {
      const target = event && event.target;
      const isResourceError =
        target &&
        (target.src || target.href) &&
        (target !== window);

      if (isResourceError) {
        report("resource-error", new Error("Resource load failed"), {
          url: target.src || target.href,
          tagName: target.tagName || "",
        });
        return;
      }
      report("js-error", event.error || event.message, {
        file: event.filename || "",
        line: event.lineno || 0,
        column: event.colno || 0,
      });
    },
    true
  );
  // 3) 未处理的 Promise 异常
  // 捕获全局未处理的 Promise 异常，避免影响应用稳定性。
  window.addEventListener("unhandledrejection", (event) => {
    report("unhandled-rejection", event.reason, {});
  });
  // 4) Axios 请求异常（网络错误/服务端错误）
  // 通过 Axios 响应拦截器捕获请求异常，附带请求方法、URL、状态码等上下文信息，便于快速定位问题。
  if (axios && axios.interceptors && axios.interceptors.response) {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const response = error && error.response;
        const requestConfig = error && error.config ? error.config : {};

        report("http-error", error, {
          method: requestConfig.method || "",
          url: requestConfig.url || "",
          status: response ? response.status : 0,
          responseData: response ? response.data : null,
        });

        return Promise.reject(error);
      }
    );
  }
}
