<template>
  <div class="friends-page">
    <div class="friends-card">
      <div class="friends-title">友情链接</div>
      <!-- 按分类渲染友链，每组独立展示标题和卡片列表 -->
      <div v-for="group in friendsCategories" :key="group.category" class="friends-group">
        <div class="friends-category-title">{{ group.category }}</div>
        <div v-if="group.sites.length" class="friends-grid">
          <a
            v-for="site in group.sites"
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
        <div v-else class="friends-empty">暂无链接，敬请期待</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "friendsComponent",
  data() {
    return {
      // 友链数据改为后端驱动：页面只做渲染与分组。
      friendsCategories: [],
    };
  },
  methods: {
    // 兼容后端多种响应包裹格式，尽量提取出数组数据。
    resolveRowsFromResponse(res) {
      const payload = res && res.data !== undefined ? res.data : res;
      if (Array.isArray(payload)) return payload;
      if (!payload || typeof payload !== "object") return [];

      const candidates = [payload.data, payload.rows, payload.list, payload.items];
      for (let i = 0; i < candidates.length; i += 1) {
        if (Array.isArray(candidates[i])) {
          return candidates[i];
        }
      }

      if (payload.data && typeof payload.data === "object") {
        const nested = [payload.data.rows, payload.data.list, payload.data.items];
        for (let i = 0; i < nested.length; i += 1) {
          if (Array.isArray(nested[i])) {
            return nested[i];
          }
        }
      }

      return [];
    },
    // 构建友链头像 URL，使用 Google Favicon 服务，兼容各种 URL 格式。
    buildAvatar(url) {
      try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      } catch (error) {
        return "https://www.google.com/s2/favicons?domain=example.com&sz=128";
      }
    },
    // 按分类名分组，保持后端返回顺序。
    groupFriendlinks(rows) {
      const list = Array.isArray(rows) ? rows : [];
      const groups = [];
      const map = {};

      const isEnabled = (status) => {
        if (status === undefined || status === null || status === "") return true;
        if (typeof status === "string") {
          const normalized = status.toLowerCase();
          return normalized === "enabled" || normalized === "enable" || normalized === "1" || normalized === "true";
        }
        if (typeof status === "number") return status === 1;
        if (typeof status === "boolean") return status;
        return true;
      };

      list
        .filter((item) => isEnabled(item.status))
        .forEach((item) => {
          const categoryName = item.category_name || "未分类";
          if (!map[categoryName]) {
            map[categoryName] = {
              category: categoryName,
              sites: [],
            };
            groups.push(map[categoryName]);
          }

          map[categoryName].sites.push({
            name: item.name,
            url: item.url,
            desc: item.description,
            avatar: this.buildAvatar(item.url),
          });
        });

      this.friendsCategories = groups;
    },
    loadFriendlinks() {
      this.$api.friendlink.getAll()
        .then((res) => {
          const rows = this.resolveRowsFromResponse(res);
          this.groupFriendlinks(rows);
        })
        .catch((err) => {
          this.friendsCategories = [];
          if (this.$reportError) {
            this.$reportError("friendlink-list-fetch-failed", err, {
              module: "friends",
            });
          }
          console.error("友链加载失败：", err);
        });
    },
  },
  created() {
    this.loadFriendlinks();
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

/* 分类组容器，相邻组之间留出间距。 */
.friends-group {
  margin-bottom: 24px;
}

.friends-group:last-child {
  margin-bottom: 0;
}

/* 分类标题：左侧色条 + 文字，视觉层级低于页面主标题。 */
.friends-category-title {
  font-size: 1.1rem;
  font-weight: var(--font-weight-medium);
  color: var(--text-color-secondary);
  border-left: 3px solid var(--color-border-primary);
  padding-left: 8px;
  margin-bottom: 10px;
}

/* 空分类占位文案。 */
.friends-empty {
  color: var(--text-color-secondary);
  font-size: var(--font-size-md);
  padding: 8px 0;
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
