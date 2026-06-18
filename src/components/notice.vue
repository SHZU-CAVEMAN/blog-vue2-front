<template>
  <div class="notice">
      <div class="notice-head">
        <a-icon type="sound" class="panel-icon" />
        <h6 class="panel-title">
          公告
        </h6>
      </div>

      <hr style="margin-top: 0;" />

      <div class="content">
        <div class="notice-text">欢迎
          <a :href="`https://www.baidu.com/s?wd=${encodeURIComponent(address)}`" target="_blank" rel="noopener noreferrer" class="notice-link"> {{ address }} </a>
          的网友来访
        </div>
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
      // 串行请求：先获取访客 公网 IP 地址。
      this.requestWithTimeout(
        this.$api.system.GetLocation(),
        3000
      )
        .then((res) => {
          console.log("地址信息：", res);
          const country = (res && res.data && res.data.country) || "";
          const regionName =
            (res && res.data && (res.data.regionName || res.data.regionname)) ||
            "";
          const city = (res && res.data && res.data.city) || "";
          const location = [country, regionName, city].filter(Boolean).join(" ");

          this.address = location || "未知地区";
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
    this.fetchAddress();
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

.notice-head {
  background-color: #fafafa;
  display: flex;
  align-items: center;
}

.panel-icon {
  font-size: var(--font-size-xl);
  color: #e53935;
  transform-origin: center;
  animation: iconBroadcast 1.8s ease-in-out infinite;
}

.panel-title {
  margin: 5px 0 5px 2vh;
  display: inline-block;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
  color: dimgray;
}

.content {
  margin-top: 5px;
  margin-left: 2%;
}

.notice-text {
  color: dimgray;
  font-size: var(--font-size-md);
}

.notice-link {
  font-weight: var(--font-weight-medium);
}

@keyframes iconBroadcast {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }

  20% {
    transform: scale(1.15) rotate(-10deg);
  }

  30% {
    transform: scale(1.15) rotate(10deg);
  }

  40% {
    transform: scale(1.15) rotate(-8deg);
  }

  50% {
    transform: scale(1.15) rotate(8deg);
  }

  60% {
    transform: scale(1.08) rotate(-4deg);
  }

  70% {
    transform: scale(1.04) rotate(3deg);
  }
}
</style>