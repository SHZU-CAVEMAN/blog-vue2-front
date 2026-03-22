<template>
  <div style="display: flex; margin-top: 0vh">
    <div v-bind:class="{ info_index: true, outter: outter }">
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
        <div v-for="item in articlesCurrent" :key="item" @click="jump(item.id, item.name)">
          <div :class="{ item_current: true, item_current_add: item.name == name }">
            {{ item.name }}
          </div>
        </div>
      </div>
      <!-- <div class="info">
        <div style="text-align: center;">文章信息</div>
        <hr style="margin:1vh 0px" />
        <div>阅读量：236</div>
        <hr style="margin:0" />
        <div>日期：2023-4-15</div>
        <hr style="margin:0" />
        <div>分类：Vue</div>
        <hr style="margin:0" />
        <div>字数：10658</div>
        <hr style="margin:0" />
        <div>预计阅读时间：20min</div>
        <hr style="margin:0" />
        <br/>
      </div> -->

      <!-- <div class="index">
        <div style="text-align: center;">当前分类：</div>
        <hr style="margin:1vh 0px" />
        <div>上一篇：2023-10-4</div>
        <hr style="margin:0" />
        <div>下一篇：无</div>
        <hr style="margin:0" />
        <br/>
      </div> -->
    </div>

    <!-- 文章正文 -->
    <div v-bind:class="{ body: true, body_add: titles.length == 0 }">
      <div class="title">
        {{ name }}
      </div>
      <hr style="margin-top: 1vh" />
      <!-- 正文 -->
      <v-md-preview :text="text" ref="preview" style="" />
      <!-- <v-md-preview-html :html="text" preview-class="vuepress-markdown-body"></v-md-preview-html> -->
      <h v-if="publish_time" style="margin-left: 80%; font-size: 2.8vh">发布 {{ publish_time }}</h>
      <hr v-if="publish_time" />
      <!-- 尾部 -->
      <div v-if="publish_time" style="
          display: flex;
          flex-direction: column;
          height: 20vh;
          padding: 3vh;
        ">
        <!-- <a-icon  type="like" :theme=isLike @click="Onlike" style="font-size:4vh;margin-left: 0vh;" /> -->

        <h1 style="
            display: flex;
            align-items: center;
            font-size: 16px;
            background-color: #f6f8fa;
            padding: 1vh;
            border: 1px solid rgb(184, 184, 184);
          " @click="jumpFormer(formerId, former)">
          上一篇
          <a-icon type="double-right" style="margin-left: 1vh; margin-right: 2vh" />
          <a>{{ former }}</a>
        </h1>
        <h1 style="
            display: flex;
            align-items: center;
            margin-top: 0vh;
            font-size: 16px;
            background-color: #f6f8fa;
            padding: 1vh;
            border: 1px solid rgb(184, 184, 184);
          " @click="jumpLater(laterId, later)">
          下一
         
          <a>{{ later }}</a>
        </h1>
      </div>
    </div>

    <!-- 文章目录 -->
    <div v-if="titles.length != 0" :class="{ catalog: true, outter: outter }">
      <div class="el-icon-tickets" style="
          font-size: 2.8vh;
          margin-top: 1vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: dimgray;
        ">
        <a-icon type="container" />
        <a style="margin-bottom: 2px; margin-left: 2vh"> 目录</a>
      </div>

      <hr style="margin-top: 5px; margin-bottom: 0" />

      <div style="background-color:white; padding: 2vh;">
        <!-- 滚动条加在这里 -->
        <div ref="catalog_scroll" class="catalog_content">
          <div :id="anchor.lineIndex" v-for="anchor in titles" :style="{
            padding: `0 0 0px ${anchor.indent * 30}px`,
            marginLeft: '0vh',
            marginRight: '0vh',
          }" @click="handleAnchorClick(anchor)" :key="anchor">
            <a id="font" style="
                cursor: pointer;
                height: 4vh;
                font-size: 0.9rem;
                background-color: 
              ">
              {{ anchor.title }}</a>
            <!-- <hr style="margin:0" /> -->
          </div>
        </div>

        <!-- <br/> -->
      </div>
      <!-- 
      <div class="sider">
        <div class="siderbar">
        </div>
      </div> -->
      <!-- <div style="height:2vh">
      </div> -->
    </div>

    <!-- <comment :name="name" :commentData="commentData"></comment> -->
  </div>
</template>

<script>
import Catalog from "./catalog.vue";
import left from "./left.vue";
export default {
  name: "markdownComponent",
  props: ["id", "name"],
  components: {
    left,
    Catalog,
  },
  data() {
    return {
      text: ``,
      // isLike: "",
      // articles:this.$store.state.articleInfo.article,
      publish_time: "",
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

      articlesCurrent: [],
      item_current_add: false,
      scroll: false,
    };
  },
  watch: {
    id: {
      handler() {
        //刷新页面,这样才能拿到axios请求后的数据。
        // location.reload();
        this.$router.go(0);
      },
    },
  },
  mounted() {
    this.getArticlesCurrent(this.name);
    //文章数据(不该这个时候才请求)
    console.log(this.name);
    var url = encodeURI("/uploadFiles/" + this.name + ".md");
    // var urldeco = decodeURI(url);
    console.log(url);
    axios({
      method: "get", //请求方法
      url: url,
    })
      .then((res) => {
        this.text = res.data; //文章数据保存，text格式
        // this.flag = true;
      })
      .then(() => {
        // this.anchors = this.$refs.preview.$el.querySelectorAll("h1,h2,h3,h4,h5,h6");
        // this.flag = true;

        // 一 、 拿到文章数据后获取文章标签等数据
        console.log("这里执行了");
        const anchors =
          this.$refs.preview.$el.querySelectorAll("h1,h2,h3,h4,h5,h6");

        // const anchors  = this.anchors;
        // console.log("呵呵呵呵呵呵呵", anchors);

        //anchors是一个NodeList对象，（类数组对象），表示一个有序的节点集合

        const titles = Array.from(anchors).filter(
          //Array.from：将anchors转换成一个数组
          (title) => !!title.innerText.trim() //保留具有非空文本内容的标题元素。
        );
        // console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhh', titles);

        //给comment组件传值
        if (titles.length == 0) {
          this.flag = false;
        } else {
          this.flag = true;
        }
        this.$bus.$emit("changeStyleEvent", this.flag);

        // 没有标题，则 this.titles数组为空，返回空数组。
        if (!titles.length) {
          this.titles = [];
          return;
        }

        const hTags = Array.from(
          new Set(titles.map((title) => title.tagName))
        ).sort(); //去除重复的标题标签名，并将结果转换为数组 ?

        this.titles = titles.map((el) => ({
          title: el.innerText, //文本内容
          lineIndex: el.getAttribute("data-v-md-line"), //所在行数
          indent: hTags.indexOf(el.tagName), //标题级别-1
          //一个title对象 存储了文本内容，所在行数，标题级别。
        }));

        //二 、监听目录标题的滚动
        for (let i = 0; i < this.titles.length; i++) {
          const item = this.$refs.preview.$el.querySelector(
            `[data-v-md-line="${this.titles[i].lineIndex}"]`
          );
          this.target.push(item);
          this.indexArray.push(this.titles[i].lineIndex);
        }
        let options = {
          rootMargin: "5% 0px -70% 0px",
        };
        // 首次加载没滚动它也执行了一遍
        const observer = new IntersectionObserver(
          this.debounce(this.observeScroll, 100),
          options
        );
        // console.log("试一试", target);
        // this.target是nodelist类数组，用Array.from将其转化为数组
        // 开始监视每一项（一滚动就调用observeScroll的方法）
        Array.from(this.target, (item) => observer.observe(item));
      })
      .catch((err) => {
        console.log("请求文章出错！");
        return Promise.reject(err);
      });

    // 从会话存储中取，因为存在vuex的那一份数据会随着刷新被清除
    // 会话存储中的文章数据是在浏览器初次加载时就保存的（articles组件），如果有更新，那么获取的实际上是上次加载的文章数据。
    let articles = JSON.parse(sessionStorage.getItem("article"));
    // 以下for循环与 “上一篇下一篇”这个功能有关：遍历所有文章，找到某篇文章的前后篇。
    for (let i = 0; i < articles.length; i++) {
      if (articles[i].name == this.name) {
        //可以对时间数据略作处理：2023/3/12 ——> 2023年3月12日
        this.publish_time = articles[i].publish_time;
        if (i != 0 && i != articles.length - 1) {
          this.former = articles[i - 1].name;
          this.later = articles[i + 1].name;
          this.formerId = articles[i - 1].id;
          this.laterId = articles[i + 1].id;
        }
        if (i == 0) {
          this.former = "温馨提示：目前是第一篇";
          this.later = articles[i + 1].name;
          this.laterId = articles[i + 1].id;
        }
        if (i == articles.length - 1) {
          this.former = articles[i - 1].name;
          this.later = "温馨提示：目前是最后一篇";
          this.formerId = articles[i - 1].id;
        }
      }
    }
  },

  methods: {
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
    jump(id, name) {
      // console.log(name);
      this.$router.push({
        name: "articleViewComponent",
        params: {
          id,
          name,
        },
      });
    },
    getArticlesCurrent(name) {
      let articles = JSON.parse(sessionStorage.getItem("article"));
      let cate = "";
      for (let i = 0; i < articles.length; i++) {
        if (articles[i].name == name) cate = articles[i].category;
      }
      for (let j = 0; j < articles.length; j++) {
        if (articles[j].category == cate)
          this.articlesCurrent.push(articles[j]);
      }
      console.log("nishishabima???", this.articlesCurrent);
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
          document.getElementById(domline).style.color = "dimgray";
          document.getElementById(domline).style.fontWeight = "500";
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
          console.log("hahahahahahah了", dom);
          //这个方法效果不太行：
          // console.log(this.$refs.catalog_scroll)
          dom.scrollIntoView({
            behavior: "instant",
            block: "center",
            inline: "start",
          });
          dom.style.color = "#1890ff";
          // dom.style.color = "black";
          dom.style.fontWeight = "600";
          const index = this.indexArray.indexOf(line);
          var sider = document.querySelector(".siderbar");
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
  },
  beforeMount() {
    // console.log("空空空？？？", this.articles);
    window.addEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
.info_index::-webkit-scrollbar {
  width: 0 !important;
}

.info_index {
  width: 18%;
  margin-left: 0%;
  display: flex;
  flex-direction: column;
  position: absolute;
  border: 1px solid rgb(178, 178, 178);

  padding: 3vh;

  top: 10vh;
  bottom: 0;
  background-color: white;
  overflow-y: scroll;
}

.outter {
  position: fixed;
  top: 0;
}

.info {
  background-color: #ffffff;
  width: 100%;
  /* height: 30vh; */
  padding: 2vh;
  font-size: 0.9rem;
  border-radius: 1vh;
  border: 1px solid rgb(178, 178, 178);
}

.info:hover {
  box-shadow: 0vh 0vh 1vh rgb(163, 163, 163);
}

.index {
  background-color: white;
  width: 100%;
  /* height: 30vh; */
  margin-top: 3vh;
  padding: 2vh;
  font-size: 0.9rem;
  border-radius: 1vh;
  border: 1px solid rgb(178, 178, 178);
}

.index:hover {
  box-shadow: 0vh 0vh 1vh rgb(143, 143, 143);
}

/* 文章主体样式 */
.body {
  background-color: rgb(255, 255, 255);
  /* background-color: #EFF2F5; */
  width: 60%;
  margin-left: 20%;
  margin-top: 2vh;
  color: black;
  border-radius: 1vh;
  border: 1px solid rgb(178, 178, 178);
}

/* 上一篇下一篇样式 */
h1:hover a {
  font-weight: 550;
}

.catalog {
  /* overflow: auto; */
  position: fixed;
  margin-left: 81%;
  margin-top: 2vh;
  background-color: #eff2f5;
  /* background-color: #ffffff; */
  overflow: hidden;
  width: 18%;
  /* min-height: 10vh; */
  /* max-height: 50vh; */
  /* overflow-y: scroll; */
  border-radius: 2vh;
  border: 1px solid rgb(178, 178, 178);
}

.catalog_content {
  /* background-color: #e7f3ff; */
  /* background-color: #ffffff; */
  overflow-y: scroll;
  max-height: 45vh;
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
  background-color: #eff2f5;
  margin-top: 1vh;
  font-size: 0.9rem;
  border-radius: 1vh;
  padding: 0 1vh;
}

.item_current:hover {
  color: black;
  font-weight: 550;
  border: 1px solid rgb(178, 178, 178);
}

.item_current_add {
  color: black;
  font-weight: 550;
  border: 1px solid rgb(178, 178, 178);
}

/* 文章标题样式 */
.title {
  margin-top: 3vh;
  font-weight: 550;
  font-size: 1.3rem;
  color: black;
  text-align: center;
}

.sider {
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
  display: flex;
  width: 100%;
  height: 4vh;
  line-height: 2;
  background: rgb(166, 166, 166);
  transition: all 0.1s;
}
</style>