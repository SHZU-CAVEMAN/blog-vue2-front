<template>
    <!--（每篇文章的）评论展示列表-->
    <div v-bind:class="{ comment: true }">
        <h5>{{ commentListByProps.length }} 条评论</h5>

        <!-- 顶部编辑框固定 -->
        <comment-edit :parentId="null" :articleId="articleId"/>

        <hr style="margin:5vh 0 2vh 0" />

        <!-- 评论展示列表 （v-for） -->
        <div v-for="Acomment in commentListByProps" :key="Acomment.id" class="comment-row">
            <!-- 一级评论 -->
            <!-- parentId 为空表示一级评论。 -->
            <div v-if="!Acomment.parentId" class="comment_item">
                <img :src="avatarUrl(Acomment.avatar)" />
                <div class="content">
                    <div class="content_name">
                        {{ Acomment.nickname }}
                    </div>

                    <v-md-editor v-model="Acomment.content" mode="preview" class="comment-preview" style="font-size: 14px;margin-top: 1vh;border:0;height: auto;"/>

                    <div style="display: flex; align-items: center">
                        {{ Acomment.comment_time }}
                        <a href="https://www.baidu.com" target="_blank" class="ip">Changsha</a>
                        <!-- 点击出现评论框 -->
                        <div class="replyTo" @click="replyTo(Acomment.id, Acomment)">
                            回复
                        </div>
                    </div>
                </div>
                <!-- 以下评论框点击则显示，再次点击则收回 -->
                <div v-if="isShow && Acomment.id == isShowId" class="isCommentEdit">
                    <comment-edit :parentId="parentId" :articleId="articleId"/>
                </div>
            </div>

            <!-- 二级评论 -->
            <!-- 遍历每个一级评论时，取出是否有相应的二级评论（再次遍历） -->
            <div v-for="Bcomment in commentListByProps" :key="Bcomment.id" class="child-comment-wrap">

                <div v-if="Bcomment.id !== Acomment.id && Bcomment.rootParentId == Acomment.id" class="comment_item">
                    <img :src="avatarUrl(Bcomment.avatar)" />
                    <div class="content">
                        <div style="display: flex;align-items: center;">
                            <div class="content_name">
                                {{ Bcomment.nickname }}
                            </div>
                            <a-icon type="caret-right"
                                style="font-size: 2.5vh;margin-left: 3vh;color:rgb(170, 170, 170);" />
                            <div class="content_name" style="margin-left: 3vh;">
                                {{ Bcomment.replyToNickname }}
                            </div>
                        </div>

                        <v-md-editor v-model="Bcomment.content" mode="preview" class="comment-preview" style="font-size: 14px;margin-top: 1vh;height:auto;border:0;"/>


                        <div style="display: flex; align-items: center">
                            {{ Bcomment.comment_time }}
                            <a href="https://www.baidu.com" target="_blank" class="ip">Hong Kong</a>
                            <div class="replyTo" @click="replyTo(Bcomment.id, Bcomment)">
                                回复
                            </div>
                        </div>
                    </div>
                    <!-- 以下评论框点击则显示，再次点击则收回 -->
                    <div v-if="isShow && Bcomment.id == isShowId" class="isCommentEdit">
                        <comment-edit :parentId="parentId" :articleId="articleId"/>
                    </div>
                </div>

            </div>
            <!-- 二级评论结束 -->

        </div>
        <!-- 整个评论展示列表 结束 -->
    </div>
</template>

<script>
// 评论编辑组件，点击 “回复” 展开
import commentEdit from "./commentEdit.vue";

export default {
    name: "commentComponent",
    components: {
        commentEdit,
    },
    props: ["articleId"],
    computed: {
        // 评论数据统一从 Vuex 读取，避免和父组件 props 并存。
        allComments() {
            return this.$store.state.comment.commentdata || [];
        },
    },
    data() {
        return {
            isShow: false,
            isShowId: 0,
         
            likeNumber: "", // 某条评论的点赞数量（此功能暂废弃 ————7.13）
            commentListByProps: [], //当前文章的评论数据 
            // theme:'',
            isLike: false,
            isLikeId: "",

            flag: "",
            parentId: null,

        };
    },

    // 监听 Vuex 评论数据，有变化就立马更新。
    watch: {
        allComments: {
            // 对 allComments（所有评论数据）进行过滤，得到当前文章的评论数据 commentListByProps
            handler() {
                // 每次变更都重新生成列表，避免 push 导致重复累积。
                this.commentListByProps = this.getCurrentArticleComments();
            },
            deep: true,
            immediate: true,
        },
        articleId() {
            // 当路由切换到不同文章时，重新过滤评论数据。
            this.commentListByProps = this.getCurrentArticleComments();
        },
    },
    methods: {
        // 统一封装过滤逻辑，便于 watch/后续逻辑复用。
        getCurrentArticleComments() {

            if (!Array.isArray(this.allComments)) {
                return [];
            }
            
            const currentArticleId = Number(this.articleId);
            // 过滤出当前文章的评论（包括一级和二级），并按时间排序。
            const comments = this.allComments
                .filter((item) => Number(item.article_id) === currentArticleId);

            // 如：nicknameById[101] 得到 "张三"
            const nicknameById = comments.reduce((acc, item) => {
                acc[item.id] = item.nickname;
                return acc;
            }, {});

            // 兼容不同命名方式，统一拿到父评论 id。
            const normalizeParentId = (item) => item.parentId ?? item.parent_id ?? item.parentID ?? null;

            // 如：parentById[101] 得到 100（父评论 id），如果是一级评论则为 null。
            const parentById = comments.reduce((acc, item) => {
                acc[item.id] = normalizeParentId(item) || null;
                return acc;
            }, {});
            
            // 计算某条评论所属的一级评论 id，保证回复二级评论时仍展示在同一讨论串。
            const getRootParentId = (id) => {
                let currentId = id;
                let parentId = parentById[currentId];
                const visited = {};
                // 防止循环引用导致死循环，记录已访问的评论 id。
                while (parentId) {
                    if (visited[parentId]) {
                        break;
                    }
                    visited[parentId] = true;
                    currentId = parentId;
                    parentId = parentById[currentId];
                }
                return currentId;
            };
            
            return comments.map((item) => ({
                ...item,
                parentId: normalizeParentId(item),
                rootParentId: getRootParentId(item.id),
                replyToNickname: normalizeParentId(item) ? (nicknameById[normalizeParentId(item)] || "") : "",
            }));
        },
        avatarUrl(fileName) {
            return `/api/files/${encodeURIComponent(fileName)}`;
        },
        replyTo(id, comment) {
            // 允许被无参调用（例如总线触发关闭），防止访问 undefined 报错。
            if (!comment) {
                this.closeCommentEdit();
                return;
            }
            //以下两行代码的作用是：每次点击reply to时，只会有相应的评论会展开一个评论框，而不是每个。
            this.isShow = !this.isShow;
            this.isShowId = id;

            // 精确回复：parentId 永远指向“当前点击的那条评论”。
            this.parentId = comment.id;
        },
        // 总线关闭事件专用处理器：只负责收起编辑框。
        closeCommentEdit() {
            this.isShow = false;
            this.isShowId = 0;
            this.parentId = null;
        },

    },
    created() {
        //props传入的数据在 created阶段已经有了。
        // 绑定语义匹配的处理器，避免事件参数与 Replyto 签名不一致。
        this.$bus.$on("closeCommentEdit", this.closeCommentEdit);

    },
    beforeDestroy() {
        // 组件销毁时解绑，避免重复绑定和内存泄漏。
        this.$bus.$off("closeCommentEdit", this.closeCommentEdit);
    },
};
</script>

<style scoped>
/* 评论主容器：桌面端与正文保持同一宽度体系（60% + 20% 居中偏移）。 */
.comment {
    background-color: var(--color-bg-surface);
    width: 60%;
    min-height: 30vh;
    margin-left: 20%;
    margin-top: 2.5vh;
    border: 1px solid var(--color-border-primary);
    padding: clamp(12px, 2vh, 22px);
    border-radius: 1vh;
    box-sizing: border-box;
}

/* 单条评论项：头像 + 内容的稳定横向布局。 */
.comment_item {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 10px;
    margin-top: 1%;
    background-color: var(--color-bg-muted);
    padding: 10px;
    border-radius: 8px;

}

/* 评论头像固定尺寸，避免在不同设备上被文字挤压变形。 */
img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    flex: 0 0 44px;

}

/* 评论正文区自适应扩展，支持长文本折行。 */
.content {
    margin-left: 0;
    width: auto;
    display: block;
    flex: 1 1 calc(100% - 54px);
    min-width: 0;
}
.content_name{
    font-size: 1rem;
    color: var(--text-color-primary);
    /* font-weight: 540; */
}
.isCommentEdit {
    /* 强制回复编辑框占据新行，显示在当前评论项下方。 */
    flex-basis: 100%;
    width: 100%;
    margin-top: 2vh;
    margin-left: 54px;
}

.child-comment-wrap {
    /* 二级评论整体缩进，形成层级关系。 */
    margin-left: 5%;
}


.replyTo {
    /* 回复入口与时间/IP拉开视觉距离。 */
    margin-left: 3vh;
}

.replyTo:hover {
    color: var(--interactive-text-active);
    font-weight: 550; 
}
.ip{
    /* IP 文案次级强调，避免抢占正文注意力。 */
    margin-left: 3vh;
    color:var(--interactive-text-rest)
}
.ip:hover{
    color: var(--interactive-text-active);
    font-weight: 550; 

}

.comment-row {
    /* 每一层评论行独立承载主题背景，避免父容器与子容器混色。 */
    background-color: var(--color-bg-surface);
}

.comment-preview {
    /* 覆盖 v-md-editor 预览区默认浅色背景，让评论正文跟随主题。 */
    background-color: var(--color-bg-muted) !important;
}

/* 平板/小屏：评论容器切换到全宽，层级缩进收窄。 */
@media (max-width: 1200px) {
    .comment {
        width: auto;
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 12px;
        border-radius: 8px;
        padding: 12px;
    }

    .child-comment-wrap {
        /* 小屏减少二级缩进，保留正文可读宽度。 */
        margin-left: 18px;
    }

    .comment_item {
        /* 小屏保持紧凑内边距，降低视觉拥挤。 */
        padding: 10px;
    }
}

/* 手机窄屏：头像进一步缩小，避免挤占正文宽度。 */
@media (max-width: 576px) {
    .comment {
        padding: 10px;
    }

    img {
        width: 36px;
        height: 36px;
        flex-basis: 36px;
    }

    .child-comment-wrap {
        margin-left: 12px;
    }

    .isCommentEdit {
        margin-left: 0;
    }
}
</style>