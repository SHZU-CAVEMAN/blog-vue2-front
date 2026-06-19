# Li Ao  Blog Frontend

![Vue2](https://img.shields.io/badge/Vue-2.6.14-42b883?logo=vue.js&logoColor=white)
![Vue Router](https://img.shields.io/badge/Vue_Router-3.x-4FC08D?logo=vue.js&logoColor=white)
![Vuex](https://img.shields.io/badge/Vuex-3.x-35495E?logo=vue.js&logoColor=white)
![Ant Design Vue](https://img.shields.io/badge/Ant_Design_Vue-1.7-1677ff?logo=ant-design&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.3-5A29E4?logo=axios&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js&logoColor=white)

一个基于 Vue 2 + Vue CLI 的博客前台项目，支持文章列表、文章详情 Markdown 渲染、目录导航索引、评论系统、分类归档、公告信息等。

后端默认对接 Express 服务。

## ✨ 功能特性

- 🧱 清晰的分层架构：页面层、业务组件层、公共组件层、工具层、数据层职责明确
- 🌐 统一请求治理：axios 实例、拦截器、API 封装统一管理，避免请求散落与重复实现
- 🛡️ 全局错误监控：覆盖 Vue 运行时错误、Promise 异常、HTTP 异常，便于线上定位与回溯
- 🗂️ 状态单一数据源：核心数据通过 Vuex 统一管理，减少多处存储导致的不一致问题
- 🧩 可维护的组件化能力：业务组件与通用组件拆分，提升复用性与迭代效率
- 🚀 性能工程实践：按需加载、路由懒加载、关键路径减负，关注 FCP/LCP/TBT 等指标
- ⚙️ 可配置部署能力：开发代理与生产同源部署策略清晰，便于联调、测试与上线

## 🧰 技术栈

- Vue 2.6.14
- Vue Router 3
- Vuex 3
- Vue CLI 5
- Ant Design Vue 1.7
- axios
- @kangc/v-md-editor

## 🗃️ 目录结构

```text
src/
	api/                # 统一 API 封装
	assets/             # 静态资源
	components/         # 业务组件
	components/common/  # 公共组件
	router/             # 路由配置
	store/              # Vuex 模块
	tools/              # 工具模块（request、errorMonitor 等）
	views/              # 页面级视图
	App.vue
	main.js
```

## ⚡ 快速开始

### 1. 📦 安装依赖

```bash
npm install
```

如果你本地 Node 版本较新，出现 peer 或 engine 警告，可以尝试：

```bash
npm install --legacy-peer-deps
```

### 2. 🧪 本地开发

```bash
npm run serve
```

默认前端运行在 `http://localhost:8080`。

### 3. 🏗️ 生产构建

```bash
npm run build
```

构建产物在 `dist/`。

**生产环境配置** 通过 CI/CD 流程自动生成，见下方"部署与 CI/CD"章节。

## 🔌 请求与环境配置

统一请求入口位于 `src/tools/request.js`。

当前配置：

- `SERVICE_ORIGIN = ""`
- axios `baseURL = SERVICE_ORIGIN`

这意味着：

- 开发环境下走 `vue.config.js` 的代理（`devServer.proxy`）
- 生产环境建议前后端同源部署

### 开发环境代理

> ✅ 推荐：开发环境使用代理，生产环境使用同源部署。

`vue.config.js` 已配置：

- 前端端口：`8080`
- 代理目标：`http://localhost:81`

即前端请求 `/articles` 会由开发服务器转发到后端 `81` 端口。

### 生产环境部署

生产环境通过 CI/CD 自动构建并生成配置。工作流文件位于 `.github/workflows/deploy-vue.yml`。

**部署流程：**

1. **设置 GitHub Secrets**（用于 CI/CD 中注入生产配置）
   - `VUE_APP_STATIC_ORIGIN` — 生产静态资源地址（例如 `http://47.103.116.170/`）
   - `SERVER_IP` — 服务器地址
   - `SSH_PORT` — SSH 端口
   - `SSH_PRIVATE_KEY` — SSH 私钥

2. **CI/CD 自动化流程**
   - 生成 `.env.production`（包含生产地址）
   - 执行 `npm install` 和 `npm run build`
   - 上传 `dist/` 到宝塔服务器

3. **本地测试**（可选）
   ```bash
   echo "VUE_APP_API_BASE_URL=/api
   VUE_APP_STATIC_ORIGIN=http://your-production-domain/" > .env.production
   npm run build
   ```

**⚠️ 注意：** `.env.production` 不提交到仓库，由 CI/CD 在构建时动态生成。

## 📚 统一 API 说明

`src/api/index.js` 已封装：

- article
	- `getAll`
	- `getDetail`
	- `getAllCategories`
- comment
	- `getAll`
	- `add`
	- `sendVerifyEmail`
	- `uploadAvatar`
- system
	- `getPublicIp`
	- `getGeoByIp`

组件内推荐通过 `this.$api.xxx` 调用，不直接散写 axios。


## 🛠️ 可用脚本

- `npm run serve` 启动开发环境
- `npm run build` 生产构建
- `npm run lint` 代码检查

## ❓ 常见问题

### 1) 接口 404，但页面能打开

> ⚠️ 这通常不是前端代码问题，而是服务启动方式或端口指向错误。

常见原因是端口上跑的是静态服务而不是后端 API 服务。

排查思路：

- 确认后端是否真的在目标端口监听
- 确认前端请求前缀与代理目标一致
- 避免静态服务器与后端占用同一端口冲突

### 2) 本地 Node 版本过新出现依赖告警

> ℹ️ 提示类告警通常不影响运行，但建议在 LTS Node 下完成构建验证。

这是旧依赖生态常见现象，通常不影响运行。
建议优先使用 LTS 版本（Node 16/18/20）进行构建与部署验证。

## 📌 后续建议

- ✅ 环境配置已支持 `.env.development`（本地开发）和 CI/CD 生成 `.env.production`（自动部署）
- 补充单元测试与 e2e 测试
- 增加构建产物体积分析（webpack-bundle-analyzer）
- 完善错误监控上报（errorMonitor 中的 reportUrl）

## 📄 License

仅用于学习与个人项目实践。
