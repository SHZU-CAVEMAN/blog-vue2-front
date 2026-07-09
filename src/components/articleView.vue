<!-- article.vue点击文章title，跳转到这个组件，这个组件接收文章信息后转交给markdown组件，由它去发请求 -->
<template>
  <div>
    <template v-if="markdownReady">
      <!-- 文章正文 -->
      <keep-alive>
        <markdown :id="id" :name="name"></markdown>
      </keep-alive>
      <!-- 评论组件只依赖文章 id，避免展示层继续携带旧字段名。 -->
      <comment :article-id="id"></comment>
    </template>
  </div>
</template>

<script>
import Comment from './comment.vue';
import markdown from "./markdown.vue";

export default {
  name: "articleViewComponent",
  // props 的 id 和 name 来自路由（见 router/index.js）。
  props: ["id", "name"],
  data() {
    const isReady = typeof this.$isMarkdownRuntimeReady === "function" && this.$isMarkdownRuntimeReady();
    return {
      // 运行时已缓存时直接渲染，避免每次进入详情都短暂闪“加载中”。
      markdownReady: !!isReady,
      retryTimer: null,
      // 记录浏览器原始的滚动恢复策略（auto/manual），离开页面时要恢复。
      previousScrollRestoration: "auto",
    }
  },
  components: {
    markdown,
    Comment,
  },
  watch: {
    id() {
      this.resetScrollTop();
    },
    name() {
      this.resetScrollTop();
    },
    markdownReady(ready) {
      if (ready) {
        // 运行时就绪后正文才挂载，延后一小段时间再次回顶，避免内容渲染把页面推回中间。
        this.resetScrollTop(3);
      }
    },
  },
  created() {
    // 浏览器默认会在刷新/前进后退时恢复到旧滚动位置（scrollRestoration=auto）。
    // 这里切到 manual，防止详情页刷新后停在中间位置。
    if (typeof window !== "undefined" && window.history && "scrollRestoration" in window.history) {
      this.previousScrollRestoration = window.history.scrollRestoration || "auto";
      window.history.scrollRestoration = "manual";
    }

    this.resetScrollTop();
    // 已就绪直接返回：避免重复触发加载 Promise。
    if (this.markdownReady) {
      return;
    }

    this.tryLoadRuntime();
  },
  mounted() {
    this.resetScrollTop(2);
  },

  methods: {
    // 详情页进入/切换文章时强制回到页面顶部，避免保留刷新前的中间滚动位置。
    resetScrollTop(repeat = 1) {
      this.$nextTick(() => {
        const run = () => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        };

        run();
        if (repeat > 1) {
          setTimeout(run, 60);
        }
        if (repeat > 2) {
          setTimeout(run, 180);
        }
      });
    },
    // 组件级兜底：确保 v-md-editor/v-md-preview 注册完成后再渲染详情与评论。
    tryLoadRuntime() {
      const ensure = this.$ensureMarkdownRuntime;
      if (typeof ensure !== "function") {
        // 运行时加载器未挂载时，短暂等待后重试。
        this.retryTimer = setTimeout(() => this.tryLoadRuntime(), 500);
        return;
      }

      ensure()
        .then(() => {
          this.markdownReady = true;
        })
        .catch((error) => {
          console.error("Article markdown runtime load failed:", error);
          // 自动重试直到成功：用户只看到“加载中”，不会再出现失败提示。
          this.retryTimer = setTimeout(() => this.tryLoadRuntime(), 300);
        });
    },
  },

  beforeDestroy() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }

    // 组件销毁时恢复浏览器原策略，避免影响其它页面的滚动体验。
    if (typeof window !== "undefined" && window.history && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = this.previousScrollRestoration || "auto";
    }
  },

  // watch: {
  //   $route(to, from) {
  //     // console.log(from.name);//from就是当前路由，to就是从当前路由跳往的路由。
  //     // if(from.name != "articleViewComponent")
  //     // location.reload();
  //     // console.log(from,"bababab");
  //     //  location.reload();
  //     // this.$router.go();
  //   },
  // },
};
</script>

<style>
/* .markdown { */
  /* display: inline-block;
  vertical-align: top;

  width: 60%;
  margin-left: 15%; */
  /* background-color: antiquewhite; */
  /* background-color: rgb(0, 0, 0); */
/* } */
</style>