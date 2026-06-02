<template>
  <div id="home">
    <div class="home-layout">
      <!-- 左侧：分类汇总-->
      <left :articleInfo="articleInfo" class="sidebar left-side" />

      <!-- 中间主体：articles和 onFile 两个组件接收 articleInfo数据 -->
      <keep-alive>
        <router-view :articleInfo="articleInfo" class="main-content"></router-view>
      </keep-alive>

      <!-- 右侧：公告信息和博主卡片 -->
      <right class="sidebar right-side" />
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
  }
};
</script>

<style>
.home-layout {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2%;
  width: 100%;
  box-sizing: border-box;
  padding: 0 2%;
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
</style>