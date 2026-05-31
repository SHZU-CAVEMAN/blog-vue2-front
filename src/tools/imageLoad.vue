<template>
    <div class="image-load">
        <!-- 占位图始终保留在文档流里，用于撑开容器高度，避免高度塌陷 -->
        <img
            class="placeholder"
            :src="placeholderSrc"
            alt=""
            aria-hidden="true"
            :style="placeholderStyle"
        />
        <!-- 显示原图 -->
        <img
            ref="origin"
            class="origin"
            :src="originSrc"
            alt=""
            @load="handleLoad"
            :style="originStyle"
        />
    </div>
</template>

<script>
export default {
    name: "imageLoad",
    props: {
        // 原图地址
        src: {
            type: String,
            required: true,
        },
        // 占位图地址（可选，不传则退回使用原图）
        placeholder: {
            type: String,
            default: "",
        },
        // 原图淡入动画时长
        duration: {
            type: Number,
            default: 500,
        },
    },
    data() {
        return {
            // 实际绑定到原图 <img> 的地址，触发加载时才赋值
            originSrc: "",
            // 原图是否已完成加载
            loaded: false,
            // IntersectionObserver 实例
            observer: null,
            // scroll 回退方案下的监听函数
            scrollHandler: null,
            // 防止重复触发加载
            didStartLoad: false,
        };
    },
    computed: {
        // 占位图优先使用 placeholder，未提供则回退原图
        placeholderSrc() {
            return this.placeholder || this.src;
        },
        // 原图未完成加载前，持续显示占位图
        showPlaceholder() {
            return !this.loaded;
        },
        // 占位图加载后淡出，但保留布局高度
        placeholderStyle() {
            return {
                opacity: this.loaded ? 0 : 1,
                transition: `opacity ${this.duration}ms ease`,
            };
        },
        // 原图样式：加载完成后淡入显示
        originStyle() {
            return {
                opacity: this.loaded ? 1 : 0,
                transition: `opacity ${this.duration}ms ease`,
            };
        },
    },
    watch: {
        src: {
            handler() {
                // 外部切换图片时，重置并重新走懒加载流程
                this.resetState();
                this.initLazyLoad();
            },
        },
    },
    methods: {
        // 清空当前加载状态，准备下一次图片加载
        resetState() {
            this.originSrc = "";
            this.loaded = false;
            this.didStartLoad = false;
            this.teardownLazyLoad();
        },
        // 原图 load 事件：显示原图并释放监听资源
        handleLoad() {
            this.loaded = true;
            this.$emit("load");
            this.teardownLazyLoad();
        },
        // 判断组件是否进入（或接近）可视区域
        isInViewport() {
            if (!this.$el) return false;
            const rect = this.$el.getBoundingClientRect();
            const viewHeight =
                window.innerHeight || document.documentElement.clientHeight;
            return rect.top < viewHeight + 100 && rect.bottom > -100;
        },
        // 懒加载真正触发点：把原图地址赋给 img
        startLoad() {
            if (this.didStartLoad) return;
            this.didStartLoad = true;
            this.originSrc = this.src;
        },
        // scroll 回退方案：滚动时检测是否进入可视区
        onScrollCheck() {
            if (this.isInViewport()) {
                this.startLoad();
            }
        },
        // 节流，避免 scroll 高频触发带来的性能开销
        throttle(fn, delay) {
            let timer = null;
            return (...args) => {
                if (timer) return;
                timer = setTimeout(() => {
                    fn.apply(this, args);
                    timer = null;
                }, delay);
            };
        },
        initLazyLoad() {
            if (!this.src) return;
            // 优先使用 IntersectionObserver（性能更好）
            if (typeof window !== "undefined" && "IntersectionObserver" in window) {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            this.startLoad();
                            if (this.observer) {
                                this.observer.disconnect();
                                this.observer = null;
                            }
                        }
                    });
                });
                this.observer.observe(this.$el);
                // 某些布局场景下 observer 首次回调会延后，先做一次首屏兜底检查。
                this.onScrollCheck();
                return;
            }
            // 兼容回退：老环境使用 scroll + 节流方案
            this.scrollHandler = this.throttle(this.onScrollCheck, 120);
            window.addEventListener("scroll", this.scrollHandler, { passive: true });
            // 初始化时先检查一次，保证首屏可见图能立即加载
            this.onScrollCheck();
        },
        // 清理 observer / scroll 监听，避免内存泄漏
        teardownLazyLoad() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.scrollHandler) {
                window.removeEventListener("scroll", this.scrollHandler);
                this.scrollHandler = null;
            }
        },
    },
    mounted() {
        // 组件挂载后启动懒加载
        this.initLazyLoad();
    },
    beforeDestroy() {
        // 组件销毁前释放监听资源
        this.teardownLazyLoad();
    },
};
</script>

<style scoped>
.image-load {
    /* 作为绝对定位原图的参照 */
    position: relative;
    /* 让内部图片在容器内居中对齐 */
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    /* 裁剪溢出区域 ：占位图有 transform: scale(1.02)*/
    overflow: hidden;
}

.placeholder,
.origin {
    /* 默认占满容器宽度，高度由图片比例自动撑开 */
    width: 100%;
    /* img 默认类似 inline，会在底部留一点空白（和文字对齐导致），block 可避免这种莫名缝隙。 */
    display: block;
    /* 配合父容器 flex，确保图片在水平方向居中 */
    margin: 0 auto;
}

.placeholder {
    /* 占位图轻微模糊，营造渐进加载视觉 */
    filter: blur(10px);
    /* 模糊边缘会收缩，轻微放大避免边缘露白 */
    transform: scale(1.02);
}

.origin {
    /* 原图覆盖在占位图之上，通过 opacity 做淡入 */
    position: absolute;
    /* 铺满容器四边：等价于 top/right/bottom/left: 0，表示原图贴满父容器四边 */
    inset: 0;
    /* 在铺满区域内保持居中：铺满效果（inset:0 + width:100%） */
    margin: auto;
}
</style>
  