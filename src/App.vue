<template>
  <div id="app" style="display: block;">
    <!-- 顶部导航栏 -->
    <navigation />
    <hr style="margin: 0;color:rgb(0, 0, 0)" />

    <a-back-top @click="click"/>
    <!-- 无 keep-alive：每次切换组件，再切回时重新创建。 -->
    <!-- keep-alive还是好，看样子还是应该把articlelist请求的数据保存在store中。 -->
    <!-- 以下：home组件 -->
    <keep-alive>
      <router-view :commentData="commentData"></router-view>
    </keep-alive>

  </div>
</template>

<script>
import navigation from './views/navigation.vue'

import axios from 'axios';

export default {
  name: 'App',
  components: {
    navigation,
},
  data() {
    return {
      commentData: [],
    }
  },
  methods:{
    click(){
      // console.log('返回顶部',e.target)
      // window.scrollTo(0,0);
    }
  },
  created() {
    // 请求评论数据
    axios({
      method: "get",
      url: "/comment/getall",
    })
      .then((res) => {
        //将请求的数据保存在store中
        this.$store.dispatch("setComment", res.data.data);
        this.commentData = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

}
</script>

<style></style>


