<template>
  <div class="notice">
      <div style="background-color:#fafafa;display:flex;align-items: center;">
        <a-icon type="sound" style="font-size: 3vh;" />
        <h6 style="color: dimgray;margin:5px 0 5px 2vh;display:inline-block">
          公告
        </h6>
      </div>

      <hr style="margin-top: 0;" />

      <div class="content">
        <h6 style="color: dimgray">欢迎来自<a :href="'https://www.baidu.com/s?tn=88093251_77_hao_pg&ie=utf-8&ssl_sample=normal&srcqid=7967440894375959861&H123Tmp=nunew7&word='+address" target="_blank" style="font-weight:550"> {{ address }} </a>的网友来访</h6>
      </div>
  </div>
</template>

<script>
export default {
  name: "noticeComponent",
  data() {
    return {
      address:' XX ',
    }
  },
  created() {
    // console.log('notice组件')
    //挂载的时候，store异步请求的数据还没有收到。可以用watch监听。
    // this.address = this.$store.state.user.ip.regionName;

    //使用axios获取ip
    this.$axios({
      method: "get",
      url: "http://api.ipify.org/?format=json",
    })
      .then((res) => {
        return this.$axios.get('http://ip-api.com/json/' + res.data.ip)
      })
      .then((res) => {
        console.log("ip信息：", res.data);
        // this.address = translate(res.data.city);
        this.address =   res.data.city
        this.$store.dispatch("setIp", res.data);//存入store
        console.log('ip地址存入store', this.$store.state.user.ip);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
</script>

<style scoped>
.notice {
  background-color: #ffffff;
  width: 95%;
  height: auto;
  padding: 5%;
  border-radius: 10px;
  /*box-shadow: 0px 4px 6px 2px rgb(223, 223, 223); */
  border: 1px solid rgb(208, 215, 222);
}

.content {
  margin-top: 5px;
  margin-left: 2%;
}
</style>