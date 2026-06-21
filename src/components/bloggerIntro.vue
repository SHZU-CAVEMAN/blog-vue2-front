<template>
  <!-- 右侧博主简介卡片-->
  <div class="bloggerIntro">
    <br />
    <div style="text-align: center">
      <!--
        头像图像优化：
        1) 优先使用 AVIF/WebP 等现代格式；
        2) 默认走压缩版 JPG，降低下载体积；
        3) 固定 width/height，减少布局抖动（CLS）。
      -->
      <picture>
        <source :srcset="pictureAvifUrl" type="image/avif" />
        <source :srcset="pictureWebpUrl" type="image/webp" />
        <img
          class="avatar"
          :src="pictureCompressedUrl"
          width="130"
          height="130"
          loading="lazy"
          decoding="async"
          alt="博主头像"
          @error="handleAvatarError"
        />
      </picture>

      <br />
      <h5 class="name">Liao</h5>
      <div class="motto">欢迎驻足</div>
    </div>

    <hr style="margin-left: 5%; margin-bottom: 0; width: 90%" />
    <!-- github -->
    <div class="icon">
      <a class="icon-link" href="https://github.com/SHZU-CAVEMAN" title="github" target="_blank">
        <a-icon type="github" class="social-icon" />
      </a>
      <!-- 邮箱 -->
      <a id="mail" class="icon-link" href="javascript:void(0)" title="mail">
        <svg t="1698600227591" class="custom-icon" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="8049">
          <path
            d="M873.8 304.9l-367 211.9-357.6-206.4v-30.8c0-36.4 29.5-66 66-66H808c36.4 0 66 29.5 66 66v25.3z m0 76.1v359.6c0 36.4-29.5 66-66 66H215.1c-36.4 0-66-29.5-66-66V386.5l341.3 197c11.7 6.8 25.8 5.5 36-2 0.5-0.2 0.9-0.5 1.4-0.7l346-199.8z"
            p-id="8050"></path>
        </svg>
      </a>
      <!-- bilibili -->
      <a id="bilibili" class="icon-link" href="https://space.bilibili.com/481007576" title="bilibili" target="_blank">
        <svg t="1698600488941" class="custom-icon" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="9146">
          <path
            d="M407.01493195 416.79787228l-207.01495219 39.63534609 17.72718555 77.69355688 204.92836835-39.63339555-15.64060171-77.69550742z m111.58640401 205.96873182c-50.57966926 108.45750278-95.94385171 26.59468116-95.94384997 26.59468293l-33.88894432 21.90425767s66.73752344 91.25342826 130.35785761 21.89840255c75.08971719 69.35502569 132.44639368-22.41956127 132.44639369-22.41956129l-30.76785046-19.81572165c0.00195229-0.52310931-53.70661825 77.17044586-102.20360655-28.16206021z m102.20555713-128.27712723L826.25642016 534.12287069l17.20602685-77.69355517-206.48989059-39.63534783-16.16566333 77.69550918z m407.92825707-152.55685365c-3.26943832-144.72776925-129.50097116-172.48188089-129.50097115-172.48188095s-98.48718086-0.54262875-226.35636303-1.63374299l93.04722774-89.7777894s14.69002451-18.50209153-10.33923164-39.1727456c-25.03315897-20.67455869-26.6649497-11.42644137-35.36653541-5.98258363-7.62022946 5.43800258-119.1656441 114.80509321-138.75104077 134.39634504-50.59918694 0-103.38255474-0.54848555-154.528275-0.54848557h17.95555823s-133.30718305-131.67539228-142.0146239-137.65797419c-8.7074409-5.98453588-9.7946506-14.6861199-35.36848605 5.98258361-25.0292544 20.67651095-10.33923164 39.17469791-10.33923163 39.17469787l95.21969486 92.50069271c-103.3806025 0-192.62161828 0.54848555-233.97073731 2.17637344-133.85566859 38.63597204-123.5144847 173.02841419-123.51448469 173.02841419s1.62983844 288.3839436 0 434.20868051c14.69002451 145.82473864 126.77806613 169.2143949 126.77806786 169.21439492s44.61660332 1.089162 77.81262218 1.08916202c3.25967857 9.25006961 5.98063131 54.95583495 57.13220839 54.95583666 50.60113924 0 57.12830386-54.95583495 57.12830385-54.95583666s372.72373038-1.62983844 403.73556835-1.62983844c1.63569529 15.77723421 9.25397247 57.67483712 60.39969271 57.13415897 50.59918694-1.0911143 54.40735111-60.39578983 54.40735112-60.39578983s17.41488004-1.633743 69.10323074 0c120.79743481-22.31220625 127.86722815-163.78029688 127.86722812-163.78029517s-2.17051656-291.10880088-0.53677357-435.84437751zM924.8080144 803.3508361c0 22.85093041-17.95751049 41.34911733-40.26581216 41.34911732H149.98831549c-22.30830168 0-40.26385988-18.49818696-40.26385985-41.34911732V316.36269066c0-22.85483498 17.95751049-41.35497419 40.26385985-41.35497421h734.55388675c22.30830168 0 40.2658122 18.50013921 40.26581216 41.35497421v486.98814544z"
            p-id="9147"></path>
        </svg>
      </a>
    </div>
    <br />
  </div>
</template>

<script>
export default {
  name: "bloggerIntroComponent",
  data() {
    return {
      // 头像失败降级阶段：0=默认压缩图，1=原图兜底，2=本地静态图兜底。
      avatarFallbackStage: 0,
    };
  },
  computed: {
    // 原图兜底地址：当现代格式或压缩图不存在时回退。
    pictureOriginUrl() {
      return this.$uploadFilesBase + "zhishui.jpg";
    },
    // 压缩版 JPG 作为默认 src，优先降低首屏字节体积。
    pictureCompressedUrl() {
      return this.$uploadFilesBase + "zipped_zhishui.jpg";
    },
    pictureWebpUrl() {
      return this.$uploadFilesBase + "zhishui.webp";
    },
    pictureAvifUrl() {
      return this.$uploadFilesBase + "zhishui.avif";
    },
    // 本地静态头像兜底：当线上资源无法访问时，避免一直重试导致闪烁。
    localAvatarFallbackUrl() {
      return require("../assets/caveman.jpg");
    },
  },
  methods: {
    handleAvatarError(event) {
      const img = event.target;

      // 第一次失败：压缩图/现代格式失败后回退原图。
      if (this.avatarFallbackStage === 0) {
        this.avatarFallbackStage = 1;
        img.src = this.pictureOriginUrl;
        return;
      }

      // 第二次失败：原图也失败则回退本地静态图，彻底止损。
      if (this.avatarFallbackStage === 1) {
        this.avatarFallbackStage = 2;
        img.src = this.localAvatarFallbackUrl;
        return;
      }

      // 已进入最终兜底，不再继续切换地址，避免出现循环闪烁。
    },
  },
};
</script>

<style scoped>
.bloggerIntro {
  display: inline-block;

  background-color: #ffffff;
  width: 100%;
  height: auto;
  border-radius: 5px;
  border: 1px solid rgb(208, 215, 222);
}

.icon {
  margin-top: 2vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.icon-link {
  width: 30px;
  height: 30px;
  /* 使图标内部稳定居中 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--interactive-text-rest);
  text-decoration: none;
}

.name {
  color: dimgray;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
}

.motto {
  display: inline-block;
  margin-top: 0.25rem;
  padding: 0.125rem 0.5rem;
  color: rgb(0, 0, 0);
  background-color: #f4f5f7;
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
  border: 1px solid rgb(136, 138, 141);
  border-radius: 999px;
  transform-origin: center;
  animation: motto-shake 2.6s ease-in-out infinite;
}

@keyframes motto-shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  15% {
    transform: rotate(-4deg);
  }
  30% {
    transform: rotate(4deg);
  }
  45% {
    transform: rotate(-3deg);
  }
  60% {
    transform: rotate(3deg);
  }
  75% {
    transform: rotate(-1.5deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .motto {
    animation: none;
  }
}

.social-icon {
  font-size: 24px;
  line-height: 1;
  color: currentColor;
}

.custom-icon {
  width: 24px;
  height: 24px;
  display: block;
}

.icon-link:hover {
  color: var(--interactive-text-active);
}

.icon-link path {
  fill: currentColor;
}

.icon-link:hover path {
  fill: var(--interactive-text-active);
}

.avatar {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
}

img {
  width: 50%;
  height: 50%;
  border-radius: 50%;
}
</style>