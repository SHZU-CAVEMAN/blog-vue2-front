<!-- article.vue点击文章title，跳转到这个组件，这个组件接收文章信息后转交给markdown组件，由它去发请求 -->
<template>
  <div>
    <template v-if="markdownReady">
      <!-- 文章正文 -->
      <keep-alive>
        <markdown :id="id" :name="name"></markdown>
      </keep-alive>
      <!-- 文章评论 ：name为文章名-->
      <comment :name="name"></comment>
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
    }
  },
  components: {
    markdown,
    Comment,
  },
  created() {
    // 已就绪直接返回：避免重复触发加载 Promise。
    if (this.markdownReady) {
      return;
    }

    this.tryLoadRuntime();
  },

  methods: {
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