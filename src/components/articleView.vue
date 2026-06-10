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

    <div v-else-if="loadingError" class="runtime-tip">
      Markdown 运行时加载失败，请刷新页面后重试。
    </div>

    <div v-else class="runtime-tip">
      正在加载文章内容...
    </div>
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
    return {
      markdownReady: false,
      loadingError: false,
    }
  },
  components: {
    markdown,
    Comment,
  },
  created() {
    // 组件级兜底：确保 v-md-editor/v-md-preview 注册完成后再渲染详情与评论。
    const ensure = this.$ensureMarkdownRuntime;
    if (typeof ensure !== "function") {
      this.loadingError = true;
      return;
    }

    ensure()
      .then(() => {
        this.markdownReady = true;
        this.loadingError = false;
      })
      .catch((error) => {
        console.error("Article markdown runtime load failed:", error);
        this.loadingError = true;
      });
  }

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
.runtime-tip {
  width: 60%;
  margin: 6vh auto;
  padding: 2vh 2.5vh;
  border: 1px solid var(--color-border-primary);
  border-radius: 10px;
  background-color: var(--color-bg-surface);
  color: var(--text-color-secondary);
}

/* .markdown { */
  /* display: inline-block;
  vertical-align: top;

  width: 60%;
  margin-left: 15%; */
  /* background-color: antiquewhite; */
  /* background-color: rgb(0, 0, 0); */
/* } */
</style>