<template>
  <div :class="['common-pagination', `theme-${resolvedTheme}`]">
    <a-pagination
      :current="innerCurrent"
      :pageSize="innerPageSize"
      :total="total"
      :show-size-changer="showSizeChanger"
      :page-size-options="pageSizeOptions"
      :show-quick-jumper="showQuickJumper"
      :show-total="showTotalText"
      @change="handleChange"
      @showSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
export default {
  name: "CommonPagination",
  data() {
    return {
      // auto 模式下同步 html[data-theme] 的实时值。
      autoTheme: "light",
      themeObserver: null,
    };
  },
  props: {
    // 总条数：由父组件传入，分页器据此计算页码。
    total: {
      type: Number,
      default: 0,
    },
    // 当前页：通过 .sync 与父组件双向同步。
    current: {
      type: Number,
      default: 1,
    },
    // 每页条数：支持父组件控制默认值与动态更新。
    pageSize: {
      type: Number,
      default: 20,
    },
    // 每页条数候选项，遵循 ant design 的字符串数组约定。
    pageSizeOptions: {
      type: Array,
      default: () => ["5", "10", "20", "30", "50"],
    },
    showSizeChanger: {
      type: Boolean,
      default: true,
    },
    showQuickJumper: {
      type: Boolean,
      default: true,
    },
    showTotal: {
      type: Boolean,
      default: true,
    },
    // 是否在切换每页条数时强制回到第一页：默认 false，尽量保持用户当前浏览位置。
    resetOnPageSizeChange: {
      type: Boolean,
      default: false,
    },
    // 组件级主题：light(日间) / dark(夜间) / auto(跟随全局 data-theme)。
    theme: {
      type: String,
      default: "auto",
      validator(value) {
        return ["light", "dark", "auto"].includes(value);
      },
    },
  },
  computed: {
    // 透传 current，保留统一命名，后续可扩展内部状态逻辑。
    innerCurrent() {
      return this.current;
    },
    // 透传 pageSize，避免模板直接耦合 props 字段。
    innerPageSize() {
      return this.pageSize;
    },
    resolvedTheme() {
      if (this.theme === "light" || this.theme === "dark") {
        return this.theme;
      }
      return this.autoTheme;
    },
  },
  mounted() {
    this.syncAutoTheme();
    this.bindThemeObserver();
  },
  beforeDestroy() {
    if (this.themeObserver) {
      this.themeObserver.disconnect();
      this.themeObserver = null;
    }
  },
  watch: {
    theme: {
      immediate: true,
      handler() {
        this.syncAutoTheme();
      },
    },
  },
  methods: {
    // 读取全局 data-theme，供 auto 模式实时使用。
    syncAutoTheme() {
      const rootTheme = document.documentElement.getAttribute("data-theme");
      this.autoTheme = rootTheme === "dark" ? "dark" : "light";
    },
    // 监听 html[data-theme] 变化，确保主题切换后分页立即更新。
    bindThemeObserver() {
      if (typeof MutationObserver === "undefined") return;
      if (this.themeObserver) {
        this.themeObserver.disconnect();
      }

      this.themeObserver = new MutationObserver(() => {
        this.syncAutoTheme();
      });

      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
    },
    // 自定义总数文案：显示当前区间与总条数。
    showTotalText(total, range) {
      if (!this.showTotal) return "";
      return `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`;
    },
    // 翻页触发：同步 current 和 pageSize，兼容父组件统一监听 change。
    handleChange(page, pageSize) {
      this.$emit("update:current", page);
      this.$emit("update:pageSize", pageSize);
      this.$emit("change", { page, pageSize });
    },
    // 修改每页条数：默认按“当前页首条数据位置”换算新页码；可选回到第一页。
    handleSizeChange(current, size) {
      const maxPage = Math.max(1, Math.ceil(this.total / size));
      // 旧分页下当前页的首条索引（从 1 开始），用于在新分页下定位到相近内容。
      const firstItemIndex = (this.current - 1) * this.pageSize + 1;
      const mappedPage = Math.ceil(firstItemIndex / size);
      const nextPage = this.resetOnPageSizeChange ? 1 : Math.min(mappedPage, maxPage);

      this.$emit("update:current", nextPage);
      this.$emit("update:pageSize", size);
      this.$emit("size-change", { page: nextPage, pageSize: size, previousPage: current });
      this.$emit("change", { page: nextPage, pageSize: size });
    },
  },
};
</script>

<style scoped>
.common-pagination {
  /* 外层只负责整体居中，不参与具体分页项皮肤。 */
  width: 100%;
  display: flex;
  justify-content: center;
}

.common-pagination.theme-light {
  /* 日间主题变量：统一驱动页码、按钮、输入框颜色。 */
  --pagination-bg: #ffffff;
  --pagination-bg-active: #ffffff;
  --pagination-border: #d9d9d9;
  --pagination-text: #595959;
  --pagination-text-active: #111111;
  --pagination-shadow-active: 0 0 0 2px rgba(24, 144, 255, 0.12);
}

.common-pagination.theme-dark {
  /* 夜间主题变量：深背景 + 低亮文字，避免高对比刺眼。 */
  --pagination-bg: #1f1f1f;
  --pagination-bg-active: #262626;
  --pagination-border: #434343;
  --pagination-text: #bfbfbf;
  --pagination-text-active: #f5f5f5;
  --pagination-shadow-active: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* scoped 样式下通过 /deep/ 穿透到 ant 内部结构，统一做布局修正。 */
.common-pagination /deep/ .ant-pagination {
  /* 让页码、前后页、总数、跳转输入保持同一行居中。 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0;
}

.common-pagination /deep/ .ant-pagination-item,
.common-pagination /deep/ .ant-pagination-prev,
.common-pagination /deep/ .ant-pagination-next,
.common-pagination /deep/ .ant-pagination-jump-prev,
.common-pagination /deep/ .ant-pagination-jump-next,
.common-pagination /deep/ .ant-pagination-options,
.common-pagination /deep/ .ant-pagination-options-quick-jumper {
  /* 把 Ant 默认 inline-block 提升为 inline-flex，统一垂直基线。 */
  display: inline-flex;
  align-items: center;
}

/* 恢复页码与前后页按钮的标准尺寸，避免按钮被压窄。 */
.common-pagination /deep/ .ant-pagination-item,
.common-pagination /deep/ .ant-pagination-prev,
.common-pagination /deep/ .ant-pagination-next {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
}

.common-pagination /deep/ .ant-pagination-item,
.common-pagination /deep/ .ant-pagination-prev .ant-pagination-item-link,
.common-pagination /deep/ .ant-pagination-next .ant-pagination-item-link {
  /* 基础皮肤走变量，保证 light/dark 切换时一次生效。 */
  background-color: var(--pagination-bg);
  border-color: var(--pagination-border);
}

.common-pagination.theme-dark /deep/ .ant-pagination-item,
.common-pagination.theme-dark /deep/ .ant-pagination-prev .ant-pagination-item-link,
.common-pagination.theme-dark /deep/ .ant-pagination-next .ant-pagination-item-link,
.common-pagination.theme-dark /deep/ .ant-pagination-jump-prev .ant-pagination-item-link,
.common-pagination.theme-dark /deep/ .ant-pagination-jump-next .ant-pagination-item-link {
  /* 夜间模式强化覆盖：防止被 Ant 内置浅色背景规则反向覆盖。 */
  background-color: var(--pagination-bg) !important;
  border-color: var(--pagination-border) !important;
}

.common-pagination /deep/ .ant-pagination-item a,
.common-pagination /deep/ .ant-pagination-prev .ant-pagination-item-link,
.common-pagination /deep/ .ant-pagination-next .ant-pagination-item-link,
.common-pagination /deep/ .ant-pagination-options-quick-jumper,
.common-pagination /deep/ .ant-pagination-total-text {
  /* 非激活态文字统一采用中性文字色。 */
  color: var(--pagination-text);
}

.common-pagination /deep/ .ant-pagination-item-active {
  /* 当前页：用边框和轻阴影做状态强调，不依赖高饱和背景。 */
  background-color: var(--pagination-bg-active);
  border-color: var(--pagination-border);
  box-shadow: var(--pagination-shadow-active);
}

.common-pagination /deep/ .ant-pagination-item-active a {
  color: var(--pagination-text-active);
  font-weight: 600;
}

.common-pagination.theme-dark /deep/ .ant-pagination-item a,
.common-pagination.theme-dark /deep/ .ant-pagination-prev .ant-pagination-item-link,
.common-pagination.theme-dark /deep/ .ant-pagination-next .ant-pagination-item-link,
.common-pagination.theme-dark /deep/ .ant-pagination-jump-prev .ant-pagination-item-link,
.common-pagination.theme-dark /deep/ .ant-pagination-jump-next .ant-pagination-item-link,
.common-pagination.theme-dark /deep/ .ant-pagination-total-text,
.common-pagination.theme-dark /deep/ .ant-pagination-options-quick-jumper,
.common-pagination.theme-dark /deep/ .ant-pagination-options-quick-jumper input {
  /* 夜间文本强制覆盖，避免局部节点继承到浅色字体。 */
  color: var(--pagination-text) !important;
}

/* 使用统一的右间距，避免“前一页”与页码之间距离过大。 */
.common-pagination /deep/ .ant-pagination-item,
.common-pagination /deep/ .ant-pagination-prev,
.common-pagination /deep/ .ant-pagination-next,
.common-pagination /deep/ .ant-pagination-jump-prev,
.common-pagination /deep/ .ant-pagination-jump-next {
  margin-right: 8px;
}

/* 确保按钮内文本和图标处于几何中心。 */
.common-pagination /deep/ .ant-pagination-item a,
.common-pagination /deep/ .ant-pagination-prev .ant-pagination-item-link,
.common-pagination /deep/ .ant-pagination-next .ant-pagination-item-link {
  /* 把图标容器撑满按钮，保证箭头真正居中。 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* 统一下拉框与输入框高度，避免“每页条数”和“跳至”区域视觉下沉。 */
.common-pagination /deep/ .ant-pagination-options-size-changer,
.common-pagination /deep/ .ant-pagination-options-quick-jumper input {
  /* 与页码按钮保持同高，视觉更整齐。 */
  height: 32px;
}

.common-pagination /deep/ .ant-pagination-options-quick-jumper input,
.common-pagination /deep/ .ant-select-selection--single {
  /* 输入框/下拉框也走主题变量，避免夜间出现白底。 */
  background-color: var(--pagination-bg);
  border-color: var(--pagination-border);
  color: var(--pagination-text);
}

.common-pagination /deep/ .ant-pagination-options-size-changer .ant-select-selection--single {
  height: 32px;
}

.common-pagination /deep/ .ant-pagination-options-size-changer .ant-select-selection__rendered,
.common-pagination /deep/ .ant-pagination-options-size-changer .ant-select-selection-selected-value {
  /* 文字垂直居中到 32px 控件内部。 */
  line-height: 30px;
}
</style>
