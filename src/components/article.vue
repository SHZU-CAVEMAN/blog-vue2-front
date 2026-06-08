<template>
  <!--文章展示卡片-->
  <div class="article">

    <h5 style="" @click="jump(article.id, article.title)"> {{ article.title }}</h5>

    <div style="display: flex;">
      <div :class="{ content: true, content_add: flag }">
        <div style="">
          <div>
            <span style="margin-left:1%">时间：{{ article.publishTime}}</span>
          </div>
          <div>
            <span style="margin-left:1%">分类：{{ article.category.name }}</span>
          </div>
        </div>
        <div class="intro">
          {{ article.summary }}
        </div>
      </div>
      <div v-if="article.picture" id="picture">
        <a @click="jump(article.id, article.title)">
          <keep-alive>
            <image-load :src="pictureUrl" :placeholder="placeholder" :duration="1500" class="imageLoad" />
          </keep-alive>
        </a>
      </div>
    </div>



  </div>
</template>

<script>
import imageLoad from '../tools/imageLoad.vue';

export default {
  name: "articleComponent",
  components: {
    imageLoad,
  },
  data() {
    return {
      flag: false,
    };
  },

  computed: {
    pictureUrl() {
      return this.$uploadFilesBase + this.article.picture;
    },
    placeholder() {
      return this.$uploadFilesBase + 'zipped_' + this.article.picture;
    }
  },
  props: ["article"],
  methods: {
    // 跳转到文章正文：articleView（见router）
    jump(id, name) {
      console.log(id, name);

      this.$router.push({
        name: "articleViewComponent",
        params: {
          id,
          name,
        },
      });
    },
  },
  mounted() {
    //判断是否有图片，没有图片就要改变description的样式。
    if (!this.article.picture) {
      this.flag = true;
      console.log("图片标志", this.flag1, this.flag2)
    }

  },
};
</script>

<style scoped>
.article {
  background-color: #ffffff;
  width: 96%;
  /* height: 230px; */
  /* height: 200px; */

  margin-bottom: 3%;
  margin-left: 2%;
  border-radius: 10px;
  /* box-shadow: 0px 0px 0px 1px rgb(194, 194, 194); */
  border: 1px solid rgb(180, 181, 183);
  /* border: 1px solid rgb(208, 215, 222); */


  padding: 2vh 3vh 3vh 3vh;

}


h5 {
  color: var(--interactive-text-rest);
  cursor: pointer;
  transition: color 0.2s ease;
}


h5:hover {
  color: var(--interactive-text-active);
}

.content {
  /* background-color: rgb(226, 226, 226); */
  /* background-color: rgb(235, 235, 235); */
  /* background-color: rgb(243, 243, 243); */
  background-color: #EFF2F5;


  width: 50%;
  font-size: var(--font-size-md);
  padding:1vh;
  border: 1px solid rgb(208, 215, 222);
  
}

.content_add {
  width: 100%;
}
/* .intro::-webkit-scrollbar{
    width: 0 !important;
} */
.intro::-webkit-scrollbar{
    width:0.5vh;
    background-color: rgb(227, 227, 227);
}
.intro::-webkit-scrollbar-thumb{
    background-color: rgb(150, 150, 150);
}
.intro {
  margin-top:2vh;
  font-size: var(--font-size-md);
  padding: 1vh;
  /* background-color: #EFF2F5; */
  background-color: #ffffff;

  max-height: 4.5rem;
  line-height: var(--line-height-normal);
  overflow: hidden;

  overflow-y:scroll;


}





.description {
  font-size: var(--font-size-md);
  background-color: #F3F4F6;
  margin-left: 2%;
  margin-top: 1vh;
  max-height: 4.5rem;
  line-height: var(--line-height-normal);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-line;
  width: 50%;
}

.description_plus {
  font-size: 1rem;
  width: 100%;
}

#picture {
  background-color: rgb(255, 255, 255);
  width: 46%;
  margin-left: 4%;
}

#picture:hover {
  /* box-shadow: 0px 4px 10px 2px rgb(185, 185, 185); */
  box-shadow: 0px 0px 2px 2px rgb(104, 104, 104);

}

#top {
  background-color: #F6F8FA;
  margin: 0 2% 0 2%;
  padding: 5px 5px 5px 5px;
}

#top:hover {
  background-color: #ffffff;
}

#top #titlename {
  font-size: 3.5vh;
  color: dimgray;
}

#top:hover #titlename {
  font-weight: 520;
  color: black;
}

#category {
  color: dimgray;
  font-size: var(--font-size-md);
  background-color: #F6F8FA;
  padding: 0.8vh 2vh;
  border: 1px solid rgb(208, 215, 222);
  border-radius: 1vh;
}

#category:hover {
  background-color: #F3F4F6;
  font-weight: 510;
}

.bottom {
  /* 后者覆盖前者，所以向左是5%，上下和右边是1vh */
  margin-top: 1vh;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  width: 50%;

}

.fenlei:hover {
  font-weight: 550;
  color: var(--interactive-text-active);
}

.imageLoad>>>img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  flex: 1;
}
</style>