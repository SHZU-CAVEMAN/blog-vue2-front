import axios from "axios";

export const SERVICE_ORIGIN = "" //"http://127.0.0.1:81";

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

export default request;
