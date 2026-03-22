<template>
   <div class="navigation">
      <img src="../assets/caveman.jpg" class="img" />
      <div style="color:rgb(0, 0, 0);font-size:4vh;font-family: lisu;margin-left: 2vh;">李奥's blog</div>

      <div ref="shouye" v-bind:class="{ shouye: !flag1, click: flag1 }" style="margin-left: 70%;" @click="click">
         <div style="width:8vh;display: inline-block;" @click="jump1">首页</div>
      </div>

      <a-dropdown placement="topCenter" style="display:none">
         <!-- <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            关于<a-icon type="down" />
         </a> -->
         <div v-bind:class="{ guanyu: !flag2, click: flag2 }">
            <div style="width:10vh;background-color:" >关于</div>
         </div>

         <a-menu slot="overlay" >
            <a-menu-item >
               <a @click="jumpBlogger" >博主</a>
            </a-menu-item>
            <a-menu-item>
               <a @click="jumpBoard">留言板</a>
            </a-menu-item>
            <a-menu-item>
               <a @click="jumpStatistic">网站统计</a>
            </a-menu-item>
         </a-menu>
      </a-dropdown>


      <div v-bind:class="{ bianji: !flag3, click: flag3 }">
         <div style="width:10vh;background-color:" @click="jump3">编辑</div>
      </div>

      <div v-bind:class="{ youlian: true, click: flag4 } " style="display:none">
         <div style="width:10vh;background-color:" @click="jump4">友链</div>
      </div>

      <div class="bulb" @click="jump5">
         <a-icon ref='bulb_icon' type="bulb" :theme="theme" />
      </div>
   </div>
</template>

<script>
export default {
   name: "navigationComponent",
   data() {
      return {
         flag1: true,//flag1为首页的状态，初始化时就为ture。
         flag2: false,
         flag3: false,
         flag4: false,
         flag5: false,
         theme: '',
      }
   },
   methods: {
      click() {
         // alert("haha");
         // let node = document.getElementById("shouye");
         // node.style.cssText = "text-decoration:underline;";
         // this.flag1 = true;
         // this.$refs.shouye.class = "color:white";
      },
      jump1() {
         this.flag1 = true;
         this.flag2 = false;
         this.flag3 = false;
         this.flag4 = false;

         this.$router.push({
            name: "articles",
         });
      },
      jumpBlogger() {
         this.flag1 = false;
         this.flag2 = true;
         this.flag3 = false;
         this.flag4 = false;

         this.$router.push({
            name: "articleViewComponent",
            params: {
               id: 0,
               name: 'blogger',
            }
         });
      },
      jumpBoard(){
         this.flag1 = false;
         this.flag2 = true;
         this.flag3 = false;
         this.flag4 = false;

         this.$router.push({
            name:"messageBoardComponent",
         });
      },
      jumpStatistic(){
         this.flag1 = false;
         this.flag2 = true;
         this.flag3 = false;
         this.flag4 = false;
         this.$router.push({
            name:"statisticsComponent",
         })
      },
      jump3() {
         this.flag1 = false;
         this.flag2 = false;
         this.flag3 = true;
         this.flag4 = false;
         this.$router.push({
            name: "mdEditorComponent",
         });
      },
      jump4() {
         this.flag1 = false;
         this.flag2 = false;
         this.flag3 = false;
         this.flag4 = true;
         this.$router.push({
            name: "friendsComponent",
         });
      },
      jump5() {
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
   /* position: fixed; */

   /* background-color: #F6F8FA; */
   background-color: #ffffff;

   height: 10vh;
}

.img {
   width: 8vh;
   height: 8vh;
   margin-left: 2%;
   border-radius: 50%;
}

.click {
   line-height: 10vh;
   color: rgb(0, 0, 0);
   font-size: 2.7vh;
   font-weight: 550;
}

.shouye {
   line-height: 10vh;
   color: rgb(61, 61, 61);
   font-size: 2.7vh;
}

.shouye::after {
   background-color: rgb(0, 0, 0);
   height: 2px;

}

.shouye:hover {
   /* font-size: 3.2vh; */
   color: rgb(45, 150, 189);
   /* font-weight: 550; */
}

.guanyu {
   line-height: 10vh;
   color: rgb(61, 61, 61);
   font-size: 2.7vh;
}

.guanyu:hover {
   /* font-size: 3.2vh; */
   color: rgb(45, 150, 189);

   /* text-decoration: underline; */
}

.bianji {
   line-height: 10vh;
   color: rgb(61, 61, 61);
   font-size: 2.7vh;
}

.bianji:hover {
   /* font-size: 3.2vh; */
   color: rgb(45, 150, 189);

   /* text-decoration: underline; */
}

.youlian {
   line-height: 10vh;
   color: rgb(61, 61, 61);
   font-size: 2.7vh;
   margin-left: 0%
}

.youlian:hover {
   /* font-size: 3.2vh; */
   color: rgb(45, 150, 189);

   /* text-decoration: underline; */
}

.bulb {
   font-size: 3.5vh;
   margin-left: 3vh;
   margin-bottom: 1.2vh
}
/* 悬浮更改样式时，为什么会有延时？ */
a:hover{
   /* font-weight: 550; */
   /* color:black; */
}

#blogger:hover {
   text-decoration: underline;

}

#editor:hover {
   text-decoration: underline;
}
</style>