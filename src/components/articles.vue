<template>
  <!-- 中间主体部分：文章卡片列表 + 分页器 + 底部信息栏 -->
  <div class="articles">
    <!-- 文章卡片列表 -->
    <div v-for="article in temp" :key="article.id" v-slide-in>
      <article-latest :article="article"></article-latest>
    </div>
    <!-- 分页器 -->
    <div class="pagination">
      <common-pagination
        :total="articleInfo.length"
        :current.sync="page"
        :page-size.sync="pageSize"
        :page-size-options="pageSizeOptions"
        @change="onPaginationChange"
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
      // 当前页码与每页条数由通用分页器双向驱动。
      page: 1,
      pageSize: 10,
      // 分页器可选的“每页行数”配置。
      pageSizeOptions: ["5", "10", "20", "30", "50"],
    };
  },
  watch: {
    // 列表变化后同步更新分页首屏数据。
    articleInfo: {
      handler() {
        this.page = 1;
        this.updatePageData();
      },
      immediate: true,
    },
  },
  methods: {
    // 基于当前 page/pageSize 计算当前页数据切片。
    updatePageData() {
      const start = (this.page - 1) * this.pageSize;
      const end = this.page * this.pageSize;
      this.temp = this.articleInfo.slice(start, end);
    },
    // 统一处理分页器变更（翻页、改每页条数）。
    onPaginationChange({ page, pageSize }) {
      this.page = page;
      this.pageSize = pageSize;
      this.updatePageData();
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
  background-color: var(--color-bg-page);
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