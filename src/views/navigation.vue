<template>
   <div class="navigation">
      <img src="../assets/caveman.jpg" class="img" />
      <div class="brand-title">时髦的山顶洞人</div>

      <div class="nav-actions">
         <!-- 首页高亮由当前路由控制，避免手动状态和路由不同步。 -->
         <div :class="{ 'nav-home-active': isHomeActive }" class="nav-item nav-home" @click="jumpHome">
            首页
         </div>

         <!-- 关于页固定跳转到指定文章详情。 -->
         <div :class="{ 'nav-home-active': isAboutActive }" class="nav-item nav-home" @click="jumpAbout">
            关于
         </div>

         <!-- 友链高亮同样由当前路由控制，进入友链页后文字置黑。 -->
         <div :class="{ 'nav-home-active': isFriendsActive }" class="nav-item nav-home" @click="jumpFriends">
            友链
         </div>

         <!-- 日夜开关：容器和滑块都根据 isNight 切换对应样式。 -->
         <div :class="{ 'theme-toggle-night': isNight }" class="theme-toggle" @click="toggleTheme">
            <span class="toggle-icon toggle-sun">☀</span>
            <span class="toggle-icon toggle-moon">☾</span>
            <!-- 滑块根据 isNight 切换位置 ：-->
            <span :class="{ 'toggle-knob-night': isNight }" class="toggle-knob"></span>
         </div>
      </div>
   </div>
</template>

<script>
import { applyTheme } from "../tools/theme";

export default {
   name: "navigationComponent",
   data() {
      return {
         isNight: false,
      }
   },
   computed: {
      isHomeActive() {
         // 根据当前路由判断首页是否处于选中状态，避免手动维护状态和路由不同步。
         return this.$route.name === "articles";
      },
      isFriendsActive() {
         // 友链导航的激活态：仅在 friendsComponent 路由下显示高亮。
         return this.$route.name === "friendsComponent";
      },
      isAboutActive() {
         return this.$route.name === "articleViewComponent"
            && String(this.$route.params.id) === "114"
            && String(this.$route.params.name) === "blogger";
      }
   },
   methods: {
      jumpHome() {
         // 只负责跳首页，激活态由 computed 中的路由判断自动更新。
         this.$router.push({
            name: "articles",
         });
      },
      jumpFriends() {
         this.$router.push({
            name: "friendsComponent",
         });
      },
      jumpAbout() {
         this.$router.push({
            name: "articleViewComponent",
            params: {
               id: "114",
               name: "blogger",
            },
         });
      },
      toggleTheme() {
         // 切换全局主题：同步更新 html[data-theme] 和本地存储。
         const nextTheme = this.isNight ? "light" : "dark";
         applyTheme(nextTheme);
         this.isNight = nextTheme === "dark";
      }
   },
   mounted() {
      // 首次渲染时根据全局主题恢复开关状态。
      this.isNight = document.documentElement.getAttribute("data-theme") === "dark";
   }
};
</script>

<style lang="css" scoped>
@import url("https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap");

/* 顶部导航容器：采用 GitHub 风格浅灰底和底部分割线。 */
.navigation {
   display: flex;
   align-items: center;
   text-align: center;
   position: relative;
   background-color: var(--color-bg-nav);
   border-bottom: 1px solid var(--color-border-primary);
   height: 10vh;
   padding: 0 2%;
}

/* 品牌标题占据中间剩余空间，保证右侧操作区始终贴右。 */
.brand-title {
   margin-left: 2vh;
   flex: 1;
   color: var(--text-color-primary);
   /* 品牌标题使用手写/书法感字体，避免默认宋体观感。 */
   font-family: "Ma Shan Zheng", "STKaiti", "KaiTi", "YouYuan", "PingFang SC", cursive;
   font-size: 1.5rem;
   font-weight: 500;
   line-height: 1.4;
   letter-spacing: 0.08em;
   text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6), 0 2px 8px rgba(31, 35, 40, 0.08);
   text-align: left;
}

.img {
   width: 8vh;
   height: 8vh;
   border-radius: 50%;
}

.nav-actions {
   display: flex;
   align-items: center;
   justify-content: flex-end;
   gap: 3vh;
   height: 100%;
}

/* 首页文案基础态：中性灰。 */
.nav-item {
   display: flex;
   align-items: center;
   justify-content: center;
   height: 100%;
   cursor: pointer;
}

.nav-home {
   color: var(--interactive-text-rest);
   font-size: var(--font-size-xl);
   font-weight: var(--font-weight-medium);
   transition: color 0.2s ease;
}

.nav-home:hover {
   color: var(--interactive-text-active);
}

/* 首页激活态：更深文字色，突出当前页面。 */
.nav-home-active {
   color: var(--interactive-text-active);
   font-weight: var(--font-weight-medium);
}

/* 开关容器：胶囊外观，内含太阳/月亮和可移动滑块。 */
.theme-toggle {
   position: relative;
   width: 58px;
   height: 32px;
   border-radius: 999px;
   border: 1px solid var(--color-border-primary);
   background: linear-gradient(90deg, var(--color-bg-surface) 0%, var(--color-bg-nav) 50%, #eef2f6 100%);
   display: inline-flex;
   align-items: center;
   justify-content: space-between;
   padding: 0 8px;
   box-sizing: border-box;
   cursor: pointer;
   transition: background-color 0.2s ease, border-color 0.2s ease;
}

.theme-toggle-night {
   background: linear-gradient(90deg, #30363d 0%, #24292f 50%, #1f2328 100%);
}

/* 图标层保持在滑块之上，防止被遮挡。 */
.toggle-icon {
   font-size: 14px;
   line-height: 1;
   z-index: 1;
   user-select: none;
}

.toggle-sun {
   color: #24292f;
}

.toggle-moon {
   color: #57606a;
}

.theme-toggle-night .toggle-sun {
   color: #8b949e;
}

.theme-toggle-night .toggle-moon {
   color: #f0f6fc;
}

/* 滑块基础态：位于左侧，代表白天。 */
.toggle-knob {
   position: absolute;
   left: 3px;
   top: 3px;
   width: 24px;
   height: 24px;
   border-radius: 50%;
   background-color: #ffffff;
   border: 1px solid #d0d7de;
   box-shadow: 0 1px 2px rgba(31, 35, 40, 0.12);
   transition: transform 0.2s ease;
}

/* 夜间态滑块深色处理，和深色背景形成对比。 */
.theme-toggle-night .toggle-knob {
   background-color: #0d1117;
   border-color: #57606a;
}

.toggle-knob-night {
   /* 夜间态把滑块平移到右侧，形成开关切换感。 */
   transform: translateX(26px);
}
</style>