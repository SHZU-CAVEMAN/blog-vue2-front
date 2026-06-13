<template>
  <div id="app" style="display: block;">
    <!-- 顶部导航栏 -->
    <navigation />
    <hr style="margin: 0;color:rgb(0, 0, 0)" />

    <a-back-top @click="click"/>
    <!-- 无 keep-alive：每次切换组件，再切回时重新创建。 -->
    <!-- keep-alive还是好，看样子还是应该把articlelist请求的数据保存在store中。 -->
    <!-- 以下：home组件 -->
    <keep-alive>
      <!-- 评论数据已统一放到 Vuex，这里不再通过 props 透传。 -->
      <router-view></router-view>
    </keep-alive>

  </div>
</template>

<script>
import navigation from './views/navigation.vue'

export default {
  name: 'App',
  components: {
    navigation,
  },
  methods:{
    click(){
      // console.log('返回顶部',e.target)
      // window.scrollTo(0,0);
    },
    // 统一评论请求入口：初始化与新增评论后都复用这个方法，避免散落的重复实现。
    fetchComments() {
      this.$api.comment.getAll()
        .then((res) => {
          // 评论数据统一写入 store，避免和 props 并存导致双数据源。
          this.$store.dispatch("setComment", res.data.data);
        })
        .catch((err) => {
          console.error("评论加载失败：", err.message || err, {
            code: err.code,
            status: err.status,
          });
        });
    },
    // 事件总线回调：收到评论新增事件后刷新一次评论列表。
    handleCommentAdded() {
      this.fetchComments();
    },
    deferFetchComments() {
      // 评论不是首屏关键内容，延后到首屏绘制后请求，减少 LCP 竞争。
      const run = () => this.fetchComments();
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        window.requestIdleCallback(run, { timeout: 1500 });
        return;
      }
      setTimeout(run, 0);
    },
  },
  created() {
    this.deferFetchComments();
    // 监听评论新增事件，实现“提交后仅刷新评论”而不是整页刷新。
    this.$bus.$on("commentAdded", this.handleCommentAdded);
  },
  beforeDestroy() {
    this.$bus.$off("commentAdded", this.handleCommentAdded);
  }

}
</script>

<style></style>


