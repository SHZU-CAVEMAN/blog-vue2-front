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
    <Footer />
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
  data() {
    return {
      articleInfo: [], //存放所有文章
      temp: [], //存放最近的十篇文章
    };
  },
  methods: {
    onChange(page) {
      this.temp = this.articleInfo.slice((page - 1) * 10, page * 10);
      //回到顶部
      //scroll(0, 0);
    },
  },
  created() {
    this.$axios({
      method: "get",
      url: "/articles",
    })
      .then((res) => {
       
        for (var i = 0; i < res.data.data.length; i++) {
          this.articleInfo.unshift(res.data.data[i]); //倒序输出
        }
        //vuex存起来
        this.$store.dispatch("setArticle", this.articleInfo);
        //sessionStorage存起来
        sessionStorage.setItem(
          "article",
          JSON.stringify(this.$store.state.articleInfo.article)
        );
        
        this.temp = this.articleInfo.slice(0, 10);
         console.log("文章数据加载：",this.articleInfo);
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
</style>