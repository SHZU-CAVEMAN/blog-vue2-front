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
      // 默认回退文案：接口超时/失败时也能给用户稳定展示。
      address: "未知地区",
    }
  },
  methods: {
    // 封装带超时的请求：超时后主动 reject，避免页面长期等待外部接口。
    requestWithTimeout(requestPromise, timeout = 3000) {
      return Promise.race([
        requestPromise,
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error("IP_API_TIMEOUT")), timeout);
        }),
      ]);
    },
    // 获取访客地址：任一步异常都走 fallback，保证公告组件始终可用。
    fetchAddress() {
      // 串行请求1：先获取访客 公网 IP 地址。
      this.requestWithTimeout(
        this.$api.system.getPublicIp(),
        3000
      )
        .then((res) => {
          const ip = res && res.data ? res.data.ip : "";
          if (!ip) {
            throw new Error("IP_EMPTY");
          }
          // 串行请求2：拿到 IP 后再请求地理位置，接口异常同样走 fallback。
          return this.requestWithTimeout(
            this.$api.system.getGeoByIp(ip),
            3000
          );
        })
        .then((res) => {
          //console.log("ip信息：", res.data);

          const city = (res && res.data && res.data.city) || "";
          this.address = city || "未知地区";

          // 请求成功时更新 Vuex，供其它组件复用。
          this.$store.dispatch("setIp", res.data);
          //console.log("ip地址存入store", this.$store.state.user.ip);
        })
        .catch((err) => {
          // 接口超时或失败时回退到默认文案，避免显示空白或报错中断。
          // 手动上报业务上下文，便于区分是 IP 获取链路失败，而不是普通网络错误。
          this.$reportError("notice-ip-fetch-failed", err, {
            module: "notice",
            fallbackAddress: "未知地区",
          });
          this.address = "未知地区";
        });
    },
  },
  created() {
    //this.fetchAddress();
  },
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