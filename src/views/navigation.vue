<template>
   <div class="navigation">
      <img src="../assets/caveman.jpg" class="img" />
      <div class="brand-title">李奥's 博客</div>

      <div class="nav-actions">
         <div :class="{ 'nav-home-active': isHomeActive }" class="nav-item nav-home" @click="jumpHome">
            首页
         </div>

         <div class="bulb nav-item" @click="toggleTheme">
            <a-icon ref="bulb_icon" type="bulb" :theme="theme" />
         </div>
      </div>
   </div>
</template>

<script>
export default {
   name: "navigationComponent",
   data() {
      return {
         theme: '',
      }
   },
   computed: {
      isHomeActive() {
         // 根据当前路由判断首页是否处于选中状态，避免手动维护状态和路由不同步。
         return this.$route.name === "articles";
      }
   },
   methods: {
      jumpHome() {
         this.$router.push({
            name: "articles",
         });
      },
      toggleTheme() {
         //不用$res来操作dom，直接用响应式变量：
         if (this.theme == "") {
            this.theme = "filled";
         } else {
            this.theme = '';
         }
      }
   }
};
</script>

<style lang="css" scoped>
.navigation {
   display: flex;
   align-items: center;
   text-align: center;
   position: relative;
   background-color: #ffffff;
   height: 10vh;
   padding: 0 2%;
}

.brand-title {
   margin-left: 2vh;
   flex: 1;
   color: rgb(0, 0, 0);
   font-family: var(--font-family-brand);
   font-size: var(--font-size-xxl);
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

.nav-item {
   display: flex;
   align-items: center;
   justify-content: center;
   height: 100%;
   cursor: pointer;
}

.nav-home {
   color: rgb(123, 123, 123);
   font-size: var(--font-size-xl);
   font-weight: var(--font-weight-medium);
   transition: color 0.2s ease;
}

.nav-home:hover {
   color: rgb(45, 150, 189);
}

.nav-home-active {
   color: rgb(11, 11, 11);
   font-weight: var(--font-weight-medium);
}

.bulb {
   font-size: var(--font-size-xl);
}
</style>