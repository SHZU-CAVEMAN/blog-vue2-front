<template>
  <div class="friends-page">
    <div class="friends-card">
      <div class="friends-toolbar">
        <div v-if="friendsCategories.length" class="friends-category-tabs">
          <button
            type="button"
            class="friends-tab"
            :class="{ 'friends-tab-active': activeCategory === ALL_CATEGORY_KEY }"
            @click="switchCategory(ALL_CATEGORY_KEY)"
          >
            <span>全部</span>
            <span class="friends-tab-count">{{ allSitesCount }}</span>
          </button>

          <button
            v-for="group in friendsCategories"
            :key="group.category"
            type="button"
            class="friends-tab"
            :class="{ 'friends-tab-active': activeCategory === group.category }"
            @click="switchCategory(group.category)"
          >
            <span>{{ group.category }}</span>
            <span class="friends-tab-count">{{ group.sites.length }}</span>
          </button>
        </div>

        <div class="friends-actions">
          <common-button class="friends-apply-btn" variant="primary" @click="openApplyModal">+ 友链申请</common-button>
        </div>
      </div>

      <div v-if="currentGroup" class="friends-group">
        <div class="friends-category-title">{{ currentGroup.category }}</div>
        <div v-if="displayedSites.length" class="friends-grid">
          <a
            v-for="site in displayedSites"
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

      <div v-else class="friends-empty">暂无链接，敬请期待</div>
    </div>

    <common-modal
      v-model="applyModalVisible"
      title="提交友链申请"
      ok-text="提交申请"
      cancel-text="取消"
      :confirm-loading="submittingApply"
      @ok="submitApply"
      @cancel="handleApplyCancel"
    >
      <div class="apply-form">
        <label class="apply-label" for="friend-name">网站名称</label>
        <input
          id="friend-name"
          v-model.trim="applyForm.name"
          class="apply-input"
          type="text"
          maxlength="60"
          placeholder="请输入网站名称"
        />

        <label class="apply-label" for="friend-url">网站链接</label>
        <input
          id="friend-url"
          v-model.trim="applyForm.url"
          class="apply-input"
          type="text"
          maxlength="255"
          placeholder="https://example.com"
        />

        <label class="apply-label" for="friend-description">网站说明</label>
        <textarea
          id="friend-description"
          v-model.trim="applyForm.description"
          class="apply-textarea"
          rows="4"
          maxlength="300"
          placeholder="请简要介绍一下你的网站内容"
        ></textarea>
      </div>
    </common-modal>
  </div>
</template>

<script>
export default {
  name: "friendsComponent",
  data() {
    const ALL_CATEGORY_KEY = "__all__";
    return {
      ALL_CATEGORY_KEY,
      // 友链数据改为后端驱动：页面只做渲染与分组。
      friendsCategories: [],
      activeCategory: ALL_CATEGORY_KEY,
      applyModalVisible: false,
      submittingApply: false,
      applyForm: {
        name: "",
        url: "",
        description: "",
      },
    };
  },
  computed: {
    allSites() {
      return this.friendsCategories.reduce((acc, group) => {
        if (Array.isArray(group.sites)) {
          return acc.concat(group.sites);
        }
        return acc;
      }, []);
    },
    allSitesCount() {
      return this.allSites.length;
    },
    currentGroup() {
      if (!this.friendsCategories.length) return null;

      if (this.activeCategory === this.ALL_CATEGORY_KEY) {
        return {
          category: "全部",
          sites: this.allSites,
        };
      }

      const current = this.friendsCategories.find((group) => group.category === this.activeCategory);
      return current || this.friendsCategories[0];
    },
    displayedSites() {
      return this.currentGroup ? this.currentGroup.sites : [];
    },
  },
  methods: {
    openApplyModal() {
      this.applyModalVisible = true;
    },
    handleApplyCancel() {
      this.applyModalVisible = false;
    },
    resetApplyForm() {
      this.applyForm = {
        name: "",
        url: "",
        description: "",
      };
    },
    normalizeUrl(rawUrl) {
      const input = (rawUrl || "").trim();
      if (!input) return "";
      if (/^https?:\/\//i.test(input)) return input;
      return `https://${input}`;
    },
    validateApplyForm() {
      if (!this.applyForm.name) {
        this.$message.warning("请输入网站名称");
        return false;
      }
      if (!this.applyForm.url) {
        this.$message.warning("请输入网站链接");
        return false;
      }
      if (!this.applyForm.description) {
        this.$message.warning("请输入网站说明");
        return false;
      }

      const normalizedUrl = this.normalizeUrl(this.applyForm.url);
      try {
        const parsedUrl = new URL(normalizedUrl);
        if (!/^https?:$/i.test(parsedUrl.protocol)) {
          this.$message.warning("链接仅支持 http 或 https");
          return false;
        }
      } catch (error) {
        this.$message.warning("请输入正确的网站链接");
        return false;
      }

      this.applyForm.url = normalizedUrl;
      return true;
    },
    submitApply() {
      if (this.submittingApply) return;
      if (!this.validateApplyForm()) return;

      this.submittingApply = true;
      // 提交申请到后端，后端会进行审核。
      this.$api.friendlink.create({
        name: this.applyForm.name,
        url: this.applyForm.url,
        description: this.applyForm.description,
      })
        .then(() => {
          this.$message.success("申请已提交，感谢你的支持");
          this.applyModalVisible = false;
          this.resetApplyForm();
          this.loadFriendlinks();
        })
        .catch((err) => {
          if (this.$reportError) {
            this.$reportError("friendlink-apply-submit-failed", err, {
              module: "friends",
              url: this.applyForm.url,
            });
          }
          this.$message.error(err.message || "提交失败，请稍后重试");
        })
        .finally(() => {
          this.submittingApply = false;
        });
    },
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
      if (!groups.length) {
        this.activeCategory = this.ALL_CATEGORY_KEY;
        return;
      }

      const currentExists = this.activeCategory === this.ALL_CATEGORY_KEY
        || groups.some((group) => group.category === this.activeCategory);
      if (!currentExists) {
        this.activeCategory = this.ALL_CATEGORY_KEY;
      }
    },
    switchCategory(category) {
      this.activeCategory = category;
    },
    loadFriendlinks() {
      // 友链请求
      this.$api.friendlink.getAll()
      .then((res) => {
          const rows = this.resolveRowsFromResponse(res);
          this.groupFriendlinks(rows);
      }).catch((err) => {
          this.friendsCategories = [];
          this.activeCategory = this.ALL_CATEGORY_KEY;
          if (this.$reportError) {
            this.$reportError("friendlink-list-fetch-failed", err, {
              module: "friends",
            });
          }
          this.$message.warning("友链加载失败"+err.message);

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

.friends-actions {
  margin-left: auto;
  flex-shrink: 0;
}

.friends-toolbar {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;
}

.friends-category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.friends-tab {
  border: 1px solid var(--color-border-primary);
  border-radius: 5px;
  background-color: var(--color-bg-muted);
  color: var(--interactive-text-rest);
  padding: 6px 12px;
  font-size: var(--font-size-md);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.friends-tab:hover {
  background-color: var(--color-bg-surface);
  color: var(--interactive-text-active);
}

.friends-tab-active {
  background-color: var(--color-bg-surface);
  color: var(--interactive-text-active);
  border-color: var(--interactive-text-active);
}

.friends-tab-count {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background-color: #eaeef2;
  color: #57606a;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}

.friends-tab-active .friends-tab-count {
  background-color: #dff3ff;
  color: var(--interactive-text-active);
}

.friends-apply-btn:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}

.apply-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.apply-label {
  color: var(--text-color-secondary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
}

.apply-input,
.apply-textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--color-border-primary);
  border-radius: 8px;
  padding: 8px 10px;
  outline: none;
  background-color: var(--color-bg-surface);
  color: var(--text-color-primary);
}

.apply-input:focus,
.apply-textarea:focus {
  border-color: var(--interactive-text-active);
}

.apply-textarea {
  resize: vertical;
  min-height: 90px;
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
  .friends-toolbar {
    flex-wrap: wrap;
  }

  .friends-actions {
    margin-left: 0;
  }

  .friends-grid {
    grid-template-columns: 1fr;
  }
}
</style>
