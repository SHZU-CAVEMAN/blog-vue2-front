<template>
  <div id="home" @touchstart.passive="handleTouchStart" @touchend.passive="handleTouchEnd">
    <!-- 移动端两侧抽屉入口：左分类，右公告/博主信息。 -->
    <button class="drawer-handle drawer-handle-left" @click="openLeftDrawer">分类</button>
    <button class="drawer-handle drawer-handle-right" @click="openRightDrawer">公告</button>
    <!-- 抽屉态遮罩：点击关闭。 -->
    <div v-if="isAnyDrawerOpen" class="drawer-mask" @click="closeDrawers"></div>

    <div class="home-layout">
      <!-- 左侧：分类汇总-->
      <left :articleInfo="articleInfo" class="sidebar left-side" :class="{ 'drawer-open': isLeftDrawerOpen }" />

      <!-- 中间主体：articles和 onFile 两个组件接收 articleInfo数据 -->
      <keep-alive>
        <router-view :articleInfo="articleInfo" class="main-content"></router-view>
      </keep-alive>

      <!-- 右侧：公告信息和博主卡片 -->
      <right class="sidebar right-side" :class="{ 'drawer-open': isRightDrawerOpen }" />
    </div>

  </div>
</template>

<script>
import right from './right.vue';
import left from './left.vue';
export default {
  name: "homeComponent",
  components: { 
    left,
    right,
  },
  data() {
    return {
      // time:new Date().getTime(),
      // articleInfo: [],
      cateNameFlag: '',
      // 左抽屉（分类）开关状态。
      isLeftDrawerOpen: false,
      // 右抽屉（公告/博主）开关状态。
      isRightDrawerOpen: false,
      // 手势起点坐标，用于判定横向滑动方向和距离。
      touchStartX: 0,
      touchStartY: 0,
    }
  },
  computed: {
    articleInfo: {
      get() {
        // 文章列表统一从 Vuex 获取，避免重复存储与双数据源不一致。
        return this.$store.state.articleInfo.article || [];
      }
    },
    isAnyDrawerOpen() {
      // 任一抽屉打开都视为抽屉态。
      return this.isLeftDrawerOpen || this.isRightDrawerOpen;
    }
  },
  watch: {
    isAnyDrawerOpen(next) {
      // 移动端抽屉打开时锁定页面滚动，避免背景跟随滑动。
      if (typeof document !== 'undefined') {
        document.body.style.overflow = next ? 'hidden' : '';
      }
    },
    $route() {
      this.closeDrawers();
    }
  },
  methods: {
    // ...mapActions(["setArticleInfo",]),
    EventHandler(name) {
      //console.log("home组件", name);
      this.cateNameFlag = name;
      //点击了分类,则 cateNameFlag不为空,则显示ArticleListCate组件
      //否则显示 ArticleListNew组件
    },
    getIP() {
      //1 查询ip地址
      const request = new XMLHttpRequest();
      request.open('GET', 'http://api.ipify.org/?format=json', true);

      request.onload = () => {//使用箭头函数
        if (this.status === 200) {
          const json = JSON.parse(this.responseText);
          const ip = json.ip;

          //2 根据ip地址查询地址
          const xhr = new XMLHttpRequest();
          xhr.open('GET', 'http://ip-api.com/json/' + ip, true);

          xhr.onload = () => {//这里要改成箭头函数，使this指向vc实例。
            if (this.status === 200) {
              const result = JSON.parse(this.responseText);
              console.log(result);
              //以下的this不是vc实例了，而是xhr对象。
              // console.log(this);
              this.$store.dispatch("setIp", result);//因此此处会报错
              console.log('IP地址,国家,地区名', this.$store.state.user.ip,result.country, result.regionName);
            }
          }
          xhr.send();
        }
      };

      request.send();
    },
    openLeftDrawer() {
      // 同时只允许一个抽屉打开。
      this.isRightDrawerOpen = false;
      this.isLeftDrawerOpen = true;
    },
    openRightDrawer() {
      // 同时只允许一个抽屉打开。
      this.isLeftDrawerOpen = false;
      this.isRightDrawerOpen = true;
    },
    closeDrawers() {
      // 统一关闭入口：遮罩、路由变化、手势都复用。
      this.isLeftDrawerOpen = false;
      this.isRightDrawerOpen = false;
    },
    isMobileDrawerMode() {
      // 抽屉交互仅在中小屏启用。
      return typeof window !== 'undefined' && window.innerWidth <= 1200;
    },
    handleTouchStart(event) {
      if (!this.isMobileDrawerMode() || !event.touches || !event.touches.length) {
        return;
      }

      // 记录手势起点。
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

      // 只处理明显的横向手势，避免干扰正常纵向滚动。
      if (absX < 52 || absY > absX) {
        return;
      }

      const width = window.innerWidth || 0;
      // 边缘触发区：只有从屏幕边缘起滑才尝试打开抽屉。
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

      // 左抽屉打开时，向左滑关闭。
      if (this.isLeftDrawerOpen && deltaX < 0) {
        this.closeDrawers();
        return;
      }

      // 右抽屉打开时，向右滑关闭。
      if (this.isRightDrawerOpen && deltaX > 0) {
        this.closeDrawers();
      }
    }
  },
  created() {
    //使用原生fetch获取ip
    // fetch('https://api.ipify.org?format=json')
    //   .then(response => response.json())
    //   .then(data => console.log('哈哈哈哈哈哈哈哈哈哈啊哈哈',data));

    // 使用原生xhr获取ip
    // this.getIP();

    // 在这里请求articleInfo的数据，并存放在store中。
    // home组件是父组件，articleList组件是子组件。
    // 异步请求的结果在父组件的 beforeUpdate阶段可以获取，
    // 算了。
    // this.$bus.$on("cateEvent", this.EventHandler);
  },
  beforeDestroy() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
};
</script>

<style>
#home {
  background-color: var(--color-bg-page);
}

.home-layout {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2%;
  width: 100%;
  box-sizing: border-box;
  padding: 0 2% 0 0;
}

.sidebar {
  flex: 0 0 20%;
  max-width: 20%;
}

.main-content {
  flex: 1 1 auto;
  min-width: 0;
}

.one {
  width: 20%;
  /* background-color: rgb(255, 255, 255); */

}

/* 默认隐藏移动端抽屉入口与遮罩，仅在断点内启用。 */
.drawer-handle,
.drawer-mask {
  display: none;
}

/* 首页在中小屏切换为“主内容 + 两侧抽屉”模式。 */
@media (max-width: 1200px) {
  .home-layout {
    display: flex;
    flex-direction: column;
    padding: 0 12px;
  }

  .main-content {
    order: 1;
    width: 100%;
    min-width: 0;
    position: relative;
    z-index: 1;
    margin-top: 0;
  }

  .main-content .articles {
    /* 清掉文章列表额外顶部间距，保证首屏直接看到卡片。 */
    margin-top: 0 !important;
  }

  .drawer-handle {
    /* 抽屉触发按钮固定在屏幕两侧中线位置。 */
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
    /* 左抽屉按钮停靠左边缘。 */
    left: 6px;
  }

  .drawer-handle-right {
    /* 右抽屉按钮停靠右边缘。 */
    right: 6px;
  }

  .drawer-mask {
    /* 抽屉打开时使用全屏遮罩，点击可关闭。 */
    display: block;
    position: fixed;
    inset: 0;
    z-index: 1198;
    background: rgba(15, 23, 42, 0.32);
    backdrop-filter: blur(2px);
  }

  .left-side,
  .right-side {
    /* 两侧栏变为固定浮层抽屉，不参与主内容文档流。 */
    position: fixed !important;
    /* 抽屉高度 = 全屏减去导航栏，再留一点空隙。 */
    top: calc(var(--mobile-nav-height, 80px) + 12px);
    /* 用显式高度锁定到底部，避免 top/bottom/max-height 叠加导致底部悬空。 */
    height: calc(100vh - (var(--mobile-nav-height, 80px) + 12px));
    width: min(84vw, 320px);
    max-width: min(84vw, 320px);
    z-index: 1200;
    margin: 0;
    bottom: 0;
    overflow-y: auto;
    transition: transform 0.24s ease;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    background: var(--color-bg-surface);
    padding-top: 8px;
  }

  /* 抽屉模式下覆盖左右栏组件内部 sticky，避免出现“悬浮”和顶部大空白。 */
  .left-side .left,
  .left-side .outter,
  .right-side .one,
  .right-side .outter {
    position: static !important;
    top: auto !important;
    bottom: auto !important;
    height: auto !important;
  }

  .left-side .left {
    /* 左侧分类内部允许独立滚动。 */
    overflow-y: auto;
    max-height: 100%;
  }

  .right-side .notice,
  .right-side .blogger-intro {
    /* 右抽屉内部卡片统一留白，避免贴边。 */
    margin: 10px 12px !important;
  }

  .left-side {
    order: 2;
    left: 0;
    /* 初始隐藏在屏幕左侧外。 */
    transform: translateX(-104%);
  }

  .right-side {
    order: 3;
    right: 0;
    /* 初始隐藏在屏幕右侧外。 */
    transform: translateX(104%);
  }

  .left-side.drawer-open,
  .right-side.drawer-open {
    /* 打开抽屉时滑入可视区。 */
    transform: translateX(0);
  }
}

@media (max-width: 576px) {
  .home-layout {
    /* 超小屏继续压缩容器左右留白。 */
    padding: 0 8px;
  }

  .main-content {
    /* 轻微上移主内容，减少导航下方视觉空隙。 */
    margin-top: 4px;
  }
}
</style>