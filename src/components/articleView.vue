<!-- article.vue点击文章title，跳转到这个组件，这个组件接收文章信息后转交给markdown组件，由它去发请求 -->
<template>
  <div>
    <!-- 文章正文 -->
    <keep-alive>
      <markdown :id="id" :name="name"></markdown>
    </keep-alive>
    <!-- 文章评论 ：name为文章名-->
    <comment :name="name" :commentData="commentData"></comment>
  </div>
</template>

<script>
import Comment from './comment.vue';
import markdown from "./markdown.vue";

export default {
  name: "articleViewComponent",
  // props的 id 和 name 来自路由（见router/index.js）
  // commentData 来自父组件 App.vue 的传入
  props: ["id", "name", "commentData"],
  data() {
    return {
      //commentData: [],
    }
  },
  components: {
    markdown,
    Comment,
  },
  created() {

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
/* .markdown { */
  /* display: inline-block;
  vertical-align: top;

  width: 60%;
  margin-left: 15%; */
  /* background-color: antiquewhite; */
  /* background-color: rgb(0, 0, 0); */
/* } */
</style>