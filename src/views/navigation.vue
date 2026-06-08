<template>
   <div class="navigation">
      <img src="../assets/caveman.jpg" class="img" />
      <div class="brand-title">李奥's 博客</div>

      <div class="nav-actions">
         <!-- 首页高亮由当前路由控制，避免手动状态和路由不同步。 -->
         <div :class="{ 'nav-home-active': isHomeActive }" class="nav-item nav-home" @click="jumpHome">
            首页
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
      toggleTheme() {
         // 开关状态反转后，背景色和滑块位置会同步切换。
         this.isNight = !this.isNight;
      }
   }
};
</script>

<style lang="css" scoped>
/* 顶部导航容器：采用 GitHub 风格浅灰底和底部分割线。 */
.navigation {
   display: flex;
   align-items: center;
   text-align: center;
   position: relative;
   background-color: #f6f8fa;
   border-bottom: 1px solid #d0d7de;
   height: 10vh;
   padding: 0 2%;
}

/* 品牌标题占据中间剩余空间，保证右侧操作区始终贴右。 */
.brand-title {
   margin-left: 2vh;
   flex: 1;
   color: #24292f;
   font-family: var(--font-family-brand);
   font-size: var(--font-size-xl);
   font-weight: var(--font-weight-medium);
   line-height: 1.4;
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
   border: 1px solid #d0d7de;
   background: linear-gradient(90deg, #ffffff 0%, #f6f8fa 50%, #eef2f6 100%);
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