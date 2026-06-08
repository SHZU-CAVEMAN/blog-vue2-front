<template>
  <div style="display: flex; margin-top: 0vh">
    <!-- 左侧 ：当前分类 -->
    <div v-bind:class="{ info_index: true, outter: outter }">
      <div style="">
        <div style="
            font-size: 0.9rem;
            font-weight: 550;
            display: flex;
            align-items: center;
          ">
          <a-icon type="appstore" theme="filled" />
          <a style="margin-left: 1vh">当前分类</a>
        </div>
        <hr style="margin: 1vh 0 2vh 0; color: black; height: 1.5px" />
        <div
          v-for="item in articlesCurrent"
          :key="item.id || item._id || item.name || item.title"
          @click="jump(item.id || item._id, getArticleName(item))"
        >
          <div :class="{ item_current: true, item_current_add: getArticleName(item) == name }">
            {{ getArticleName(item) }}
          </div>
        </div>
      </div>

    </div>

    <!-- 文章正文 -->
    <div v-bind:class="{ body: true, body_add: titles.length == 0 }">
      <div class="title">
        {{ name }}
      </div>
      <div v-if="publish_time || category_name" class="meta-line">
        <span v-if="publish_time" class="meta-item">时间：{{ publish_time }}</span>
        <span v-if="category_name" class="meta-item">分类：{{ category_name }}</span>
      </div>
      <hr style="margin-top: 1vh" />
      <!-- 正文 -->
      <v-md-preview :text="text" ref="preview" style="" />
   
      <hr v-if="publish_time" />
      <!-- 尾部 ：上一篇/下一篇-->
      <div v-if="publish_time" style="
          display: flex;
          flex-direction: column;
          height: 20vh;
          padding: 3vh;
        ">
        <h1 style="
            display: flex;
            align-items: center;
            font-size: 16px;
            background-color: #f6f8fa;
            padding: 1vh;
            border: 1px solid rgb(184, 184, 184);
          " @click="jumpFormer(formerId, former)">
          上一篇
          <a-icon type="double-right" style="margin-left: 1vh; margin-right: 2vh" />
          <a>{{ former }}</a>
        </h1>
        <h1 style="
            display: flex;
            align-items: center;
            margin-top: 0vh;
            font-size: 16px;
            background-color: #f6f8fa;
            padding: 1vh;
            border: 1px solid rgb(184, 184, 184);
          " @click="jumpLater(laterId, later)">
          下一篇
          <a-icon type="double-right" style="margin-left: 1vh; margin-right: 2vh" />
          <a>{{ later }}</a>
        </h1>
      </div>
    </div>

    <!-- 文章目录 -->
    <div :class="{ catalog: true, outter: outter }">
      <div class="el-icon-tickets" style="
          font-size: 2.8vh;
          margin-top: 1vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: dimgray;
        ">
        <a-icon type="container" />
        <a style="margin-bottom: 2px; margin-left: 2vh"> 目录</a>
      </div>
      <hr style="margin-top: 5px; margin-bottom: 0" />
      <div style="background-color:white; padding: 2vh;">
        <!-- 滚动条加在这里 -->
        <div v-if="titles.length" ref="catalog_scroll" class="catalog_content">
          <div :id="anchor.lineIndex" v-for="anchor in titles" :style="{
            padding: `0 0 0px ${anchor.indent * 30}px`,
            marginLeft: '0vh',
            marginRight: '0vh',
          }" @click="handleAnchorClick(anchor)" :key="anchor">
            <a id="font" style="
                cursor: pointer;
                height: 4vh;
                font-size: 0.9rem;
                background-color: 
              ">
              {{ anchor.title }}</a>
            <!-- <hr style="margin:0" /> -->
          </div>
        </div>
        <div v-else style="color: dimgray; font-size: 0.9rem; text-align: center; padding: 2vh 0;">
          暂无目录
        </div>

      </div>
    </div>
  </div>
</template>

<script>
const ARTICLE_DETAIL_CACHE_PREFIX = "article:detail:";
const ARTICLE_DETAIL_CACHE_TTL = 5 * 60 * 1000;

export default {
  name: "markdownComponent",
  props: ["id", "name"],
  components: {

  },
  data() {
    return {
      text: ``,
      // isLike: "",
      // articles:this.$store.state.articleInfo.article,
      publish_time: "",
      category_name: "",
      former: "",
      later: "",
      formerId: "",
      laterId: "",
      formerName: "",
      laterName: "",

      // anchors:'',
      titles: [],
      target: [],
      indexArray: [], //这个数组仅用于 siderbar的平移

      flag: true,
      outter: false,

      articlesCurrent: [],
      item_current_add: false,
      scroll: false,
    };
  },
  watch: {
    id: {
      handler() {
        // 1 路由参数变化时局部刷新数据，避免整页 reload 造成体验抖动。
        // 2 原先this.$router.go(0)：等同于浏览器刷新（location.reload()），整个页面销毁重建，Vuex 状态、sessionStorage 以外的所有内存数据清空，会有明显的白屏闪烁
        // 3 refreshArticle 只在组件内部重新执行一遍数据请求和状态重置，DOM 不销毁、页面不闪烁、Vuex 状态保留，路由参数（id/name）变化时平滑切换到新文章。
        this.refreshArticle();
      },
    },
    name() {
      // 标题参数变化时同步刷新，确保目录和上下篇与当前文章一致。
      this.refreshArticle();
    },
  },
  mounted() {
    // 滚动监听在 mounted 绑定，和 beforeDestroy 成对管理。
    window.addEventListener("scroll", this.handleScroll);
    this.refreshArticle();
  },

  methods: {
    getArticleCacheKey(id) {
      return `${ARTICLE_DETAIL_CACHE_PREFIX}${id || ""}`;
    },
    // 读取详情缓存：返回 payload 和是否过期标记。
    getArticleCache(id) {
      try {
        const raw = sessionStorage.getItem(this.getArticleCacheKey(id));
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.payload) return null;

        const timestamp = parsed.timestamp || 0;
        const expired = Date.now() - timestamp > ARTICLE_DETAIL_CACHE_TTL;

        return {
          payload: parsed.payload,
          expired,
        };
      } catch (error) {
        return null;
      }
    },
    // 仅缓存详情必需字段，避免在会话存储里写入冗余数据。
    setArticleCache(id, payload) {
      const cachePayload = {
        content:
          payload.content ||
          payload.markdown ||
          payload.md ||
          payload.body ||
          payload.text ||
          "",
        publish_time: payload.publish_time || payload.publishTime || "",
        category_name: this.getCategoryName(payload) || "",
      };

      const data = {
        timestamp: Date.now(),
        payload: cachePayload,
      };

      sessionStorage.setItem(this.getArticleCacheKey(id), JSON.stringify(data));
    },
    // 将详情数据统一映射到组件状态，避免缓存与接口两处赋值逻辑不一致。
    applyArticlePayload(payload) {
      this.text =
        payload.content ||
        payload.markdown ||
        payload.md ||
        payload.body ||
        payload.text ||
        "";

      this.publish_time =
        payload.publish_time || payload.publishTime || this.publish_time;
      this.category_name = payload.category_name || this.getCategoryName(payload) || this.category_name;
    },
    buildCatalogInNextFrame() {
      this.$nextTick().then(() => {
        // markdown 渲染为 DOM 有异步时序，延后一帧提取目录更稳定。
        setTimeout(() => {
          this.buildCatalog();
        }, 0);
      });
    },
    // 统一刷新文章详情、目录和上下篇数据，避免把初始化逻辑散落在生命周期里。
    refreshArticle() {
      this.getArticlesCurrent(this.name);

      // 每次刷新前清空状态，避免 keep-alive 或参数切换导致旧数据残留。
      this.titles = [];
      this.target = [];
      this.indexArray = [];
      this.former = "";
      this.later = "";
      this.formerId = "";
      this.laterId = "";

      // 文章详情改为从后端接口 /articles/:id 获取
      const articleId = encodeURIComponent(this.id);
      const url = `/articles/${articleId}`;

      // 详情缓存策略（SWR）：
      // 1) 命中缓存先展示，保证切换体验流畅。
      // 2) 无论缓存是否过期，都在后台再请求一次，确保内容能跟随后端更新。
      // 3) 请求成功后覆盖缓存和页面数据，避免“改了文章但页面仍旧”的问题。
      const cache = this.getArticleCache(this.id);
      if (cache && cache.payload) {
        this.applyArticlePayload(cache.payload);
        this.buildCatalogInNextFrame();
      }

      this.$api.article.getDetail(this.id)
        .then((res) => {
          const payload = res && res.data ? (res.data.data || res.data) : {};
          this.applyArticlePayload(payload);

          // 接口成功后回写缓存，减少后续重复请求。
          this.setArticleCache(this.id, payload);
        })
        .then(() => this.buildCatalogInNextFrame())
        .catch((err) => {
          // 手动上报文章详情请求异常，附带文章 id/name 便于快速定位问题数据。
          this.$reportError("article-detail-fetch-failed", err, {
            module: "markdown",
            articleId: this.id,
            articleName: this.name,
            requestUrl: url,
          });
        });

      // 上下篇信息统一基于 Vuex 文章列表计算，避免列表重复存储。
      const articles = this.$store.state.articleInfo.article || [];
      for (let i = 0; i < articles.length; i++) {
        if (this.getArticleName(articles[i]) == this.name) {
          this.publish_time =
            articles[i].publish_time || articles[i].publishTime || this.publish_time;
          this.category_name = this.getCategoryName(articles[i]) || this.category_name;
          if (i != 0 && i != articles.length - 1) {
            this.former = this.getArticleName(articles[i - 1]);
            this.later = this.getArticleName(articles[i + 1]);
            this.formerId = articles[i - 1].id || articles[i - 1]._id;
            this.laterId = articles[i + 1].id || articles[i + 1]._id;
          }
          if (i == 0) {
            this.former = "温馨提示：目前是第一篇";
            this.later = this.getArticleName(articles[i + 1]);
            this.laterId = (articles[i + 1] && (articles[i + 1].id || articles[i + 1]._id)) || "";
          }
          if (i == articles.length - 1) {
            this.former = this.getArticleName(articles[i - 1]);
            this.later = "温馨提示：目前是最后一篇";
            this.formerId = (articles[i - 1] && (articles[i - 1].id || articles[i - 1]._id)) || "";
          }
        }
      }
    },
    buildCatalog() {
      if (!this.$refs.preview || !this.$refs.preview.$el) {
        this.titles = [];
        return;
      }

      this.target = [];
      this.indexArray = [];

      const anchors = this.$refs.preview.$el.querySelectorAll("h1,h2,h3,h4,h5,h6");
      const titles = Array.from(anchors).filter((title) => !!title.innerText.trim());

      this.flag = titles.length !== 0;
      this.$bus.$emit("changeStyleEvent", this.flag);

      if (!titles.length) {
        this.titles = [];
        return;
      }

      const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();
      this.titles = titles.map((el) => ({
        title: el.innerText,
        lineIndex: el.getAttribute("data-v-md-line"),
        indent: hTags.indexOf(el.tagName),
      }));

      for (let i = 0; i < this.titles.length; i++) {
        const item = this.$refs.preview.$el.querySelector(
          `[data-v-md-line="${this.titles[i].lineIndex}"]`
        );
        if (item) {
          this.target.push(item);
          this.indexArray.push(this.titles[i].lineIndex);
        }
      }

      const options = {
        rootMargin: "5% 0px -70% 0px",
      };
      const observer = new IntersectionObserver(
        this.debounce(this.observeScroll, 100),
        options
      );
      Array.from(this.target, (item) => observer.observe(item));
    },
    getArticleName(article) {
      if (!article) return "";
      return article.name || article.title || "";
    },
    getCategoryName(article) {
      if (!article) return "";
      const category = article.category;
      if (typeof category === "string") return category;
      if (category && typeof category === "object") {
        return category.name || category.title || "";
      }
      return "";
    },
    // 防抖函数
    debounce(func, wait) {
      let timeout;
      return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          func.apply(context, args);
        }, wait);
      };
    },
    // 文章跳转：上一篇/下一篇
    jump(id, name) {
      this.$router.push({
        name: "articleViewComponent",
        params: {
          id,
          name,
        },
      });
    },
    // 获取当前同分类文章列表
    getArticlesCurrent(name) {
      const articles = this.$store.state.articleInfo.article || [];
      this.articlesCurrent = [];

      const current = articles.find(
        (item) =>
          this.getArticleName(item) === name ||
          String(item.id || item._id || "") === String(this.id || "")
      );

      const currentCategory = this.getCategoryName(current);
      if (!currentCategory) return;

      this.articlesCurrent = articles.filter(
        (item) => this.getCategoryName(item) === currentCategory
      );
      console.log("当前同分类文章列表：", this.articlesCurrent);
    },
    // 两侧滚动监听：滚动则改变样式。
    handleScroll() {
      this.scroll = true;
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 60) {
        this.outter = true;
      } else {
        this.outter = false;
      }
      // console.log("left组件：滚动距离" + scrollTop);
    },
    //去除除了line所对应标题的字体样式（还原成dimgray）
    removeClass(line) {
      for (let i = 0; i < this.target.length; i++) {
        const domline = this.target[i].getAttribute("data-v-md-line");
        if (domline != line) {
          const dom = document.getElementById(domline);
          if (!dom) continue;
          dom.style.color = "dimgray";
          dom.style.fontWeight = "500";
        }
      }
    },

    // 文章相应标题出现在视口，则改变右侧目录的标题字体的样式(右侧也应该滚动)
    observeScroll(item) {
      // console.log(item);
      item.forEach((observe) => {
        //为什么这里要用 forEach ？
        // console.log('哈？', observe);//observe是一个 IntersectionObserver对象，从其target属性中可以获取观察的dom对象。
        if (observe) {
          const line = item[0].target.getAttribute("data-v-md-line"); //line为标题所在文章中的行数
          // console.log('?',line)
          this.removeClass(line);
          const dom = document.getElementById(line);
          console.log("hahahahahahah了", dom);
          //这个方法效果不太行：
          // console.log(this.$refs.catalog_scroll)
          dom.scrollIntoView({
            behavior: "instant",
            block: "center",
            inline: "start",
          });
          dom.style.color = "#24292f";
          // dom.style.color = "black";
          dom.style.fontWeight = "600";
          // sider.style.transform = `translateY(${index * 5}vh)`;
        }
      });
    },

    // 点击目录，文章滚动到相应位置（√）
    handleAnchorClick(anchor) {
      // console.log('执行了！！！！')
      const { preview } = this.$refs;
      // console.log("最好！", preview.html); //打印整个文章的html
      const { lineIndex } = anchor;
      // console.log("哈哈哈哈",anchor);
      //heading为文章滚动的位置（行数）
      const heading = preview.$el.querySelector(
        `[data-v-md-line="${lineIndex}"]`
      );

      if (heading) {
        preview.scrollToTarget({
          //scrollToTarget是 v-md-editor 封装的方法。
          target: heading,
          scrollContainer: window,
          top: 20,
        });
      }
    },
    jumpFormer(id, name) {
      if (id != "") {
        this.$router.push({
          name: "articleViewComponent",
          params: {
            id,
            name,
          },
        });
      }
    },
    jumpLater(id, name) {
      if (id != "") {
        this.$router.push({
          name: "articleViewComponent",
          params: {
            id,
            name,
          },
        });
      }
    },
  },
  beforeDestroy() {
    // 卸载时移除滚动监听，避免重复绑定导致的性能问题。
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
.info_index::-webkit-scrollbar {
  width: 0 !important;
}

.info_index {
  width: 18%;
  margin-left: 0%;
  display: flex;
  flex-direction: column;
  position: absolute;
  border: 1px solid rgb(178, 178, 178);

  padding: 3vh;

  top: 10vh;
  bottom: 0;
  background-color: white;
  overflow-y: scroll;
}

.outter {
  position: fixed;
  top: 0;
}

.info {
  background-color: #ffffff;
  width: 100%;
  /* height: 30vh; */
  padding: 2vh;
  font-size: 0.9rem;
  border-radius: 1vh;
  border: 1px solid rgb(178, 178, 178);
}

.info:hover {
  box-shadow: 0vh 0vh 1vh rgb(163, 163, 163);
}

.index {
  background-color: white;
  width: 100%;
  /* height: 30vh; */
  margin-top: 3vh;
  padding: 2vh;
  font-size: 0.9rem;
  border-radius: 1vh;
  border: 1px solid rgb(178, 178, 178);
}

.index:hover {
  box-shadow: 0vh 0vh 1vh rgb(143, 143, 143);
}

/* 文章主体样式 */
.body {
  background-color: rgb(255, 255, 255);
  /* background-color: #EFF2F5; */
  width: 60%;
  margin-left: 20%;
  margin-top: 2vh;
  color: black;
  border-radius: 1vh;
  border: 1px solid rgb(178, 178, 178);
}

/* 上一篇下一篇样式 */
h1 a {
  color: var(--interactive-text-rest);
  text-decoration: none;
}

h1:hover a {
  color: var(--interactive-text-active);
  font-weight: 550;
}

.catalog {
  /* overflow: auto; */
  position: fixed;
  right: 1%;
  margin-left: 0;
  margin-top: 2vh;
  background-color: #eff2f5;
  /* background-color: #ffffff; */
  overflow: hidden;
  width: 18%;
  /* min-height: 10vh; */
  /* max-height: 50vh; */
  /* overflow-y: scroll; */
  border-radius: 2vh;
  border: 1px solid rgb(178, 178, 178);
}

.catalog_content {
  /* background-color: #e7f3ff; */
  /* background-color: #ffffff; */
  overflow-y: scroll;
  max-height: 45vh;
}

/* 隐藏滚动条 */
.catalog_content::-webkit-scrollbar {
  width: 0 !important;
  /* width: 2px; */
  background-color: rgb(228, 228, 228);
}

.catalog_content::-webkit-scrollbar-thumb {
  background-color: rgb(158, 158, 158);
}

/* 左侧当前分类样式 */
.item_current {
  background-color: #eff2f5;
  margin-top: 1vh;
  font-size: 0.9rem;
  border-radius: 1vh;
  padding: 0 1vh;
  color: var(--interactive-text-rest);
}

.item_current:hover {
  color: var(--interactive-text-active);
  font-weight: 550;
  border: 1px solid rgb(178, 178, 178);
}

.item_current_add {
  color: var(--interactive-text-active);
  font-weight: 550;
  border: 1px solid rgb(178, 178, 178);
}

/* 文章标题样式 */
.title {
  margin-top: 3vh;
  font-weight: 550;
  font-size: 1.3rem;
  color: black;
  text-align: center;
}

.meta-line {
  margin-top: 0.5vh;
  display: flex;
  justify-content: flex-end;
  gap: 1.5vh;
  color: dimgray;
  font-size: 0.85rem;
  padding: 0 clamp(12px, 2vw, 24px);
}

.meta-item {
  white-space: nowrap;
}

.sider {
  width: 2px;
  height: 100%;
  background: #999999;
  position: absolute;
  left: 0;
  top: 17vh;
  border-radius: 10px;
  margin: auto;
  bottom: 0;
}

.siderbar {
  display: flex;
  width: 100%;
  height: 4vh;
  line-height: 2;
  background: rgb(166, 166, 166);
  transition: all 0.1s;
}
</style>