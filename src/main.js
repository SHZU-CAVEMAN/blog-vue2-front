import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import VueLazyload from 'vue-lazyload';//图片懒加载
import { Icon, BackTop, Pagination, Dropdown, Menu } from 'ant-design-vue';
import './assets/css/typography.css'; // 全局引入排版样式，保持文章内容的基本格式美观。
import CommonComponents from './components/common';
import vSlideIn from './tools/vSlideIn';
import { initErrorMonitor } from './tools/errorMonitor';
import request, { SERVICE_ORIGIN } from './tools/request';
import api from './api';
import { initializeTheme } from './tools/theme';

let markdownRuntimeReady = false;
let markdownRuntimeLoading = null;

// 首屏优化：Markdown 编辑器/预览仅在进入文章详情页时按需加载，避免首页 FCP 被重型依赖阻塞。
function ensureMarkdownRuntime() {
  if (markdownRuntimeReady) {
    return Promise.resolve();
  }
  if (markdownRuntimeLoading) {
    return markdownRuntimeLoading;
  }

  markdownRuntimeLoading = Promise.all([
    import('@kangc/v-md-editor'),
    import('@kangc/v-md-editor/lib/style/base-editor.css'),
    import('@kangc/v-md-editor/lib/theme/prism'),
    import('prismjs'),
    import('@kangc/v-md-editor/lib/preview'),
    import('@kangc/v-md-editor/lib/theme/github.js'),
    import('@kangc/v-md-editor/lib/theme/style/github.css'),
    import('highlight.js'),
    import('@kangc/v-md-editor/lib/plugins/emoji/index'),
    import('@kangc/v-md-editor/lib/plugins/emoji/emoji.css'),
  ]).then(async ([
    editorModule,
    ,
    prismThemeModule,
    prismModule,
    previewModule,
    githubThemeModule,
    ,
    hljsModule,
    emojiPluginModule,
  ]) => {
    const VueMarkdownEditor = editorModule.default;
    const createPrismTheme = prismThemeModule.default;
    const Prism = prismModule.default || prismModule;
    const VMdPreview = previewModule.default;
    const githubTheme = githubThemeModule.default;
    const hljs = hljsModule.default || hljsModule;
    const createEmojiPlugin = emojiPluginModule.default;

    // 先确保全局 Prism 可用，再加载语言扩展，避免出现 "Prism is not defined"。
    if (typeof window !== 'undefined') {
      window.Prism = Prism;
    }
    await import('prismjs/components/prism-json');

    VueMarkdownEditor.theme(createPrismTheme({ Prism }));
    VueMarkdownEditor.use(createEmojiPlugin());
    VMdPreview.use(githubTheme, { Hljs: hljs });

    Vue.use(VueMarkdownEditor);
    Vue.use(VMdPreview);
    markdownRuntimeReady = true;
  }).catch((error) => {
    markdownRuntimeLoading = null;
    throw error;
  });

  return markdownRuntimeLoading;
}

// 不阻塞首页渲染，提前把 Markdown 运行时加载到缓存里。
function warmupMarkdownRuntime() {
  const run = () => {
    ensureMarkdownRuntime().catch((error) => {
      console.warn('Markdown runtime warmup failed:', error);
    });
  };

  if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(run, { timeout: 2000 });
    return;
  }

  setTimeout(run, 800);
}

Vue.config.productionTip = false;//关闭生产者提示
initializeTheme();
// 全局注册请求实例和 API 对象，供组件/工具直接使用 this.$request / this.$api。
Vue.prototype.$request = request;
Vue.prototype.$api = api;
// 暴露静态资源根路径，供组件/工具在运行时拼接静态资源 URL。
const staticOrigin = (process.env.VUE_APP_STATIC_ORIGIN || SERVICE_ORIGIN).replace(/\/+$/, '');
Vue.prototype.$uploadFilesBase = `${staticOrigin}/uploadFiles/`;
// 暴露 Markdown 运行时加载器，供详情页组件在渲染前主动等待。
Vue.prototype.$ensureMarkdownRuntime = ensureMarkdownRuntime;
// 暴露运行时就绪状态：详情页可据此跳过重复“加载中”闪烁。
Vue.prototype.$isMarkdownRuntimeReady = () => markdownRuntimeReady;
Vue.use(Icon);
Vue.use(BackTop);
Vue.use(Pagination);
Vue.use(Dropdown);
Vue.use(Menu);
Vue.use(VueLazyload);
Vue.use(CommonComponents);
// 全局注册滚动入场动画指令：模板中可直接使用 v-slide-in。
Vue.directive('slide-in', vSlideIn);
Vue.prototype.$getEcharts = () => import('echarts');

// 初始化全局错误监控：统一采集 Vue/JS/Promise/Axios 错误。
// reportUrl 先留空，后续可替换成你的日志服务地址。
initErrorMonitor(Vue, request, {
  appName: 'blog-vue2-front',
  reportUrl: '',
});

router.beforeEach((to, from, next) => {
  // 仅详情页依赖 Markdown 运行时：首页无需等待这批大依赖，优先让首屏先渲染出来。
  if (to.name !== 'articleViewComponent') {
    next();
    return;
  }

  ensureMarkdownRuntime()
    .then(() => next())
    .catch((error) => {
      console.error('Markdown runtime load failed:', error);
      // 加载失败时先放行，避免导航重定向 Promise 被上层未捕获导致页面空白。
      // 后续可根据需要增加更平滑的降级提示。
      next();
    });
});


new Vue({
  render: h => h(App),
  router: router,
  store,
  beforeCreate() {
		Vue.prototype.$bus = this // 全局事件总线。this 为 vm 实例（new Vue是构造函数）。
	},

}).$mount('#app')

// 首屏渲染后预热 Markdown 运行时，提升后续进入详情页的性能和用户体验。
warmupMarkdownRuntime();



//设置一个前端路由的全局拦截器，每次跳转时，检测是否需要登录。
router.beforeResolve((to, from, next) => {
  // const loginUser = store.state.user.user;
  // 判断路由是否设置相应校验用户权限
  if (to.meta.requireAuth) {
    if (store.state.user.isLogin == false) {
      store.dispatch("setLogin", true);
      // console.log(store.state.user.showLogin)
    }else{
      //此时，登陆状态已为true，准予通行。
      next();
      return;
    }
    //如果没有登录成功，则不会跳转，也就是终止导航
    // 终止导航
    next(false);
    return;
    // console.log(store.state.user.isLogin);
  }
  //不需要登录的组件一律通行
  next();
});

