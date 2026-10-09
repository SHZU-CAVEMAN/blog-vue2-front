<template>
  <!-- 中间主体部分：文章卡片列表 + 分页器 + 底部信息栏 -->
  <div class="articles">
    <blogger-intro class="profile-header" />
    <div v-if="selectedCategory" class="filter-summary">
      <span>分类：{{ selectedCategory }}</span>
      <button type="button" @click="clearCategoryFilter">查看全部</button>
    </div>
    <!-- 文章卡片列表 -->
    <div v-for="article in temp" :key="article.id" v-slide-in>
      <ArticleCard :article="article"></ArticleCard>
    </div>
    <!-- 分页器 -->
    <div class="pagination">
      <common-pagination
        :total="filteredArticleInfo.length"
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
import ArticleCard  from "./article.vue";
import BloggerIntro from "./bloggerIntro.vue";
import Footer from "../views/footer.vue";

export default {
  name: "articlesComponent",
  components: {
    ArticleCard,
    BloggerIntro,
    Footer,
  },
  computed: {
    // 文章列表统一从 Vuex 读取，避免和 sessionStorage 双份存储。
    articleInfo() {
      return this.$store.state.articleInfo.article || [];
    },
    selectedCategory() {
      return this.$route.query.category || "";
    },
    filteredArticleInfo() {
      if (!this.selectedCategory) {
        return this.articleInfo;
      }

      return this.articleInfo.filter((article) => this.getCategoryName(article) === this.selectedCategory);
    },
  },
  data() {
    return {
      temp: [], //存放最近的十篇文章
      // 当前页码与每页条数由通用分页器双向驱动。
      page: 1,
      pageSize: 20,
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
    selectedCategory() {
      this.page = 1;
      this.updatePageData();
    },
  },
  methods: {
    // 基于当前 page/pageSize 计算当前页数据切片。
    updatePageData() {
      const start = (this.page - 1) * this.pageSize;
      const end = this.page * this.pageSize;
      this.temp = this.filteredArticleInfo.slice(start, end);
    },
    getCategoryName(article) {
      const category = article && article.category;
      return typeof category === "string"
        ? category
        : category && (category.name || category.title) || "";
    },
    clearCategoryFilter() {
      this.$router.push({ name: "articles" });
    },
    // 统一处理分页器变更（翻页、改每页条数）。
    onPaginationChange({ page, pageSize }) {
      // 先瞬时回顶，再渲染新页数据：保证 v-slide-in 判断时元素位于首屏以下，后续下拉仍能触发动画。
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

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
        //console.log("文章数据加载：", list);
    }).catch((err) => {
        this.$message.warning("文章列表加载失败"+ err.message);
    });
  },
};
</script>

<style scoped>
.articles {
  background-color: var(--color-bg-page);
  box-sizing: border-box;
}
.profile-header {
  margin-bottom: 16px;
}
.filter-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 10px 14px;
  border: 1px solid var(--color-border-primary);
  border-radius: 8px;
  background-color: var(--color-bg-surface);
  color: var(--text-color-primary);
}
.filter-summary button {
  border: 0;
  padding: 4px 0;
  background: transparent;
  color: var(--interactive-text-rest);
  cursor: pointer;
  font: inherit;
}
.filter-summary button:hover {
  color: var(--interactive-text-active);
}
.pagination {
  display: flex;
  justify-content: center;
}
.footer{
  margin-top: 5vh;
}
</style>