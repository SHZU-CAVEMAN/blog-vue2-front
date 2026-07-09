<template>
  <div class="markdown-layout" @touchstart.passive="handleTouchStart" @touchend.passive="handleTouchEnd">
    <!-- 移动端抽屉入口：左侧同类文章、右侧目录。 -->
    <button class="drawer-handle drawer-handle-left" @click="openLeftDrawer">同类</button>
    <button class="drawer-handle drawer-handle-right" @click="openRightDrawer">目录</button>
    <!-- 抽屉打开时显示遮罩，点击遮罩收起抽屉。 -->
    <div v-if="isAnyDrawerOpen" class="drawer-mask" @click="closeDrawers"></div>

    <!-- 左侧 ：当前分类 -->
    <div v-bind:class="{ 'info_index': true, 'outter': outter, 'drawer-open': isLeftDrawerOpen }">
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

    <!-- 文章主体 -->
    <div v-bind:class="{ 'body': true }">
      <!-- 头部：标题，小字信息 -->
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
      <!-- 尾部 ：上一篇/下一篇-->
      <div v-if="publish_time" class="prev-next-wrap">
        <h1 class="prev-next-item" @click="jumpFormer(formerId, former)">
          上一篇
          <a-icon type="double-right" style="margin-left: 1vh; margin-right: 2vh" />
          <a>{{ former }}</a>
        </h1>
        <h1 class="prev-next-item" @click="jumpLater(laterId, later)">
          下一篇
          <a-icon type="double-right" style="margin-left: 1vh; margin-right: 2vh" />
          <a>{{ later }}</a>
        </h1>
      </div>
    </div>

    <!-- 文章目录 -->
    <div :class="{ 'catalog': true, 'outter': outter, 'drawer-open': isRightDrawerOpen }">
      <div class="el-icon-tickets catalog-head">
        <a-icon type="container" />
        <a style="margin-bottom: 2px; margin-left: 2vh"> 目录</a>
      </div>
      <hr style="margin-top: 5px; margin-bottom: 0" />
      <div class="catalog-body">
        <!-- 滚动条加在这里 -->
        <div v-if="titles.length" ref="catalog_scroll" class="catalog_content">
          <div :id="anchor.lineIndex" v-for="anchor in titles" :style="{
            padding: `0 0 0px ${anchor.indent * 30}px`,
            marginLeft: '0vh',
            marginRight: '0vh',
          }" @click="handleAnchorClick(anchor)" :key="anchor">
            <a id="font" class="catalog-link">
              {{ anchor.title }}</a>
            <!-- <hr style="margin:0" /> -->
          </div>
        </div>
        <div v-else class="catalog-empty">
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
      // 左抽屉（同类文章）开关状态。
      isLeftDrawerOpen: false,
      // 右抽屉（目录）开关状态。
      isRightDrawerOpen: false,

      articlesCurrent: [],
      item_current_add: false,
      scroll: false,
      articleListLoading: null,
      // 触摸手势起点：用于计算横向滑动方向与距离。
      touchStartX: 0,
      touchStartY: 0,
    };
  },
  computed: {
    isAnyDrawerOpen() {
      // 任一抽屉打开都视为“抽屉态”，用于遮罩和滚动锁定。
      return this.isLeftDrawerOpen || this.isRightDrawerOpen;
    },
  },
  watch: {
    id: {
      handler() {
        this.closeDrawers();
        // 1 路由参数变化时局部刷新数据，避免整页 reload 造成体验抖动。
        // 2 原先this.$router.go(0)：等同于浏览器刷新（location.reload()），整个页面销毁重建，Vuex 状态、sessionStorage 以外的所有内存数据清空，会有明显的白屏闪烁
        // 3 refreshArticle 只在组件内部重新执行一遍数据请求和状态重置，DOM 不销毁、页面不闪烁、Vuex 状态保留，路由参数（id/name）变化时平滑切换到新文章。
        this.refreshArticle();
      },
    },
    name() {
      this.closeDrawers();
      // 标题参数变化时同步刷新，确保目录和上下篇与当前文章一致。
      this.refreshArticle();
    },
    isAnyDrawerOpen(next) {
      // 抽屉态锁定 body 滚动，防止背景正文跟随滚动。
      if (typeof document !== "undefined") {
        document.body.style.overflow = next ? "hidden" : "";
      }
    },
  },
  mounted() {
    // 滚动监听在 mounted 绑定，和 beforeDestroy 成对管理。
    window.addEventListener("scroll", this.handleScroll);
    this.refreshArticle();
  },

  methods: {
    // 读取当前主题变量：用于 JS 动态高亮目录时和 CSS 主题保持一致。
    readThemeVar(name, fallback) {
      const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return value || fallback;
    },
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
    // 详情页刷新时确保文章列表可用：用于左侧同分类和上下篇计算。
    ensureArticleListReady() {
      const existing = this.$store.state.articleInfo.article || [];
      if (Array.isArray(existing) && existing.length) {
        return Promise.resolve(existing);
      }

      if (this.articleListLoading) {
        return this.articleListLoading;
      }

      this.articleListLoading = this.$api.article.getAll()
        .then((res) => {
          const list = ((res && res.data && res.data.data) || []).slice().reverse();
          this.$store.dispatch("setArticle", list);
          return list;
        })
        .catch((error) => {
          this.$reportError("article-list-fetch-failed", error, {
            module: "markdown",
            articleId: this.id,
            articleName: this.name,
          });
          return [];
        })
        .finally(() => {
          this.articleListLoading = null;
        });

      return this.articleListLoading;
    },
    // 统一基于文章列表计算“同分类 + 上下篇”。
    syncRelatedArticles(articles) {
      const list = Array.isArray(articles) ? articles : [];
      this.getArticlesCurrent(this.name, list);

      for (let i = 0; i < list.length; i++) {
        if (this.getArticleName(list[i]) == this.name) {
          this.publish_time =
            list[i].publish_time || list[i].publishTime || this.publish_time;
          this.category_name = this.getCategoryName(list[i]) || this.category_name;
          if (i != 0 && i != list.length - 1) {
            this.former = this.getArticleName(list[i - 1]);
            this.later = this.getArticleName(list[i + 1]);
            this.formerId = list[i - 1].id || list[i - 1]._id;
            this.laterId = list[i + 1].id || list[i + 1]._id;
          }
          if (i == 0) {
            this.former = "温馨提示：目前是第一篇";
            this.later = this.getArticleName(list[i + 1]);
            this.laterId = (list[i + 1] && (list[i + 1].id || list[i + 1]._id)) || "";
          }
          if (i == list.length - 1) {
            this.former = this.getArticleName(list[i - 1]);
            this.later = "温馨提示：目前是最后一篇";
            this.formerId = (list[i - 1] && (list[i - 1].id || list[i - 1]._id)) || "";
          }
          break;
        }
      }
    },
    // 统一刷新文章详情、目录和上下篇数据，避免把初始化逻辑散落在生命周期里。
    refreshArticle() {
      // 每次刷新前清空状态，避免 keep-alive 或参数切换导致旧数据残留。
      this.titles = [];
      this.target = [];
      this.indexArray = [];
      this.former = "";
      this.later = "";
      this.formerId = "";
      this.laterId = "";

      // 刷新时优先保障文章列表可用，避免刷新详情页后同分类/上下篇为空。
      this.ensureArticleListReady().then((articles) => {
        this.syncRelatedArticles(articles);
      });

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
    getArticlesCurrent(name, articleList) {
      const articles = Array.isArray(articleList) ? articleList : (this.$store.state.articleInfo.article || []);
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
          // 非激活目录项恢复为“交互常态色”（灰色），避免写死颜色导致主题不一致。
          dom.style.color = this.readThemeVar("--interactive-text-rest", "dimgray");
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
          //这个方法效果不太行：
          // console.log(this.$refs.catalog_scroll)
          dom.scrollIntoView({
            behavior: "instant",
            block: "center",
            inline: "start",
          });
          // 当前目录项使用“交互激活色”，跟随 light/dark 主题联动。
          dom.style.color = this.readThemeVar("--interactive-text-active", "#24292f");
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
    openLeftDrawer() {
      // 打开左抽屉前先关闭右抽屉，避免双抽屉重叠。
      this.isRightDrawerOpen = false;
      this.isLeftDrawerOpen = true;
    },
    openRightDrawer() {
      // 打开右抽屉前先关闭左抽屉，避免双抽屉重叠。
      this.isLeftDrawerOpen = false;
      this.isRightDrawerOpen = true;
    },
    closeDrawers() {
      // 统一关闭入口：按钮、遮罩、路由切换、手势都会调用。
      this.isLeftDrawerOpen = false;
      this.isRightDrawerOpen = false;
    },
    isMobileDrawerMode() {
      // 抽屉手势仅在中小屏启用，桌面端保持原有三栏交互。
      return typeof window !== "undefined" && window.innerWidth <= 1200;
    },
    handleTouchStart(event) {
      if (!this.isMobileDrawerMode() || !event.touches || !event.touches.length) {
        return;
      }

      // 记录手势起点坐标，供 touchend 计算偏移量。
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    },
    handleTouchEnd(event) {
      if (!this.isMobileDrawerMode() || !event.changedTouches || !event.changedTouches.length) {
        return;
      }

      const endX = event.changedTouches[0].clientX;
      const endY = event.changedTouches[0].clientY;
      const deltaX = endX - this.touchStartX;
      const deltaY = endY - this.touchStartY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // 只响应横向滑动，降低误触概率。
      if (absX < 52 || absY > absX) {
        return;
      }

      const width = window.innerWidth || 0;
      // 仅在边缘触发“打开抽屉”，降低误触概率。
      const edgeTriggerWidth = 26;

      if (!this.isAnyDrawerOpen) {
        // 左边缘向右滑：打开左抽屉。
        if (this.touchStartX <= edgeTriggerWidth && deltaX > 0) {
          this.openLeftDrawer();
          return;
        }

        // 右边缘向左滑：打开右抽屉。
        if (this.touchStartX >= width - edgeTriggerWidth && deltaX < 0) {
          this.openRightDrawer();
        }
        return;
      }

      // 左抽屉打开时，向左滑可关闭。
      if (this.isLeftDrawerOpen && deltaX < 0) {
        this.closeDrawers();
        return;
      }

      // 右抽屉打开时，向右滑可关闭。
      if (this.isRightDrawerOpen && deltaX > 0) {
        this.closeDrawers();
      }
    },
  },
  beforeDestroy() {
    // 卸载时移除滚动监听，避免重复绑定导致的性能问题。
    window.removeEventListener("scroll", this.handleScroll);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  },
};
</script>

<style scoped>
/* 详情页基础三栏：左同类 + 中正文 + 右目录。 */
.markdown-layout {
  display: flex;
  margin-top: 0;
}

/* 默认隐藏移动端抽屉入口和遮罩。 */
.drawer-handle,
.drawer-mask {
  display: none;
}

.info_index::-webkit-scrollbar {
  /* 左侧同类列表隐藏滚动条，保留滚动能力。 */
  width: 0 !important;
}

.info_index {
  /* 左侧“当前分类”浮层：随滚动切换 fixed，并保持独立滚动区域。 */
  position: fixed;
  width: 19%;
  margin-left: 0%;
  display: flex;
  /* 初始态就固定在导航下方，避免正文左侧被重复留白。 */
  top: 10vh;
  bottom: 0;
  border: 1px solid var(--color-border-primary);
  padding: 3vh;
  background-color: var(--color-bg-surface);
  overflow-y: scroll;
}

.info_index.outter {
  /* 滚动超过阈值后吸顶，避免侧栏离开可视区。 */
  position: fixed;
  top: 0;
}

.info {
  background-color: var(--color-bg-surface);
  width: 100%;
  /* height: 30vh; */
  padding: 2vh;
  font-size: 0.9rem;
  border-radius: 1vh;
  border: 1px solid var(--color-border-primary);
}

.info:hover {
  box-shadow: 0vh 0vh 1vh rgb(163, 163, 163);
}

.index {
  background-color: var(--color-bg-surface);
  width: 100%;
  /* height: 30vh; */
  margin-top: 3vh;
  padding: 2vh;
  font-size: 0.9rem;
  border-radius: 1vh;
  border: 1px solid var(--color-border-primary);
}

.index:hover {
  box-shadow: 0vh 0vh 1vh rgb(143, 143, 143);
}

/* 文章主体样式 */
.body {
  width: 60%;
  margin-left: 20%;
  margin-top: 2vh;

  color: black;
  background-color: var(--color-bg-surface);
  border-radius: 1vh;
  border: 1px solid var(--color-border-primary);
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
  /* 右侧目录容器：固定在页面右侧，和正文保持视觉分离。 */
  /* overflow: auto; */
  position: fixed;
  right: 1%;
  margin-left: 0;
  margin-top: 2vh;
  background-color: var(--color-bg-muted); 
  overflow: hidden;
  width: 18%;
  min-height: 10vh;
  max-height: calc(100vh - 12vh);
  box-sizing: border-box;
  border-radius: 1vh;
  border: 1px solid var(--color-border-primary);
}

.catalog.outter {
  /* 页面下滚后目录维持更贴顶的吸附位置。 */
  top: 2vh;
  max-height: calc(100vh - 4vh);
}

.catalog_content {
  /* 目录内容区单独滚动，防止长目录把整块容器撑高。 */
  /* background-color: #e7f3ff; */
  /* background-color: #ffffff; */
  overflow-y: auto;
  max-height: calc(100vh - 22vh);
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
  /* 当前分类里的文章条目：常态使用低对比背景与中性文字。 */
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
  border: 1px solid var(--color-border-primary);
}

.item_current_add {
  /* 命中当前文章时的高亮态，和 hover 视觉保持一致。 */
  color: var(--interactive-text-active);
  font-weight: 550;
  border: 1px solid var(--color-border-primary);
}

/* 文章标题样式 */
.title {
  margin-top: 3vh;
  font-weight: 550;
  font-size: 1.3rem;
  color: var(--text-color-primary);
  text-align: center;
}

.meta-line {
  /* 标题下方元信息（发布时间/分类）统一右对齐展示。 */
  margin-top: 0.5vh;
  display: flex;
  justify-content: flex-end;
  gap: 1.5vh;
  color: var(--text-color-secondary);
  font-size: 0.85rem;
  padding: 0 clamp(12px, 2vw, 24px);
}

.meta-item {
  /* 元信息单项不换行，避免时间/分类被截断换行。 */
  white-space: nowrap;
}

.prev-next-wrap {
  /* 上一篇/下一篇容器：统一改为主题变量驱动，避免内联样式硬编码颜色。 */
  display: flex;
  flex-direction: column;
  height: 20vh;
  padding: 3vh;
}

.prev-next-item {
  /* 上下篇卡片条目：统一边框与背景，兼容 light/dark 主题。 */
  display: flex;
  align-items: center;
  margin-top: 0;
  font-size: 16px;
  background-color: var(--color-bg-muted);
  color: var(--text-color-primary);
  padding: 1vh;
  border: 1px solid var(--color-border-primary);
}

.catalog-head {
  /* 目录标题色使用次级文字变量，夜间模式可自动降亮度。 */
  font-size: 2.8vh;
  margin-top: 1vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-color-secondary);
}

.catalog-body {
  /* 目录主体内层：提供稳定留白，避免标题贴边。 */
  background-color: var(--color-bg-surface);
  padding: 2vh;
}

.catalog-link {
  /* 目录条目默认使用可点击文字常态色，激活态在 JS 中动态覆盖。 */
  cursor: pointer;
  height: 4vh;
  font-size: 0.9rem;
  color: var(--interactive-text-rest);
}

.catalog-empty {
  /* 无目录时的占位文案，弱化显示避免喧宾夺主。 */
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  text-align: center;
  padding: 2vh 0;
}

.sider {
  /* 目录活动指示条轨道。 */
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
  /* 目录活动指示条滑块。 */
  display: flex;
  width: 100%;
  height: 4vh;
  line-height: 2;
  background: rgb(166, 166, 166);
  transition: all 0.1s;
}

/*
  Markdown 正文内部元素主题适配：
  仅切容器底色不够，表格/代码块/引用块仍会沿用默认浅色方案，
  在暗色模式下会出现发灰、发糊的问题。这里统一改为变量驱动。
*/
.body /deep/ .v-md-editor-preview,
.body /deep/ .markdown-body {
  color: var(--text-color-primary);
}

.body /deep/ .markdown-body a {
  color: var(--interactive-text-rest);
}

.body /deep/ .markdown-body a:hover {
  color: var(--interactive-text-active);
}

/* 表格在深浅主题下都使用统一边框和表头底色，提高可读性。 */
.body /deep/ .markdown-body table,
.body /deep/ .markdown-body th,
.body /deep/ .markdown-body td {
  border-color: var(--color-border-primary) !important;
}

/* 同步覆盖 v-md-preview 的表格节点，兼容 Markdown Extra 渲染结构。 */
.body /deep/ .v-md-editor-preview table,
.body /deep/ .v-md-editor-preview table th,
.body /deep/ .v-md-editor-preview table td {
  border-color: var(--color-border-primary) !important;
}

.body /deep/ .markdown-body table {
  background-color: transparent !important;
}

/* Markdown Extra 生成的表格同样是 table/tr/td 结构，行级背景也要统一覆盖。 */
.body /deep/ .markdown-body table tr {
  background-color: var(--color-bg-surface) !important;
  border-top-color: var(--color-border-primary) !important;
}

.body /deep/ .markdown-body table tr:nth-child(2n) {
  background-color: var(--color-bg-muted) !important;
}

.body /deep/ .v-md-editor-preview table tr {
  background-color: var(--color-bg-surface) !important;
  border-top-color: var(--color-border-primary) !important;
}

.body /deep/ .v-md-editor-preview table tr:nth-child(2n) {
  background-color: var(--color-bg-muted) !important;
}

.body /deep/ .markdown-body th {
  background-color: var(--color-bg-muted) !important;
  color: var(--text-color-primary);
}

.body /deep/ .markdown-body td {
  background-color: var(--color-bg-surface) !important;
  color: var(--text-color-primary);
}

/* 暗色模式下再做一层强覆盖，压过 github-markdown.css 里的浅色行背景。 */
html[data-theme="dark"] .body /deep/ .markdown-body table tr,
html[data-theme="dark"] .body /deep/ .markdown-body table td {
  background-color: var(--color-bg-surface) !important;
  color: var(--text-color-primary) !important;
}

html[data-theme="dark"] .body /deep/ .markdown-body table tr:nth-child(2n),
html[data-theme="dark"] .body /deep/ .markdown-body table th {
  background-color: var(--color-bg-muted) !important;
}

/* 暗色模式下对 v-md 预览表格进行更高对比覆盖，避免“发灰发糊”。 */
html[data-theme="dark"] .body /deep/ .v-md-editor-preview table,
html[data-theme="dark"] .body /deep/ .v-md-editor-preview table tr,
html[data-theme="dark"] .body /deep/ .v-md-editor-preview table td,
html[data-theme="dark"] .body /deep/ .v-md-editor-preview table th {
  color: #e6edf3 !important;
  border-color: #3a4553 !important;
  text-shadow: none !important;
  filter: none !important;
  opacity: 1 !important;
}

html[data-theme="dark"] .body /deep/ .v-md-editor-preview table tr,
html[data-theme="dark"] .body /deep/ .v-md-editor-preview table td {
  background-color: #111821 !important;
}

html[data-theme="dark"] .body /deep/ .v-md-editor-preview table tr:nth-child(2n),
html[data-theme="dark"] .body /deep/ .v-md-editor-preview table th {
  background-color: #182230 !important;
}

/* 代码块与行内代码在暗色主题下避免白底和低对比文字。 */
.body /deep/ .markdown-body pre,
.body /deep/ .v-md-editor-preview pre {
  background-color: var(--color-bg-page) !important;
  border: 1px solid var(--color-border-primary);
}

.body /deep/ .markdown-body pre code,
.body /deep/ .v-md-editor-preview pre code {
  color: var(--text-color-primary) !important;
}

.body /deep/ .markdown-body :not(pre) > code {
  background-color: var(--color-bg-muted) !important;
  border: 1px solid var(--color-border-primary);
  color: var(--text-color-primary) !important;
}

/* 引用块与分隔线改成主题变量，避免暗色下边界模糊。 */
.body /deep/ .markdown-body blockquote {
  background-color: var(--color-bg-muted) !important;
  border-left: 4px solid var(--color-border-primary) !important;
  color: var(--text-color-secondary) !important;
}

.body /deep/ .markdown-body hr {
  border-color: var(--color-border-primary) !important;
}

/* 详情页中小屏抽屉模式：正文优先，左右栏改为浮层。 */
@media (max-width: 1200px) {
  .markdown-layout {
    /* 小屏切换为单列，正文占满可视宽度。 */
    display: block;
    padding: 0 10px;
  }

  .body {
    /* 正文容器与抽屉解耦，避免被侧栏挤压。 */
    width: 100%;
    margin-left: 0;
    margin-top: 6px;
  }

  .drawer-handle {
    /* 左右抽屉触发按钮固定在屏幕边缘。 */
    display: inline-flex;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1201;
    border: none;
    border-radius: 14px;
    padding: 10px 8px;
    color: #ffffff;
    background: rgba(33, 37, 41, 0.76);
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 12px;
    letter-spacing: 1px;
    cursor: pointer;
  }

  .drawer-handle-left {
    /* 左侧“同类”抽屉触发按钮位置。 */
    left: 6px;
  }

  .drawer-handle-right {
    /* 右侧“目录”抽屉触发按钮位置。 */
    right: 6px;
  }

  .drawer-mask {
    /* 抽屉开启时的背景遮罩层。 */
    display: block;
    position: fixed;
    inset: 0;
    z-index: 1198;
    background: rgba(15, 23, 42, 0.32);
    backdrop-filter: blur(2px);
  }

  .info_index,
  .info_index.outter,
  .catalog,
  .catalog.outter {
    /* 左右侧栏统一为 fixed 浮层，避免跟随正文滚动。 */
    position: fixed !important;
    /* 抽屉高度 = 全屏减去导航栏，再留一点空隙。 */
    top: calc(var(--mobile-nav-height, 80px) + 12px);
    bottom: 0;
    margin: 0;
    width: 70vw;
    max-width: 320px;
    max-width: min(84vw, 320px);
    max-height: calc(100vh - (var(--mobile-nav-height, 80px) + 12px));
    z-index: 1200;
    overflow-y: auto;
    box-sizing: border-box;
    transition: transform 0.24s ease;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  }

  .info_index,
  .info_index.outter {
    left: 0;
    /* 左抽屉默认收起。 */
    transform: translateX(-104%);
    padding: 12px;
  }

  .catalog,
  .catalog.outter {
    right: 0;
    /* 右抽屉默认收起。 */
    transform: translateX(104%);
    margin-top: 0;
  }

  .info_index.drawer-open,
  .catalog.drawer-open {
    /* 激活状态滑入屏幕。 */
    transform: translateX(0);
  }

  .catalog-body {
    /* 小屏目录内边距收紧，增加可视条目数。 */
    padding: 10px;
  }

  .catalog_content {
    /* 抽屉模式下取消固定高度，使用容器自然滚动。 */
    max-height: none;
  }
}
</style>