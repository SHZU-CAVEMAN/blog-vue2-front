<template>
   <div class="navigation">
      <div class="navigation-content">
         <!-- <img src="../assets/wangzhan.jpg" class="img" /> -->
         <div class="brand-title">
            <span class="brand-title-text" :style="brandTitleAnimationStyle">{{ brandTitle }}</span>
         </div>

         <div class="nav-actions">
            <!-- 桌面端导航项：移动端会折叠到下方抽屉面板。 -->
            <div class="nav-links-desktop">
            <!-- 首页高亮由当前路由控制，避免手动状态和路由不同步。 -->
            <div :class="{ 'nav-home-active': isHomeActive }" class="nav-item nav-home" @click="jumpHome">
               首页
            </div>

            <div
               class="category-menu"
               @mouseenter="categoryMenuOpen = true"
               @mouseleave="categoryMenuOpen = false"
            >
               <button
                  :class="{ 'nav-home-active': isCategoryActive }"
                  :aria-expanded="String(categoryMenuOpen)"
                  aria-haspopup="true"
                  class="nav-item nav-home category-menu-trigger"
                  type="button"
                  @click="toggleCategoryMenu"
               >
                  分类
               </button>

               <div v-if="categoryMenuOpen" class="category-menu-panel">
                  <button
                     v-for="item in categories"
                     :key="item.name"
                     :class="{ 'category-menu-item-active': currentCategoryName === item.name }"
                     class="category-menu-item"
                     type="button"
                     @click="jumpCategory(item.name)"
                  >
                     <span>{{ item.name }}</span>
                     <span v-if="item.number !== undefined" class="category-menu-count">{{ item.number }}</span>
                  </button>
                  <div v-if="!categories.length" class="category-menu-empty">暂无分类</div>
               </div>
            </div>

            <div :class="{ 'nav-home-active': isArchiveActive }" class="nav-item nav-home" @click="jumpArchive">
               归档
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

            <!-- 移动端控制区：折叠按钮与主题切换并排显示。 -->
            <div class="mobile-actions">
               <button class="mobile-nav-toggle" type="button" @click="toggleMobileNav">
                  <!-- 三横线汉堡图标：展开时切换为 X 形态。 -->
                  <span class="hamburger" :class="{ 'hamburger-open': mobileNavOpen }" aria-hidden="true">
                     <span></span>
                     <span></span>
                     <span></span>
                  </span>
               </button>

               <!-- 日夜开关：容器和滑块都根据 isNight 切换对应样式。 -->
               <div :class="{ 'theme-toggle-night': isNight }" class="theme-toggle" @click="toggleTheme">
                  <span class="toggle-icon toggle-sun">☀</span>
                  <span class="toggle-icon toggle-moon">☾</span>
                  <!-- 滑块根据 isNight 切换位置 ：-->
                  <span :class="{ 'toggle-knob-night': isNight }" class="toggle-knob"></span>
               </div>
            </div>
         </div>

         <!-- 移动端折叠导航：点击“菜单”后展开。 -->
         <div v-if="mobileNavOpen" class="mobile-nav-panel">
            <div :class="{ 'nav-home-active': isHomeActive }" class="mobile-nav-item" @click="jumpHome">
               首页
            </div>

            <div :class="{ 'nav-home-active': isArchiveActive }" class="mobile-nav-item" @click="jumpArchive">
               归档
            </div>

            <div class="mobile-category-group">
               <button
                  :class="{ 'nav-home-active': isCategoryActive }"
                  :aria-expanded="String(mobileCategoryOpen)"
                  class="mobile-nav-item mobile-category-label"
                  type="button"
                  @click="toggleMobileCategory"
               >
                  <span>分类</span>
                  <a-icon :type="mobileCategoryOpen ? 'up' : 'down'" />
               </button>
               <template v-if="mobileCategoryOpen">
                  <button
                     v-for="item in categories"
                     :key="item.name"
                     :class="{ 'mobile-nav-item-active': currentCategoryName === item.name }"
                     class="mobile-nav-item mobile-category-item"
                     type="button"
                     @click="jumpCategory(item.name)"
                  >
                     <span>{{ item.name }}</span>
                     <span v-if="item.number !== undefined">{{ item.number }}</span>
                  </button>
               </template>
            </div>

            <div :class="{ 'nav-home-active': isAboutActive }" class="mobile-nav-item" @click="jumpAbout">
               关于
            </div>

            <div :class="{ 'nav-home-active': isFriendsActive }" class="mobile-nav-item" @click="jumpFriends">
               友链
            </div>
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
         // 修改这里即可更换品牌名，打字动画会按实际字符数自动适配。
         brandTitle: "穴居人的空间",
         isNight: false,
         mobileNavOpen: false,
         mobileCategoryOpen: false,
         categoryMenuOpen: false,
      }
   },
   watch: {
      $route() {
         // 路由变化后自动收起移动端菜单，避免页面切换后面板残留。
         this.mobileNavOpen = false;
         this.mobileCategoryOpen = false;
         this.categoryMenuOpen = false;
      }
   },
   computed: {
      brandTitleAnimationStyle() {
         const characterCount = Math.max(Array.from(this.brandTitle).length, 1);

         return {
            "--brand-title-width": `${characterCount * 1.08}em`,
            "--brand-typing-steps": characterCount,
            "--brand-typing-duration": `${Math.max(0.6, characterCount * 0.3)}s`,
         };
      },
      categories() {
         const articles = this.$store.state.articleInfo.article || [];
         const counts = {};

         articles.forEach((article) => {
            const category = article && article.category;
            const name = typeof category === "string"
               ? category
               : category && (category.name || category.title);

            if (name) {
               counts[name] = (counts[name] || 0) + 1;
            }
         });

         return Object.keys(counts)
            .map((name) => ({ name, number: counts[name] }))
            .sort((first, second) => second.number - first.number);
      },
      currentCategoryName() {
         return this.$route.name === "articles" ? this.$route.query.category || "" : "";
      },
      isCategoryActive() {
         return this.$route.name === "articles" && Boolean(this.currentCategoryName);
      },
      isHomeActive() {
         // 根据当前路由判断首页是否处于选中状态，避免手动维护状态和路由不同步。
         return this.$route.name === "articles" && !this.currentCategoryName;
      },
      isArchiveActive() {
         return this.$route.name === "archive";
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
         this.mobileNavOpen = false;
      },
      jumpArchive() {
         this.$router.push({
            name: "archive",
         });
         this.mobileNavOpen = false;
      },
      jumpCategory(name) {
         this.$router.push({
            name: "articles",
            query: {
               category: name,
            },
         });
         this.mobileNavOpen = false;
         this.mobileCategoryOpen = false;
         this.categoryMenuOpen = false;
      },
      jumpFriends() {
         this.$router.push({
            name: "friendsComponent",
         });
         this.mobileNavOpen = false;
      },
      jumpAbout() {
         this.$router.push({
            name: "articleViewComponent",
            params: {
               id: "114",
               name: "小站简介",
            },
         });
         this.mobileNavOpen = false;
      },
      toggleMobileNav() {
         // 移动端导航折叠开关：控制悬浮面板的显示与隐藏。
         this.mobileNavOpen = !this.mobileNavOpen;
         if (!this.mobileNavOpen) {
            this.mobileCategoryOpen = false;
         }
      },
      toggleMobileCategory() {
         this.mobileCategoryOpen = !this.mobileCategoryOpen;
      },
      toggleCategoryMenu() {
         this.categoryMenuOpen = !this.categoryMenuOpen;
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

      // 小屏导航高度保持固定，抽屉只需要在这个值基础上留出一点空隙即可。
      document.documentElement.style.setProperty("--mobile-nav-height", "80px");
   },
};
</script>

<style lang="css" scoped>
/* 顶部导航容器：采用 GitHub 风格浅灰底和底部分割线。 */
.navigation {
   text-align: center;
   position: relative;
   background-color: var(--color-bg-nav);
   border-bottom: 1px solid var(--color-border-primary);
   height: 60px;
}

.navigation-content {
   display: flex;
   align-items: center;
   width: min(68%, 1280px);
   height: 100%;
   margin: 0 auto;
}

/* 品牌标题占据中间剩余空间，保证右侧操作区始终贴右。 */
.brand-title {
   display: flex;
   align-items: center;
   height: 100%;
   margin-left: 16px;
   flex: 1;
   color: var(--text-color-primary);
   font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
   font-size: 1.5rem;
   font-weight: 700;
   line-height: 1.4;
   letter-spacing: 0.08em;
   text-align: left;
}

.brand-title-text {
   display: inline-block;
   width: 0;
   overflow: hidden;
   border-right: 2px solid currentColor;
   letter-spacing: 0.08em;
   white-space: nowrap;
   animation: brand-typing var(--brand-typing-duration, 1.2s) steps(var(--brand-typing-steps, 3), end) 0.15s forwards,
      brand-caret var(--brand-typing-duration, 1.2s) step-end 0.15s forwards;
}

@keyframes brand-typing {
   from {
      width: 0;
   }
   to {
      width: var(--brand-title-width, 3.3em);
   }
}

@keyframes brand-caret {
   0%,
   24%,
   50%,
   74% {
      border-color: currentColor;
   }
   25%,
   49%,
   75%,
   100% {
      border-color: transparent;
   }
}

@media (prefers-reduced-motion: reduce) {
   .brand-title-text {
      width: auto;
      border-right: 0;
      animation: none;
   }
}

.img {
   width: 8vh;
   height: 8vh;
   /* border-radius: 50%; */
}

.nav-actions {
   display: flex;
   align-items: center;
   justify-content: flex-end;
   gap: 28px;
   height: 100%;
}

.nav-links-desktop {
   display: flex;
   align-items: center;
   gap: 28px;
   height: 100%;
}

.category-menu {
   position: relative;
   display: flex;
   align-items: center;
   height: 100%;
}

.category-menu-trigger {
   border: 0;
   padding: 0;
   background: transparent;
   font: inherit;
}

.category-menu-panel {
   position: absolute;
   top: calc(100% - 8px);
   left: 50%;
   z-index: 1500;
   display: flex;
   width: max-content;
   min-width: 140px;
   max-width: calc(100vw - 32px);
   max-height: min(420px, calc(100vh - 100px));
   padding: 6px;
   overflow-y: auto;
   border: 1px solid var(--color-border-primary);
   border-radius: 8px;
   background: var(--color-bg-surface);
   box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
   box-sizing: border-box;
   flex-direction: column;
   gap: 2px;
   transform: translateX(-50%);
}

.category-menu-item {
   display: flex;
   align-items: center;
   justify-content: space-between;
   width: 100%;
   border: 0;
   border-radius: 6px;
   padding: 2px;
   background: transparent;
   color: var(--interactive-text-rest);
   cursor: pointer;
   font-family: var(--font-family-sans);
   font-size: var(--font-size-md);
   font-weight: var(--font-weight-medium);
   text-align: left;
}

.category-menu-item:hover,
.category-menu-item-active {
   background: var(--color-bg-muted);
   color: var(--interactive-text-active);
}

.category-menu-count {
   color: var(--text-color-secondary);
   font-size: inherit;
   font-weight: inherit;
}

.category-menu-empty {
   padding: 8px;
   color: var(--text-color-secondary);
   font-family: var(--font-family-sans);
   font-size: var(--font-size-xl);
   text-align: left;
}

/* 移动端控制区默认隐藏：仅在小屏展示。 */
.mobile-actions {
   display: none;
}

/* 移动端折叠菜单默认隐藏。 */
.mobile-nav-panel {
   display: none;
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

/* 手机导航：允许换行，提升触控区域，避免标题与操作区挤压。 */
@media (max-width: 768px) {
   .navigation {
      /* 小屏滚动时吸顶，保持导航和主题开关始终可见。 */
      position: sticky;
      top: 0;
      z-index: 1600;
      height: auto;
      min-height: 64px;
      padding: 8px 12px;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
   }

   .navigation-content {
      position: relative;
      width: 100%;
      min-height: 48px;
      flex-wrap: wrap;
      row-gap: 8px;
   }

   .img {
      width: 40px;
      height: 40px;
   }

   .brand-title {
      margin-left: 10px;
      font-size: 1.25rem;
      letter-spacing: 0.04em;
      min-width: 0;
   }

   .nav-actions {
      width: auto;
      justify-content: flex-end;
      height: auto;
      gap: 0;
   }

   .nav-links-desktop {
      display: none;
   }

   .mobile-actions {
      display: inline-flex;
      align-items: center;
      gap: 10px;
   }

   .mobile-nav-toggle {
      /* 汉堡按钮本体：固定尺寸，和主题开关并排显示。 */
      border: 1px solid var(--color-border-primary);
      border-radius: 999px;
      background: var(--color-bg-surface);
      color: var(--text-color-primary);
      width: 42px;
      min-height: 32px;
      line-height: 1;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
   }

   .hamburger {
      /* 三横线图标容器：纵向排列 3 条线。 */
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;
      width: 16px;
   }

   .hamburger span {
      /* 单条横线：通过展开态旋转/隐藏形成关闭图标。 */
      width: 100%;
      height: 2px;
      background: var(--text-color-primary);
      border-radius: 2px;
      transition: transform 0.2s ease, opacity 0.2s ease;
   }

   .hamburger-open span:nth-child(1) {
      /* 第一条线下移并旋转。 */
      transform: translateY(6px) rotate(45deg);
   }

   .hamburger-open span:nth-child(2) {
      /* 中间线隐藏。 */
      opacity: 0;
   }

   .hamburger-open span:nth-child(3) {
      /* 第三条线上移并反向旋转。 */
      transform: translateY(-6px) rotate(-45deg);
   }

   .mobile-nav-panel {
      /* 折叠面板绝对定位悬浮在导航下方，不挤压页面正文。 */
      display: flex;
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      width: min(220px, calc(100% - 24px));
      padding: 8px;
      border: 1px solid var(--color-border-primary);
      border-radius: 10px;
      background: var(--color-bg-surface);
      flex-direction: column;
      gap: 6px;
      box-sizing: border-box;
      z-index: 1500;
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
   }

   .mobile-nav-item {
      color: var(--interactive-text-rest);
      font-size: 0.95rem;
      font-weight: var(--font-weight-medium);
      padding: 6px 8px;
      border-radius: 8px;
      cursor: pointer;
      text-align: left;
   }

   .mobile-nav-item:hover {
      color: var(--interactive-text-active);
      background: var(--color-bg-muted);
   }

   .mobile-nav-item.nav-home-active {
      color: var(--interactive-text-active);
      background: var(--color-bg-muted);
   }

   .mobile-category-group {
      display: flex;
      padding: 4px 0;
      border-top: 1px solid var(--color-border-primary);
      border-bottom: 1px solid var(--color-border-primary);
      flex-direction: column;
      gap: 2px;
   }

   .mobile-category-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      border: 0;
      background: transparent;
      color: var(--interactive-text-rest);
      text-align: left;
   }

   .mobile-category-item {
      display: flex;
      justify-content: space-between;
      width: 100%;
      border: 0;
      background: transparent;
      font: inherit;
   }

   .mobile-category-item.mobile-nav-item-active {
      color: var(--interactive-text-active);
      background: var(--color-bg-muted);
   }
}

/* 超小屏进一步压缩控件尺寸，防止一行溢出。 */
@media (max-width: 420px) {
   .brand-title {
      font-size: 1.1rem;
   }

   .nav-actions {
      gap: 8px;
   }

   .theme-toggle {
      width: 52px;
      height: 30px;
      padding: 0 7px;
   }

   .toggle-knob {
      width: 22px;
      height: 22px;
   }

   .toggle-knob-night {
      transform: translateX(22px);
   }
}
</style>