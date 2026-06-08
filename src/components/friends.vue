<template>
  <div class="friends-page">
    <div class="friends-card">
      <div class="friends-title">友情链接</div>
      <div class="friends-grid">
        <a
          v-for="site in friendsSites"
          :key="site.url"
          :href="site.url"
          target="_blank"
          rel="noopener noreferrer"
          class="friend-item"
        >
          <img :src="site.avatar" :alt="site.name" class="friend-avatar" />
          <div class="friend-meta">
            <div class="friend-name">{{ site.name }}</div>
            <div class="friend-desc">{{ site.desc }}</div>
            <div class="friend-url">{{ site.url }}</div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "friendsComponent",
  data() {
    return {
      // 友联信息集中维护：头像、标题和介绍统一在这里配置。
      friendsSites: [
        {
          name: "This Cute World",
          url: "https://thiscute.world/",
          avatar: "https://www.google.com/s2/favicons?domain=thiscute.world&sz=128",
          desc: "细腻的技术与生活记录，内容风格轻快。",
        },
        {
          name: "荷戟独彷徨",
          url: "https://guanqr.com/",
          avatar: "https://www.google.com/s2/favicons?domain=guanqr.com&sz=128",
          desc: "偏工程实践与前端思考，文章内容有深度。",
        },
        {
          name: "Bensz - 苯苯",
          url: "https://blognas.hwb0307.com/",
          avatar: "https://www.google.com/s2/favicons?domain=blognas.hwb0307.com&sz=128",
          desc: "个人博客与工具分享并重，实用内容较多。",
        },
        {
          name: "Hi! 上天不? - 新一的个人博客",
          url: "https://a-wing.top/",
          avatar: "https://www.google.com/s2/favicons?domain=a-wing.top&sz=128",
          desc: "围绕开发与成长主题，内容更新活跃。",
        },
      ],
    };
  },
};
</script>

<style scoped>
.friends-page {
  width: 100%;
  margin-top: 3.5vh;
  box-sizing: border-box;
}

.friends-card {
  width: 96%;
  margin-left: 2%;
  background-color: #ffffff;
  border: 1px solid rgb(208, 215, 222);
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
}

.friends-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
  color: #24292f;
  margin-bottom: 14px;
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.friend-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  background-color: #f6f8fa;
  text-decoration: none;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.friend-item:hover {
  border-color: #d0d7de;
  background-color: #f3f4f6;
}

.friend-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid #d0d7de;
  background-color: #ffffff;
  flex-shrink: 0;
}

.friend-meta {
  min-width: 0;
}

.friend-name {
  color: var(--interactive-text-rest);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  line-height: 1.4;
  transition: color 0.2s ease;
}

.friend-desc {
  margin-top: 4px;
  color: #57606a;
  font-size: var(--font-size-md);
  line-height: 1.4;
}

.friend-url {
  margin-top: 6px;
  color: var(--interactive-text-rest);
  font-size: var(--font-size-md);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.friend-item:hover .friend-name,
.friend-item:hover .friend-url {
  color: var(--interactive-text-active);
}

@media (max-width: 768px) {
  .friends-grid {
    grid-template-columns: 1fr;
  }
}
</style>
