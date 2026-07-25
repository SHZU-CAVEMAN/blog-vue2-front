import axios from "axios";

// 开发环境：/api（由 vue.config.js 代理到本地后端）
// 生产环境：/api（由 nginx proxy_pass 转发到后端）
const API_ORIGIN = process.env.VUE_APP_API_BASE_URL || "/api";
export const SERVICE_ORIGIN = process.env.VUE_APP_STATIC_ORIGIN || (
  process.env.NODE_ENV === "production" && typeof window !== "undefined"
    ? window.location.origin
    : API_ORIGIN
);

// 统一业务请求实例（不包含静态资源请求）
const request = axios.create({
  baseURL: API_ORIGIN,
  timeout: 15000,
  withCredentials: true, // 允许请求时携带 cookie
});

request.interceptors.request.use((config) => {

  const requestUrl = (config && config.url) || "";
  // 评论相关接口使用 HttpOnly Cookie，不附带 localStorage token。
  if (/^\/(comment)\//.test(requestUrl)) {
    return config;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// 后端约定：
// 1) HTTP 200/201 且 code === 0 表示成功；
// 2) 非 200/201 时返回 code/message 作为错误信息。
request.interceptors.response.use(
  (response) => {
    // response.status 是 HTTP 层状态码（例如 200/201/401/500）。
    // response.data 是后端返回的业务响应体（通常包含 code/message/data）。
    const status = response?.status;
    const payload = response?.data || {};

    // 第一层：HTTP 层判定。
    // 非 200/201 统一当作失败，构造标准错误并进入调用方 catch。
    if (status !== 200 && status !== 201) {

      const error = new Error(payload.message || `请求失败（HTTP ${status}）`); // 创建Error对象，方便后续打印堆栈信息（入参给Error.message赋值）

      // 给 error 对象附加 code/status/response 等属性，方便调用时按需处理。
      error.code = payload.code || `HTTP_${status}`;
      error.status = status; // HTTP 层状态码
      error.response = response;

      return Promise.reject(error);
    }

    // 第二层：业务层判定。
    // 某些接口会返回 HTTP 200，但业务 code 非 0，依然要按失败处理。
    if (payload && Object.prototype.hasOwnProperty.call(payload, "code") && payload.code !== 0) {
      const error = new Error(payload.message || "请求失败");
      error.code = payload.code;
      error.status = status;
      error.response = response;
      return Promise.reject(error);
    }

    // 通过上述两层校验后，认为请求成功，交给业务代码继续处理。
    return response;
  },
  (error) => {
    // Axios 在网络错误、超时、跨域拦截、HTTP 4xx/5xx 等场景会进入这里。
    // 这里把不同来源的错误统一成同一结构，方便页面按 err.status / err.code 处理。
    const response = error?.response;
    const status = response?.status;
    const payload = response?.data || {};

    const normalizedError = new Error(
      payload.message || error.message || `请求失败${status ? `（HTTP ${status}）` : ""}`
    );

    // 给 normalizedError 对象附加 code/status/response/raw 等属性，方便调用时按需处理。
    normalizedError.code = payload.code || error.code || "REQUEST_ERROR";
    normalizedError.status = status || null;
    normalizedError.response = response || null;
    normalizedError.raw = error; // raw 保留原始 Axios 错误对象，调试时可查看更完整上下文。

    return Promise.reject(normalizedError);
  }
);

export default request;
