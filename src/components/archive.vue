<template>
  <div class="archive-page">
    <section class="archive-shell">
      <div class="archive-heading">
        <h2>归档</h2>
        <div class="archive-modes" role="tablist" aria-label="归档方式">
          <button
            :class="{ 'archive-mode-active': mode === 'time' }"
            role="tab"
            type="button"
            @click="mode = 'time'"
          >
            时间
          </button>
          <button
            :class="{ 'archive-mode-active': mode === 'category' }"
            role="tab"
            type="button"
            @click="mode = 'category'"
          >
            分类
          </button>
        </div>
      </div>

      <div v-if="mode === 'time'" class="archive-groups">
        <section v-for="yearGroup in timeGroups" :key="yearGroup.year" class="archive-year-group">
          <h3>{{ yearGroup.year }} 年</h3>
          <section v-for="monthGroup in yearGroup.months" :key="monthGroup.key" class="archive-month-group">
            <h4>{{ monthGroup.month }} 月</h4>
            <div
              v-for="article in monthGroup.articles"
              :key="article.id"
              class="archive-article"
            >
              <time>{{ getPublishDate(article) }}</time>
              <router-link
                :to="{
                  name: 'articleViewComponent',
                  params: { id: article.id, name: article.title },
                }"
                class="archive-article-title"
              >
                {{ article.title }}
              </router-link>
            </div>
          </section>
        </section>
      </div>

      <div v-else class="archive-groups">
        <section v-for="categoryGroup in categoryGroups" :key="categoryGroup.name" class="archive-year-group">
          <h3>{{ categoryGroup.name }} <small>{{ categoryGroup.articles.length }}</small></h3>
          <div
            v-for="article in categoryGroup.articles"
            :key="article.id"
            class="archive-article"
          >
            <time>{{ getPublishDate(article) }}</time>
            <router-link
              :to="{
                name: 'articleViewComponent',
                params: { id: article.id, name: article.title },
              }"
              class="archive-article-title"
            >
              {{ article.title }}
            </router-link>
          </div>
        </section>
      </div>

      <div v-if="!sortedArticles.length" class="archive-empty">暂无文章</div>
    </section>
    <Footer class="archive-footer" />
  </div>
</template>

<script>
import Footer from "../views/footer.vue";

export default {
  name: "archiveComponent",
  components: {
    Footer,
  },
  props: ["articleInfo"],
  data() {
    return {
      mode: "time",
    };
  },
  computed: {
    sortedArticles() {
      return (this.articleInfo || []).slice().sort((first, second) => {
        return this.getDateValue(second) - this.getDateValue(first);
      });
    },
    timeGroups() {
      const groups = {};

      this.sortedArticles.forEach((article) => {
        const date = this.getDateParts(article);
        const key = `${date.year}-${date.month}`;

        if (!groups[date.year]) {
          groups[date.year] = {
            year: date.year,
            months: {},
          };
        }
        if (!groups[date.year].months[key]) {
          groups[date.year].months[key] = {
            key,
            month: date.month,
            articles: [],
          };
        }
        groups[date.year].months[key].articles.push(article);
      });

      return Object.values(groups)
        .map((yearGroup) => ({
          year: yearGroup.year,
          months: Object.values(yearGroup.months).sort((first, second) => Number(second.month) - Number(first.month)),
        }))
        .sort((first, second) => Number(second.year) - Number(first.year));
    },
    categoryGroups() {
      const groups = {};

      this.sortedArticles.forEach((article) => {
        const name = this.getCategoryName(article) || "未分类";
        if (!groups[name]) {
          groups[name] = {
            name,
            articles: [],
          };
        }
        groups[name].articles.push(article);
      });

      return Object.values(groups).sort((first, second) => first.name.localeCompare(second.name, "zh-CN"));
    },
  },
  methods: {
    getDateParts(article) {
      const rawDate = String(article.publishTime || article.publish_time || "");
      const values = rawDate.match(/\d+/g) || [];

      return {
        year: values[0] || "未知",
        month: String(values[1] || "0").padStart(2, "0"),
      };
    },
    getDateValue(article) {
      const rawDate = String(article.publishTime || article.publish_time || "");
      const values = rawDate.match(/\d+/g) || [];
      return Number(`${values[0] || 0}${String(values[1] || 0).padStart(2, "0")}${String(values[2] || 0).padStart(2, "0")}`);
    },
    getPublishDate(article) {
      const date = article.publishTime || article.publish_time || "未标注日期";
      return String(date).replace(/\//g, "-");
    },
    getCategoryName(article) {
      const category = article && article.category;
      return typeof category === "string"
        ? category
        : category && (category.name || category.title) || "";
    },
    ensureArticleData() {
      if ((this.articleInfo || []).length > 0) {
        return;
      }

      this.$api.article.getAll()
        .then((response) => {
          const articles = ((response && response.data && response.data.data) || []).slice();
          this.$store.dispatch("setArticle", articles);
        })
        .catch((error) => {
          this.$message.warning("归档文章加载失败" + error.message);
        });
    },
  },
  created() {
    this.ensureArticleData();
  },
};
</script>

<style scoped>
.archive-page {
  margin-top: 2vh;
}

.archive-shell {
  min-height: calc(100vh - 35vh);
  border: 1px solid var(--color-border-primary);
  border-radius: 8px;
  padding: 24px;
  background: var(--color-bg-surface);
  box-sizing: border-box;
}

.archive-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border-primary);
}

.archive-heading h2,
.archive-year-group h3,
.archive-month-group h4 {
  margin: 0;
  color: var(--text-color-primary);
  color: var(--text-color-secondary);
}

.archive-heading h2 {
  font-family: var(--font-family-sans);
  font-size: 1.4rem;
  font-weight: var(--font-weight-medium);
  line-height: 1.2;
}

.archive-modes {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--color-border-primary);
  border-radius: 6px;
  background: var(--color-bg-muted);
}

.archive-modes button {
  border: 0;
  border-radius: 5px;
  padding: 4px 10px;
  background: transparent;
  color: var(--interactive-text-rest);
  cursor: pointer;
  font: inherit;
}

.archive-modes .archive-mode-active {
  background: var(--color-bg-surface);
  color: var(--interactive-text-active);
}

.archive-groups {
  margin-top: 24px;
}

.archive-year-group h3 + .archive-article {
  margin-top: 14px;
}

.archive-year-group + .archive-year-group {
  margin-top: 24px;
}

.archive-year-group h3 {
  font-size: 1.15rem;
  text-align: center;
  color: var(--text-color-secondary);
}

.archive-year-group h3 small {
  margin-left: 6px;
  color: var(--text-color-secondary);
  font-size: 0.8rem;
  font-weight: var(--font-weight-regular);
}

.archive-month-group {
  margin: 16px 0 0 0px;
}

.archive-month-group h4 {
  margin-bottom: 8px;
  color: var(--text-color-secondary);
  font-size: 0.95rem;
}

.archive-article {
  display: grid;
  width: 100%;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: 10px;
  border: 0;
  border-bottom: 1px solid var(--color-border-primary);
  padding: 6px 4px;
  background: transparent;
  color: var(--interactive-text-rest);
  font-size: var(--font-size-xl);
  text-align: left;
}

.archive-article-title {
  color: var(--interactive-text-rest);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
}

.archive-article-title:hover {
  color: var(--interactive-text-active);
}

.archive-article time {
  color: var(--text-color-secondary);
  font-variant-numeric: tabular-nums;
}

.archive-empty {
  padding: 40px 0;
  color: var(--text-color-secondary);
  text-align: center;
}

.archive-footer {
  margin-top: 5vh;
}

@media (max-width: 768px) {
  .archive-shell {
    min-height: calc(100vh - var(--mobile-nav-height, 80px) - 120px);
    padding: 16px;
  }

  .archive-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .archive-month-group {
    margin-left: 0;
  }

  .archive-article {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>