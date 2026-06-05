<!-- 这里是某个分类的所有文章，
    没有分页，只有文章题目和发表信息，
     按照年份来分组，排序 -->
<template>
  <div class="onFile">
    <div id="articleListCate">
      <div class="category-summary">
        <div class="category-summary-label">
          分类：
        </div>
        {{ cateName }}
      </div>

      <div class="archive-panel">
        <div class="archive-title">存档
        </div>
        <hr class="archive-divider" />
        <div v-for="item in cateArticle" :key="item.id" @click="jump(item.id, item.title)">
          <div id="cateItem" style="">
            {{ item.publish_time }} >>
            <a>{{ item.title }}</a>
          </div>
        </div>
      </div>

    </div>

    <Footer style="margin-top: 5vh;" />

  </div>
</template>

<script>
import Footer from "../views/footer.vue";

export default {
  name: "articleListCateComponent",

  components: {
    Footer,
  },
  //props数据中的 articleInfo 来自父组件，name来自路由参数（实际是在 category组件中带上的）
  props: ["articleInfo", "name"],
  data() {
    return {
      // data:this.$store.state.articleInfo.articleInfo,
      cateArticle: [],//分类好的文章list
      cateName: "",//分类名
      //   articleInfo:[],
    };
  },
  watch: {
    //监听name，这样name有变化时才能触发响应式更新。否则只能在url中看到变化，不会更新组件。
    "name": {
      handler(newVal) {
        // console.log("onFile!!!",newVal)
        if (newVal == 'total') {
          this.cateArticle = this.articleInfo;
          return;
        }
        
        this.cateName = newVal;
        this.cateArticle = [];
        for (var i = 0; i < this.articleInfo.length; i++) {
          if (this.articleInfo[i].category.name == newVal) {
            this.cateArticle.push(this.articleInfo[i]); //分类后的文章信息存在cache中
          }
        }
      }
    }
  },
  methods: {
    // 作废弃用，监听name了，这个方法就没什么意义了。
    cateEventHandler(name) {
      console.log("articleListCate组件", name);
      this.cateName = this.name;
      console.log(this.cateName);
      this.cateArticle = [];
      for (var i = 0; i < this.articleInfo.length; i++) {
        if (this.articleInfo[i].category == this.name) {
          this.cateArticle.push(this.articleInfo[i]); //分类后的文章信息存在cache中
        }
      }
    },
    // 点击文章，跳转到具体文章页（articleView.vue），并把文章id和name传过去
    jump(id, name) {
      this.$router.push({
        name: "articleViewComponent",
        params: {
          id,
          name,
        },
      });
    },

  },
  beforeUpdate() {
    // 在这里注册事件 ...？
    //    this.$bus.$on("cateEvent", this.cateEventHandler);
  },
  created() {
    console.log("onFile组件被创建了！");//因为再home组件中缓存了当前组件，所以点击后只触发一次 
    // 更正：默认缓存了吗？

    // this.$bus.$on("cateEvent", this.cateEventHandler);//点击事件后不被触发 .再次点击才触发?

    //以下是为了保证在初次加载时就分好类，因为wacth监听是在mounted之后执行了。
    if (this.name == 'total') {
      this.cateName = '';
      this.cateArticle = this.articleInfo;
    } else {
      this.cateName = this.name;
      this.cateArticle = [];
      for (var i = 0; i < this.articleInfo.length; i++) {
        if (this.articleInfo[i].category.name == this.name) {
          this.cateArticle.push(this.articleInfo[i]); //分类后的文章信息存在 cateArticle 
        }
      }
    }
  },
  beforeDestroy() {
    this.$bus.off();
  }

};
</script>

<style>
.onFile {
  width: 100%;
  margin-left: 0;
  margin-top: 3.5vh;
  box-sizing: border-box;
  /* margin-bottom:5vh; */
}

#articleListCate {
  /* position: relative; */
  background-color: #ffffff;
  display: inline-block;
  vertical-align: top;
  margin-left: 2%;

  width: 96%;
  border-radius: 10px;
  /* padding-top: 0%; */
  /* margin-top:6% */
  /* 不设置高度，高度就自适应了 */
  /* max-height: 1400px; */
  /* box-shadow: 0px 4px 6px 2px rgb(223, 223, 223); */
  border: 1px solid rgb(208, 215, 222);
}

.category-summary {
  background-color: #ffffff;
  margin: 15px 2% 0 2%;
  font-size: 1.1rem;
  font-weight: var(--font-weight-medium);
}

.category-summary-label {
  background-color: rgb(248, 248, 248);
  display: inline-block;
}

.archive-panel {
  background-color: #ffffff;
  margin: 15px 2% 20px 2%;
}

.archive-title {
  background-color: #ffffff;
  text-align: center;
  font-size: 1.1rem;
  color: rgb(83, 83, 83);
}

.archive-divider {
  margin-top: 5px;
  margin-bottom: 15px;
}

#cateItem {
  /* background-color: #fafafa; */
  background-color: #EFF2F5;
  margin-top: 1vh;
  font-size: 1rem;
  padding:0 2vh;
}

#cateItem:hover {
  /* background-color: rgb(255, 255, 255); */
  background-color: #eff8ff;
  color: rgb(0, 0, 0);

  /* background-color: rgb(90, 90, 90);
  color:rgb(250, 250, 250); */
  font-weight: 550;
}

/* 
#cateItem:hover a {
  color: #1890ff;
  font-weight: 550;
} */
</style>