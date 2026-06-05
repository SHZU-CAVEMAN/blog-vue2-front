<template>
  <!-- 中间主体部分：文章卡片列表 + 分页器 + 底部信息栏 -->
  <div class="articles">
    <!-- 文章卡片列表 -->
    <div v-for="article in temp" :key="article.id" v-slide-in>
      <article-latest :article="article"></article-latest>
    </div>
    <!-- 分页器 -->
    <div class="pagination">
      <a-pagination
        simple
        :defaultPageSize="10"
        :default-current="1"
        :total="articleInfo.length + 1"
        @change="onChange"
      />
    </div>
    <!-- 底部信息栏 -->
    <Footer class="footer"/>
  </div>
</template>

<script>
import articleLatest from "./article.vue";
import Footer from "../views/footer.vue";

export default {
  name: "articlesComponent",
  components: {
    articleLatest,
    Footer,
  },
  computed: {
    // 文章列表统一从 Vuex 读取，避免和 sessionStorage 双份存储。
    articleInfo() {
      return this.$store.state.articleInfo.article || [];
    },
  },
  data() {
    return {
      temp: [], //存放最近的十篇文章
    };
  },
  watch: {
    // 列表变化后同步更新分页首屏数据。
    articleInfo: {
      handler() {
        this.temp = this.articleInfo.slice(0, 10);
      },
      immediate: true,
    },
  },
  methods: {
    onChange(page) {
      this.temp = this.articleInfo.slice((page - 1) * 10, page * 10);
      //回到顶部
      //scroll(0, 0);
    },
  },
  created() {
    this.$api.article.getAll()
      .then((res) => {
        const list = ((res && res.data && res.data.data) || []).slice().reverse();
        // 只写入 Vuex，避免 Vuex + sessionStorage 的重复存储。
        this.$store.dispatch("setArticle", list);
        console.log("文章数据加载：", list);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style scoped>
.articles {
  background-color: #eff2f5;
  width: 100%;
  margin-top: 2%;
  z-index: 2;  /* ? */
  box-sizing: border-box;
}
.pagination {
  display: flex;
  justify-content: center;
}
.footer{
  margin-top: 5vh;
}
</style>