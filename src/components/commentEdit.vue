<template>
    <!--评论编辑按钮-->
    <div>
        <!-- 编辑评论时要进行信息验证 -->
        <comment-user-info v-if="visible" :comment="comment" />
            
        <!-- 评论辑主要界面 -->
        <v-md-editor v-model="comment" :autofocus='autofocus' left-toolbar="undo | image  emoji" :disabled-menus="[]"
            placeholder="欢迎评论（评论框右上角可开启预览）" mode="edit" right-toolbar="preview" @upload-image="handleUploadImage" class="editor" />

        <div class="comment-edit-actions">
            <span>欢迎归来！</span>
            <div class="comment-edit-buttons">
                <!-- todo:如果评论编辑板是最上层的那个，则不需要有“取消”这个按钮 -->
                <!-- 使用通用按钮组件，统一全站按钮样式与交互。 -->
                <common-button @click="cancel">取消</common-button>
                <!-- primary 语义按钮：强调提交操作。 -->
                <common-button variant="primary" @click="commit">提交评论</common-button>
            </div>
        </div>


    </div>
</template>

<script>
import commentUserInfo from './commentUserInfo.vue';

export default {
    name: "commentEditComponent",
    components: {
        commentUserInfo
    },
    props: ["parentId", "articleId"],
    data() {
        return {
            comment: "", //评论框收集
            nickname: "", //评论框收集
            email: "", //评论框收集
            avatar: "", // 系统随机分配

            visible: false,
            autofocus: true,
        }
    },
    watch: {
        visible: {
            handler() {
                return this.$store.state.comment.isVisible;
            },
        },
    },
    methods: {
        handleUploadImage(event, insertImage) {
            // 拿到文件后上传到文件服务器，然后向编辑框中插入对应内容。

            // 此处只做示例
            insertImage({
                url: "https://vip.helloimg.com/images/2023/11/01/oOKhMc.jpg",
                desc: "天山天池",
                width: "300",
                height: "auto",
            });
        },
        cancel() {
            // 收起当前回复编辑框（由评论列表组件监听关闭）。
            this.$bus.$emit("closeCommentEdit") //不传值
        },
        show(data) {
            //关闭邮箱验证组件commentUserInfo
            this.visible = data;
        },
        info(data) {
            this.email = data.email;
            this.nickname = data.nickname;
            this.avatar = data.avatar;
            // console.log("已接收来自子组件的数据", this.email, this.nickname, this.avatar);
            //提交最终的评论数据
            this.commitComment();
        },
        commitComment() {
            if (this.avatar == '') {
                this.avatar = Math.floor(Math.random() * 9 + 1)+'.jpg';
            }
            // 提交评论：合并用户信息、评论内容、文章上下文后发送。
            const numericArticleId = Number(this.articleId);
            const parentId = this.parentId ? Number(this.parentId) : null;

            this.$api.comment.add({
                articleId: Number.isNaN(numericArticleId) ? this.articleId : numericArticleId,
                parentId: Number.isNaN(parentId) ? null : parentId,
                nickname: this.nickname,
                avatar: this.avatar,
                email: this.email,
                content: this.comment,
            }).then(() => {
                //console.log("提交评论成功");
                this.$message.success("提交评论成功");
                // 评论提交成功后通知根组件刷新评论列表，保证当前页面实时可见。
                this.$bus.$emit("commentAdded");
                // 重置编辑器内容并关闭信息弹窗，避免重复提交旧内容。
                this.comment = "";
                this.visible = false;
            }).catch((err) => {
                // 手动上报评论提交异常，携带文章和回复上下文，方便后续定位具体失败场景。
                this.$reportError("comment-submit-failed", err, {
                    module: "commentEdit",
                    articleId: this.articleId,
                    parentId: this.parentId || null,
                    hasCommentContent: !!this.comment,
                });
            });
        },
        commit() {
            //1 若是初次登录，则进入commentUserInfo组件，在commentUserInfo组件中填写信息并提交评论。
            if(this.comment == ''){
                this.$message.warning("评论不能为空");
            }else{
                this.visible = true;
            }
            //2 todo：若本地存储已有游客信息，则取出身份信息后直接提交评论。

        },

    },
    created() {
        // console.log('commitEdit', this.parentId, this.articleId)
        // 之前执行两遍，这下又好了。
        this.$bus.$on("commentUserInfoShow", this.show)
        //接收子组件的nickname和email数据
        this.$bus.$on("commentUserInfo", this.info)
    },
    beforeDestroy() {
        this.$bus.$off("commentUserInfoShow", this.show);
        this.$bus.$off("commentUserInfo", this.info);
    },

}
</script>

<style scoped>
.editor {
    /* 评论编辑器边框改为主题变量，暗色模式下不会出现突兀浅边框。 */
    height: 25vh;
    /* background-color: #EFF2F5; */
    border: 1px solid var(--color-border-primary);
    /* 覆盖原有的阴影的样式 */
    box-shadow: 0vh 0vh 0vh rgb(143, 143, 143);
}

.userInfo_character {
    color: var(--text-color-secondary);
    margin-bottom: 1px;
    font-size: 2.5vh
}

.userInfo_item {
    margin-bottom: 1vh;
    border-radius: 1vh;
    border: 1px solid var(--color-border-primary);
}

.brief {
    /* 提示块使用 muted/surface 两档背景，hover 时层次更清晰。 */
    width: 12vh;
    height: 5vh;
    background-color: var(--color-bg-muted);
    border: 1px solid var(--color-border-primary);
    /* border-radius: 1vh; */
    margin-left: 70%;
    display: flex;
    align-items: center;
    padding: 1vh;
}

.brief:hover {
    background-color: var(--color-bg-surface);
    color: var(--interactive-text-active);
}

.comment-edit-actions {
    /* 编辑器底部操作区：左提示文案 + 右按钮组。 */
    display: flex;
    margin-top: 2vh;
    justify-content: space-between;
    align-items: center;
}

.comment-edit-buttons {
    /* 按钮组采用横向排列，按钮间留固定间距。 */
    display: flex;
    gap: 10px;
}

@media (max-width: 576px) {
    .comment-edit-actions {
        /* 小屏改为纵向堆叠，避免按钮和文案挤压。 */
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
}
</style>