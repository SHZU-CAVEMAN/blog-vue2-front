<template>
  <div id="home">

    <div style="display:flex;">

      <left :articleInfo="articleInfo" style="width:20%" />


      <!-- articles和onFile两个组件接收articleInfo数据 -->
      <keep-alive>
        <router-view :articleInfo="articleInfo" style="flex:"></router-view>
      </keep-alive>

      <!-- <div class="one"> -->
      <right style="width:20%" />
      <!-- </div> -->


    </div>


  </div>
</template>

<script>
import right from './right.vue';
import Markdown from './markdown.vue';
import ArticleListCate from './onFile.vue';
import left from './left.vue';


import bloggerIntro from "./bloggerIntro.vue";
import Category from './category.vue';
import notice from "./notice.vue";
export default {
  name: "homeComponent",
  components: { bloggerIntro, notice, Category, Markdown, ArticleListCate, left, right },
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
        if (JSON.parse(sessionStorage.getItem('article'))) {
          return JSON.parse(sessionStorage.getItem('article'));//文章数据从会话存储中获取，vuex刷新后会清除。
        } else {
          return this.$store.state.articleInfo.article;
        }
      }
    }
  },
  // beforeRouteUpdate (to, from, next) { //这个路由钩子？
  //   console.log( from,"哈哈哈", to);
  //   next();
  //   console.log(to,"呵呵呵", from);
  // },

  methods: {
    // ...mapActions(["setArticleInfo",]),
    EventHandler(name) {
      console.log("home组件", name);
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

          // console.log('hahahahaha', json);

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
              console.log('哈哈', this.$store.state.user.ip);
              console.log(result.country, result.regionName);
              // if(result.regionName == 'Hunan'){
              //   console.log("湖南");
              // }
            }
          }
          xhr.send();
        }
      };

      request.send();
    }
  },
  created() {
    //使用原生fetch获取ip
    // fetch('https://api.ipify.org?format=json')
    //   .then(response => response.json())
    //   .then(data => console.log('哈哈哈哈哈哈哈哈哈哈啊哈哈',data));

    // 使用原生xhr获取ip
    // this.getIP();


    //在这里请求articleInfo的数据，并存放在store中。
    //home组件是父组件，articleList组件是子组件。
    // 异步请求的结果在父组件的 beforeUpdate阶段可以获取，
    // 算了。
    // this.$bus.$on("cateEvent", this.EventHandler);



  }
};
</script>

<style>
.one {
  width: 20%;
  /* background-color: rgb(255, 255, 255); */

}
</style>