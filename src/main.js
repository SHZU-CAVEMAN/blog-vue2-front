import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import store from './store';
import VueLazyload from 'vue-lazyload';//图片懒加载
import ant from 'ant-design-vue';
import "ant-design-vue/dist/antd.css"
import * as echarts from 'echarts';//这样引用为什么不行？：import echarts from 'echarts';


//1 引入markdown编辑器和vuepress主题：
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
// import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
// import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// import Prism from 'prismjs';
// VueMarkdownEditor.use(vuepressTheme, {
//   Prism,
// });
import creatPrismTheme from '@kangc/v-md-editor/lib/theme/prism';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
const prismTheme = creatPrismTheme({
  Prism,
});
VueMarkdownEditor.theme(prismTheme);
Vue.use(VueMarkdownEditor);
//2 引入markdown解析（预览）组件和gihub主题：
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';
VMdPreview.use(githubTheme, {
  Hljs: hljs,
});
Vue.use(VMdPreview);
//3 引入html预览组件：(没屁用，不引入也罢。引入markdown预览组件就够了，md的那些符号都会解析成html和css)
// import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html';
// Vue.use(VMdPreviewHtml);
//4 引入表情
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
VueMarkdownEditor.use(createEmojiPlugin());


Vue.config.productionTip = false;//关闭生产者提示
Vue.prototype.$axios = axios;
Vue.use(ant);
Vue.use(VueLazyload);
Vue.prototype.$echarts = echarts;


new Vue({
  render: h => h(App),
  router: router,
  store,
  beforeCreate() {
		Vue.prototype.$bus = this // 全局事件总线。this 为 vm 实例（new Vue是构造函数）。
	},

}).$mount('#app')



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

// aixos请求携带上 token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});