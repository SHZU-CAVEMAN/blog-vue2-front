import request from "../tools/request";

const api = {
  article: {
    getAll() {
      return request.get("/articles");
    },
    getDetail(id) {
      return request.get(`/articles/${encodeURIComponent(id)}`);
    },
    getAllCategories() {
      return request.get("/category/getall");
    },
  },
  comment: {
    getAll() {
      return request.get("/comment/getall");
    },
    add(data) {
      return request.post("/comment/add", data);
    },
    sendVerifyEmail(email) {
      return request.post("/verify/email", { email });
    },
    verifyEmailToken(data) {
      return request.post("/verify/email", data);
    },
    uploadAvatar(formData) {
      return request.post("/upload-single-file", formData);
    },
  },
  friendlink: {
    getAll() {
      return request.get("/friendlinks");
    },
    getById(id) {
      return request.get(`/friendlinks/${encodeURIComponent(id)}`);
    },
    create(data) {
      return request.post("/friendlinks", data);
    },
    update(id, data) {
      return request.patch(`/friendlinks/${encodeURIComponent(id)}`, data);
    },
    remove(id) {
      return request.delete(`/friendlinks/${encodeURIComponent(id)}`);
    },
  },
  system: {
    getPublicIp() {
      return request.get("http://api.ipify.org/?format=json");
    },
    getGeoByIp(ip) {
      return request.get(`http://ip-api.com/json/${ip}`);
    },
    GetLocation(){
      return request.get("http://ip-api.com/json/?lang=zh-CN");
    }
  },
  request(config) {
    return request(config);
  },
};

export default api;
