import axios from "axios";

// 开发环境：/api（由 vue.config.js 代理到本地后端）
// 生产环境：/api（由 nginx proxy_pass 转发到后端）
export const SERVICE_ORIGIN = process.env.VUE_APP_API_BASE_URL || "/api";

// 统一请求实例：后续可在这里集中管理超时、baseURL、鉴权头等逻辑。
const request = axios.create({
  baseURL: SERVICE_ORIGIN,
  timeout: 15000,
});

request.interceptors.request.use((config) => {
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
    const status = response && response.status;
    const payload = response && response.data ? response.data : {};

    if (status !== 200 && status !== 201) {
      const error = new Error(payload.message || `请求失败（HTTP ${status}）`);
      error.code = payload.code || `HTTP_${status}`;
      error.status = status;
      error.response = response;
      return Promise.reject(error);
    }

    if (payload && Object.prototype.hasOwnProperty.call(payload, "code") && payload.code !== 0) {
      const error = new Error(payload.message || "请求失败");
      error.code = payload.code;
      error.status = status;
      error.response = response;
      return Promise.reject(error);
    }

    return response;
  },
  (error) => {
    const response = error && error.response;
    const status = response && response.status;
    const payload = response && response.data ? response.data : {};
    const normalizedError = new Error(
      payload.message || error.message || `请求失败${status ? `（HTTP ${status}）` : ""}`
    );

    normalizedError.code = payload.code || error.code || "REQUEST_ERROR";
    normalizedError.status = status || null;
    normalizedError.response = response || null;
    normalizedError.raw = error;

    return Promise.reject(normalizedError);
  }
);

export default request;
