<template>
  <div id="home">
    <div class="home-layout">
      <!-- 主体：articles 和 onFile 两个组件接收 articleInfo 数据。 -->
      <keep-alive>
        <router-view :articleInfo="articleInfo" class="main-content"></router-view>
      </keep-alive>
    </div>

  </div>
</template>

<script>
export default {
  name: "homeComponent",
  data() {
    return {
      // time:new Date().getTime(),
      // articleInfo: [],
      cateNameFlag: '',
    }
  },
  computed: {
    articleInfo: {
      get() {
        // 文章列表统一从 Vuex 获取，避免重复存储与双数据源不一致。
        return this.$store.state.articleInfo.article || [];
      }
    }
  },
  methods: {
    // ...mapActions(["setArticleInfo",]),
    EventHandler(name) {
      this.cateNameFlag = name;
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
  },
};
</script>

<style>
#home {
  background-color: var(--color-bg-page);
}
 
.home-layout {
  display: flex;
  margin-top: 0;
  justify-content: center;
}

.left-panel::-webkit-scrollbar {
  width: 0 !important;
}

.left-panel {
  background-color: var(--color-bg-surface);
  height: calc(100vh - 10vh);
  box-sizing: border-box;
  bottom: 0;
  border: 1px solid var(--color-border-primary);
  position: fixed;
  width: 19%;
  left: 0;
  top: 10vh;
  overflow-y: scroll;
}

.right-panel {
  position: fixed;
  right: 0;
  margin-top: 2vh;
  width: 20%;
  min-height: 10vh;
  max-height: calc(100vh - 12vh);
  box-sizing: border-box;
  overflow: hidden;
  padding: 0 1%;

}

.main-content {
  width: min(62%, 1100px);
  margin-top: 2vh;
  min-width: 0;
}

/* 文章详情自带三栏网格，不受首页文章列表版心限制。 */
.main-content.article-detail-view {
  width: 100%;
  max-width: none;
  margin-top: 0;
}

/* 仅限桌面端，侧栏切换到 outter 吸顶态。 移动端不能吸顶，否则会被导航栏遮挡*/
@media (min-width: 1201px) {
  .left-panel.outter {
    top: 0;
    height: 100vh;
  }

  .right-panel.outter {
    top: 2vh;
    max-height: calc(100vh - 4vh);
  }
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
    margin-top: 2vh;
    margin-left: 0;
    margin-right: 0;
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

  .left-panel,
  .right-panel {
    /* 两侧栏变为固定浮层抽屉，不参与主内容文档流。 */
    position: fixed !important;
    /* 抽屉高度 = 全屏减去导航栏，再留一点空隙。 */
    top: calc(var(--mobile-nav-height, 80px) + 12px);
    /* 用显式高度锁定到底部，避免 top/bottom/max-height 叠加导致底部悬空。 */
    height: calc(100vh - (var(--mobile-nav-height, 80px) + 12px));
    width: 70vw;
    max-width: 320px;
    z-index: 1200;
    margin: 0;
    bottom: 0;
    overflow-y: auto;
    transition: transform 0.24s ease;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    background: var(--color-bg-surface);
    padding-top: 8px;
  }

  .left-panel {
    /* 左抽屉默认从左侧屏外滑入。 */
    left: 0;
    transform: translateX(-104%);
  }

  .right-panel {
    /* 右抽屉默认从右侧屏外滑入。 */
    right: 0;
    transform: translateX(104%);
  }

  .left-panel.drawer-open,
  .right-panel.drawer-open {
    /* 打开时直接滑入可视区。 */
    transform: translateX(0);
  }

}


</style>