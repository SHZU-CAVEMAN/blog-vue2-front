<template>
  <div class="footer">
    <div style="text-align: center; padding:5vh;">
      <span>©2023 by 山顶洞人</span>
      <div>
        <a href=" https://cn.vuejs.org/" target="blank">Vue </a>|
        <a href=" https://www.expressjs.com.cn/" target="blank"> Express</a> |
        <a href="https://2x.antdv.com/docs/vue/introduce-cn" target="blank">Ant-Design-Vue</a>
      </div>
      <span>
       湘ICP备2023003146号
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "footerComponent",
};
</script>

<style scoped>
.footer {
  background-color: var(--color-bg-surface);
  color: var(--text-color-primary);
  width: 100%;
  margin-top: 0vh;
  border:1px solid var(--color-border-primary);
  border-radius: 10px;
}
</style>