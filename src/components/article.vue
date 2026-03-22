<template>
  <!--文章展示卡片-->
  <div class="article">

    <h5 style="" @click="jump(article.id, article.name)"> {{ article.name }}</h5>

    <div style="display: flex;">
      <div :class="{ content: true, content_add: flag }">
        <div style="">
          <div>
            <svg t="1700012849270" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12778"
              width="15" height="15">
              <path
                d="M437.682 927.944c-17.673 0-32-14.327-32-32v-235.2c0-17.673 14.327-32 32-32s32 14.327 32 32v235.2c0 17.673-14.327 32-32 32z"
                fill="#515151" p-id="12779"></path>
              <path
                d="M444.929 685.966a31.878 31.878 0 0 1-20.752-7.654c-13.446-11.47-15.048-31.668-3.579-45.113l452.025-529.934c11.468-13.444 31.665-15.048 45.112-3.579 13.446 11.469 15.049 31.667 3.579 45.113L469.29 674.731c-6.329 7.42-15.318 11.235-24.361 11.235zM794.905 895.954a31.875 31.875 0 0 1-14.07-3.277L542.347 775.683c-15.866-7.784-22.419-26.956-14.636-42.823 7.783-15.866 26.957-22.419 42.823-14.636l238.488 116.994c15.866 7.784 22.419 26.956 14.636 42.823-5.558 11.331-16.929 17.913-28.753 17.913zM324.426 650.466a31.853 31.853 0 0 1-15.102-3.809L114.875 542.324c-15.573-8.355-21.424-27.754-13.068-43.327 8.356-15.574 27.755-21.424 43.327-13.068l194.449 104.333c15.573 8.355 21.424 27.754 13.068 43.327-5.772 10.759-16.816 16.877-28.225 16.877z"
                fill="#515151" p-id="12780"></path>
              <path
                d="M130.332 544.135c-11.683 0-22.938-6.419-28.576-17.555-7.982-15.768-1.67-35.021 14.098-43.003L882.516 95.481c15.771-7.982 35.021-1.669 43.004 14.098 7.981 15.768 1.67 35.021-14.099 43.003L144.759 540.678a31.883 31.883 0 0 1-14.427 3.457z"
                fill="#515151" p-id="12781"></path>
              <path
                d="M797.13 896.074c-1.42 0-2.855-0.095-4.302-0.289-17.517-2.354-29.807-18.461-27.453-35.978l99.084-737.288c2.354-17.516 18.458-29.806 35.977-27.453 17.517 2.354 29.807 18.461 27.453 35.977l-99.084 737.288c-2.159 16.07-15.897 27.743-31.675 27.743z"
                fill="#515151" p-id="12782"></path>
            </svg>
            <span style="margin-left:1%">发布：2023-10-1</span>
          </div>
          <div>
            <svg t="1700013025454" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14017"
              width="15" height="15">
              <path
                d="M349.534791 63.36619 158.087505 63.36619c-52.782134 0-95.723132 42.940998-95.723132 95.723132L62.364373 350.536608c0 52.782134 42.940998 95.723132 95.723132 95.723132L349.534791 446.25974c52.782134 0 95.723132-42.940998 95.723132-95.723132L445.257923 159.090345C445.257923 106.307188 402.316925 63.36619 349.534791 63.36619zM381.442502 350.536608c0 17.593703-14.314007 31.907711-31.907711 31.907711L158.087505 382.444319c-17.593703 0-31.907711-14.314007-31.907711-31.907711L126.179794 159.090345c0-17.593703 14.314007-31.907711 31.907711-31.907711L349.534791 127.182634c17.593703 0 31.907711 14.314007 31.907711 31.907711L381.442502 350.536608z"
                fill="#515151" p-id="14018"></path>
              <path
                d="M349.534791 510.076184 158.087505 510.076184c-52.782134 0-95.723132 42.940998-95.723132 95.723132l0 191.446263c0 52.782134 42.940998 95.723132 95.723132 95.723132L349.534791 892.968711c52.782134 0 95.723132-42.940998 95.723132-95.723132L445.257923 605.799316C445.257923 553.017182 402.316925 510.076184 349.534791 510.076184zM381.442502 797.245579c0 17.593703-14.314007 31.908734-31.907711 31.908734L158.087505 829.154313c-17.593703 0-31.907711-14.314007-31.907711-31.908734L126.179794 605.799316c0-17.593703 14.314007-31.908734 31.907711-31.908734L349.534791 573.890582c17.593703 0 31.907711 14.314007 31.907711 31.908734L381.442502 797.245579z"
                fill="#515151" p-id="14019"></path>
              <path
                d="M604.796476 447.104991l191.447287 0c52.782134 0 95.723132-42.940998 95.723132-95.723132L891.966894 159.934572c0-52.782134-42.940998-95.723132-95.723132-95.723132L604.796476 64.211441c-52.782134 0-95.723132 42.940998-95.723132 95.723132l0 191.446263C509.073344 404.163993 552.014342 447.104991 604.796476 447.104991zM572.888765 159.934572c0-17.593703 14.314007-31.907711 31.908734-31.907711l191.447287 0c17.593703 0 31.908734 14.314007 31.908734 31.907711l0 191.446263c0 17.593703-14.314007 31.907711-31.908734 31.907711L604.796476 383.288546c-17.593703 0-31.908734-14.314007-31.908734-31.907711L572.887742 159.934572z"
                fill="#515151" p-id="14020"></path>
              <path
                d="M700.520631 605.799316c-52.782134 0-95.723132 42.940998-95.723132 95.723132 0 17.622356 14.285355 31.907711 31.907711 31.907711s31.907711-14.285355 31.907711-31.907711c0-17.593703 14.314007-31.908734 31.908734-31.908734 17.622356 0 31.907711-14.285355 31.907711-31.907711S718.142987 605.799316 700.520631 605.799316z"
                fill="#515151" p-id="14021"></path>
              <path
                d="M927.746796 883.623879l-71.232344-71.232344c22.314215-31.304983 35.453467-69.581752 35.453467-110.869087 0-105.564267-85.881996-191.446263-191.446263-191.446263s-191.447287 85.881996-191.447287 191.446263 85.883019 191.446263 191.447287 191.446263c41.287335 0 79.56308-13.138228 110.869087-35.452443l71.232344 71.232344c12.409634 12.409634 32.715099 12.409634 45.124733 0l0 0C940.155407 916.338978 940.155407 896.033513 927.746796 883.623879zM572.888765 701.522448c0-70.375837 57.256028-127.631866 127.632889-127.631866s127.631866 57.255005 127.631866 127.631866-57.255005 127.631866-127.631866 127.631866S572.888765 771.899308 572.888765 701.522448z"
                fill="#515151" p-id="14022"></path>
            </svg>
            <span style="margin-left:1%">分类：{{ article.category }}</span>
          </div>
          <div>
            <svg t="1700056125105" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2308" width="15" height="15"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3-7.7 16.2-7.7 35.2 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766z" p-id="2309" fill="#515151"></path><path d="M508 336c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176z m0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z" p-id="2310" fill="#515151"></path></svg>
            <span style="margin-left:1%">阅读量：12306</span>
          </div>
        </div>
        <div class="intro">
          {{ article.intro }}
        </div>
      </div>
      <div v-if="article.picture" id="picture">
        <a @click="jump(article.id, article.name)">
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
      //封面图片
      // pictureUrl: "http://localhost:3001/uploadFiles/"+ this.article.picture ,
      // pictureUrl:"/uploadFiles/" + this.article.picture,
      flag: false,
    };

  },

  computed: {
    pictureUrl() {
      return "/uploadFiles/" + this.article.picture;
    },
    placeholder() {
      return "/uploadFiles/" + 'zipped_' + this.article.picture;

      // return "/uploadFiles/" + 'vue3';

    }
  },
  props: ["article"],
  methods: {
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
    jumpCate(name) {
      // console.log("点击事件没问题",name)

      this.$router.push({
        name: "articleListCate",
        //在这里携带 params参数（category_name)比较好。
        // query:{
        //   name,
        // }
      });

      // this.$bus.$emit('cateEvent', name);  //被触发的那个组件还没被创建出来?

    },

  },
  mounted() {
    // this.articleInfo = JSON.stringify(this.a);
    console.log(this.article.picture);
    //  console.log(Object.assign({},this.a));

    //判断是否有图片，没有图片就要改变description的样式。
    if (!this.article.picture) {
      this.flag = true;
      console.log("niahaojoidsidbf", this.flag1, this.flag2)
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
  font-weight: 550;
  color: rgb(70, 70, 70)
}

h5:hover {
  color: rgb(45, 150, 189)
}

.content {
  /* background-color: rgb(226, 226, 226); */
  /* background-color: rgb(235, 235, 235); */
  /* background-color: rgb(243, 243, 243); */
  background-color: #EFF2F5;


  width: 50%;
  font-size: 14px;
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
  font-size: 0.9rem;
  padding: 1vh;
  /* background-color: #EFF2F5; */
  background-color: #ffffff;

  max-height: 4.5rem;
  line-height: 1.3rem;
  overflow: hidden;

  overflow-y:scroll;


}





.description {
  font-size: 1rem;
  background-color: #F3F4F6;
  margin-left: 2%;
  margin-top: 1vh;
  max-height: 4.5rem;
  line-height: 1.5rem;
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
  /* color:#0d6efd; */
}

#top:hover #titlename {
  /* color: #000000; */
  /* color: #1890ff; */

  /* 字体变大 */
  /* font-size:25px; */

  /* 字体加粗 */
  font-weight: 520;
  color: black;
  /* text-decoration: underline; */

  /* 给字体加下划线 */
  /* text-decoration: null; */
}


#category {
  color: dimgray;
  font-size: 15px;
  background-color: #F6F8FA;
  padding: 0.8vh 2vh;
  border: 1px solid rgb(208, 215, 222);

  border-radius: 1vh;
}

#category:hover {
  /* color: #1890ff; */
  background-color: #F3F4F6;
  /* text-decoration: underline; */
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
  color: rgb(45, 150, 189);
}

.imageLoad>>>img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  flex: 1;
}
</style>