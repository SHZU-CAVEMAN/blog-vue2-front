<template>
    <!--评论编辑按钮-->
    <div>
        <comment-user-info v-if="visible" :toWhich="toWhich" :toWhom="toWhom" :articleName="articleName"
            :comment="comment" />

        <v-md-editor v-model="comment" :autofocus='autofocus' left-toolbar="undo | image  emoji" :disabled-menus="[]"
            placeholder="欢迎评论" right-toolbar="preview" @upload-image="handleUploadImage" class="editor" />

        <div style="display: flex; margin-top: 2vh;justify-content: space-between;">

            欢迎 止水 归来！

            <!-- <a-popover placement="topLeft" trigger="click">
                <template slot="content">
                    <h6 class="userInfo_character">昵称</h6>
                    <input type="text" placeholder="必填" v-model="nickname" class="userInfo_item" />
                    <h6 class="userInfo_character">邮箱</h6>
                    <input type="text" placeholder="必填" v-model="email" class="userInfo_item" />
                    <h6 class="userInfo_character">其他</h6>
                    <input type="text" placeholder="选填" v-model="other" class="userInfo_item" />
                </template>

                <div class="button">简略信息</div>

            </a-popover> -->

            <!-- todo:如果评论编辑板是最上层的那个，则不需要有“取消”这个按钮 -->
            <div class="button" style="margin-left:50%;" @click="cancel">取消</div>
            <div class="button" style="" @click="commit">提交评论</div>

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
    props: ["toWhich", "toWhom", "articleName"],
    data() {
        return {
            comment: "", //评论框收集
            nickname: "", //评论框收集
            email: "", //评论框收集
            other: "", //评论框收集
            time: "", //系统收集
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
            // set(val) {
            //     this.setVisible(val);
            // },
        },
    },
    methods: {
        handleUploadImage(event, insertImage, files) {
            // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
            console.log(files);

            // 此处只做示例
            insertImage({
                url: "https://vip.helloimg.com/images/2023/11/01/oOKhMc.jpg",
                desc: "天山天池",
                width: "300",
                height: "auto",
            });
        },
        cancel() {
            // console.log("cancel");
            this.$bus.$emit("closeCommentEdit")//不传值
        },
        show(data) {
            //关闭邮箱验证组件commentUserInfo
            this.visible = data;
            // console.log("执行了执行了执行了执行了执行了执行了执行了执行了执行了执行了")
        },
        test() {

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
            let date = new Date();
            this.time = date.toLocaleString();
            if (this.avatar == '') {
                this.avatar = Math.floor(Math.random() * 9 + 1)+'.jpg';
            }
            // console.log('最终数据', this.nickname, this.email, this.avatar, this.articleName, this.time)
            axios({
                method: "post",
                url: "/comment/add",
                data: {
                    // 来自子组件的三项数据：
                    nickname: this.nickname,
                    email: this.email,
                    avatar: this.avatar,
                    //来自于自身的三项数据：
                    other: this.other, //可以为空(此属性可以更改为IP)
                    comment: this.comment,
                    time: this.time,
                    // 来自父组件的三项数据：
                    article: this.articleName, //评论所属的文章名（唯一）
                    toWhich: this.toWhich || '', //可以为空，为空，则表示这是一个一级评论（支持两级评论）
                    toWhom: this.toWhom || '',
                },
            }).then((res) => {

            });
        },
        commit() {
            //1 若是初次登录，则进入commentUserInfo组件，在commentUserInfo组件中填写信息并提交评论。
            if(this.comment == ''){
                alert("评论不能为空");
            }else{
                this.visible = true;
            }
            //2 若本地存储已有游客信息，则取出身份信息后直接提交评论。

        },

    },
    created() {
        console.log('commitEdit', this.toWhich, this.toWhom, this.articleName)
        // this.$bus.$on("commentUserInfoShow", (data) => {
        //     //关闭邮箱验证组件commentUserInfo
        //     this.visible = data;
        //     console.log("执行了执行了执行了执行了执行了执行了执行了执行了执行了执行了")
        // })
        // 之前执行两遍，这下又好了。有你是我的服气。
        this.$bus.$on("commentUserInfoShow", this.show)
        //接收子组件的nickname和email数据
        this.$bus.$on("commentUserInfo", this.info)


    },

}
</script>

<style scoped>
.editor {
    height: 25vh;
    /* background-color: #EFF2F5; */
    border: 1px solid rgb(178, 178, 178);
    /* 覆盖原有的阴影的样式 */
    box-shadow: 0vh 0vh 0vh rgb(143, 143, 143);
}

.userInfo_character {
    color: dimgray;
    margin-bottom: 1px;
    font-size: 2.5vh
}

.userInfo_item {
    margin-bottom: 1vh;
    border-radius: 1vh;
    border: 1px solid rgb(136, 136, 136);
}

.brief {
    width: 12vh;
    height: 5vh;
    background-color: #f6f8fa;
    border: 1px solid rgb(208, 215, 222);
    /* border-radius: 1vh; */
    margin-left: 70%;
    display: flex;
    align-items: center;
    padding: 1vh;
}

.brief:hover {
    /* background-color: #F3F4F6; */
    background-color: #ffffff;
    color: white;
}

.button {
    /* width: 12vh; */
    height: 4vh;
    background-color: #ffffff;
    border: 1px solid rgb(196, 201, 206);
    border-radius: 1vh;
    /* margin-left: 5vh; */
    display: flex;
    align-items: center;
    padding: 2vh;
    /* box-shadow: 1px 1px 1px rgb(152, 152, 152); */
    background-color: #f3f3f3;
    color: rgb(0, 0, 0);

}

.button:hover {
    background-color: rgb(99, 99, 99);
    color: white;
}
</style>