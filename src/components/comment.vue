<template>
    <!--（每篇文章的）评论展示列表-->
    <div v-bind:class="{ comment: true }">
        <h5>{{ commentListByProps.length }} 条评论</h5>

        <comment-edit :toWhich="toWhich" :toWhom="toWhom" :articleName="name"/>

        <hr style="margin:5vh 0 2vh 0" />

        <!-- 评论展示列表 （v-for） -->
        <div v-for="Acomment in commentListByProps" :key="Acomment.id" style="background-color: #ffffff">
            <!-- 一级评论 -->
            <!-- 如果toWhich无值，则-->
            <div v-if="!Acomment.toWhich" class="comment_item">
                <img :src="pictureUrl + Acomment.avatar " />
                <div class="content">
                    <!-- <h6>{{ Acomment.nickname }}</h6> -->
                    <div class="content_name">
                        {{ Acomment.nickname }}
                    </div>

                    <!-- <h6 style="font-size: 14px;margin-top: 1vh;">
                        {{ Acomment.comment }}
                    </h6> -->


                    <v-md-editor v-model="Acomment.comment" mode="preview"  style="font-size: 14px;margin-top: 1vh;background-color:#EFF2F5 ;border:0;height: auto;"/>

                    <div style="display: flex; align-items: center">
                        {{ Acomment.time }}
                        <a href="https://www.baidu.com" target="_blank" class="ip">Changsha</a>
                        <!-- 点击出现评论框 -->
                        <div class="replyTo" @click="Replyto(Acomment.id, Acomment)">
                            回复
                        </div>
                    </div>
                </div>
                <!-- 以下评论框点击则显示，再次点击则收回 -->
                <div v-if="isShow && Acomment.id == isShowId" class="isCommentEdit">
                    <comment-edit :toWhich="toWhich" :toWhom="toWhom" :articleName="name"/>
                </div>
            </div>

            <!-- 二级评论 -->
            <!-- 遍历每个一级评论时，取出是否有相应的二级评论（再次遍历） -->
            <div v-for="Bcomment in commentListByProps" :key="Bcomment.id" style="margin-left: 8%;">

                <div v-if="Acomment.id == Bcomment.toWhich" class="comment_item">
                    <img :src="pictureUrl + Bcomment.avatar " />
                    <div class="content">
                        <div style="display: flex;align-items: center;">
                            <div class="content_name">
                                {{ Bcomment.nickname }}
                            </div>
                            <!-- <a-icon type="right" style="font-size:2vh;margin-left: 5vh;background-color: antiquewhite;"/> -->
                            <a-icon type="caret-right"
                                style="font-size: 2.5vh;margin-left: 3vh;color:rgb(170, 170, 170);" />
                            <div class="content_name" style="margin-left: 3vh;">
                                {{ Bcomment.toWhom }}
                            </div>
                        </div>

                        <!-- <h6 style=" font-size: 14px; margin-top: 1vh;">
                            {{ Bcomment.comment }}
                        </h6> -->
                        <v-md-editor v-model="Bcomment.comment" mode="preview"  style="font-size: 14px;margin-top: 1vh;height:auto;border:0;background-color:#EFF2F5  ;"/>


                        <div style="display: flex; align-items: center">
                            {{ Bcomment.time }}
                            <a href="https://www.baidu.com" target="_blank" class="ip">Hong Kong</a>
                            <div class="replyTo" @click="Replyto(Bcomment.id, Bcomment)">
                                回复
                            </div>
                        </div>
                    </div>
                    <!-- 以下评论框点击则显示，再次点击则收回 -->
                    <div v-if="isShow && Bcomment.id == isShowId" class="isCommentEdit">
                        <comment-edit :toWhich="toWhich" :toWhom="toWhom" :articleName="name"/>
                    </div>
                </div>

            </div>
            <!-- 二级评论结束 -->

        </div>
        <!-- 整个评论展示列表 结束 -->
    </div>
</template>

<script>
import commentEdit from "./commentEdit.vue";
export default {
    name: "commentComponent",
    components: {
        commentEdit,
    },
    props: ["name", "commentData"],
    data() {
        return {
            isShow: false,
            isShowId: 0,
         
            likeNumber: "", // 某条评论的点赞数量（此功能暂废弃 ————7.13）
            commentListByVueX: this.$store.state.comment.commentdata, //请求来的，相应文章的评论数据
            commentListByProps: [],
            pictureUrl: "/uploadFiles/",
            // theme:'',
            isLike: false,
            isLikeId: "",

            flag: "",
            toWhich: "", //从reply to中收集
            toWhom: "", // 从reply to中收集

        };
    },
    // computed: {
    //     pictureUrl() {
    //         return "http://localhost:3001/uploadFiles/" + this.comment.picture;
    //     }
    // },

    // 监听props的数据，有变化就立马更新。（因为初始时commentData的数据还拿不到）
    watch: {
        commentData: {
            handler() {
                console.log(
                    "有变化了,监听props方式",
                    this.commentData.length,
                    this.name
                );
                for (let i = 0; i < this.commentData.length; i++) {
                    if (this.commentData[i].article == this.name) {
                        this.commentListByProps.push(this.commentData[i]);
                    }
                }
                console.log(this.commentListByProps);
            },
            deep: true,
            immediate: true,
        },
    },
    // */
    methods: {
        Replyto(id, comment) {
            //以下两行代码的作用是：每次点击reply to时，只会有相应的评论会展开一个评论框，而不是每个。
            this.isShow = !this.isShow;
            this.isShowId = id;
            console.log(comment);

            //设置当前评论（新评论） toWhich和 toWhom的值：
            //如果 toWhich的值为null或者为空，说明是一级评论。id就是新评论的toWhich值。
            if (comment.toWhich == null || comment.toWhich == "") {
                this.toWhich = comment.id;
                this.toWhom = comment.nickname;
                // this.$store.dispatch('setToWhich',comment.id)
                // this.$store.dispatch('setToWhom',comment.nickname)
            } else {
                //二级评论，则 toWhich 值相同。
                this.toWhich = comment.toWhich;
                this.toWhom = comment.nickname;
                // this.$store.dispatch('setToWhich',comment.toWhich)
                // this.$store.dispatch('setToWhom',comment.nickname)
            }
        },

    },
    created() {
        //props传入的数据在 created阶段已经有了。
        this.$bus.$on("closeCommentEdit",this.Replyto);

    },
    beforeMount() {
        console.log("comment组件接收到vuex中的评论数据（某个文章的）", this.commentListByVueX);
    },
};
</script>

<style scoped>
.comment {
    background-color: #ffffff;
    width: 60%;
    min-height: 30vh;
    margin-left: 20%;
    margin-top: 5vh;
    border: 1px solid rgb(184, 184, 184);
    padding: 3vh;
    border-radius: 1vh;
}

.comment_item {
    margin-top: 1%;
    background-color: #EFF2F5;
    /* background-color: #5e6267; */
    padding: 1% 1%;

}

img {
    width: 8%;
    height: 9vh;
    border-radius: 50%;
    vertical-align: top;
    object-fit: cover;

}

.content {
    margin-left: 2%;
    width: 88%;
    display: inline-block;
}
.content_name{
    font-size: 1rem;
    color: rgb(0, 0, 0);
    /* font-weight: 540; */
}
.isCommentEdit {
    margin-top: 2vh;
    margin-left: 8%
}


.replyTo {
    margin-left: 3vh;
}

.replyTo:hover {
    color: #40A9FF;
    /* font-weight: 550; */
}
.ip{
    margin-left: 3vh;
    color:dimgray
}
.ip:hover{
    color: #40A9FF;

    /* font-weight: 550; */

}
</style>