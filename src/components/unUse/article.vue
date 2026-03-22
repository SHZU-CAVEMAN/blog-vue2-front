<template>
    <!--弃用-->
    <div class="article">
        <div >
            <h5 style="margin-left:5%;margin-bottom:0;margin-top: 2vh;font-weight:550;color:(70,70,70)">《从此以后》中的主题和叙述特点以及描写特点整体风格</h5>
        </div>
        <v-md-preview :text="text" ref="preview" />
        <hr style="margin-left:5%;margin-top:0;margin-bottom:0;width:90%;"/>
        <div class="bottom">
            <div>
                分类：小说
            </div>
            <div style="margin-right: 5%;">
                发布：2023-2-14
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'articleComponent',
    data() {
        return {
            text: '',
        }
    },
    created() {
        alert("article组件")
        axios({
            methods: 'get',
            url: '/uploadFiles/test.md'
        }).then((res) => {
            this.text = res.data;
        })
    }
}
</script>

<style scoped>
.article {
    background-color: #ffffff;
    width: 96%;
    /* margin-bottom: 3%; */
    margin-left: 2%;
    border-radius: 10px;
    border: 1px solid rgb(208, 215, 222);
    padding:1vh;
}
.article:hover{
    box-shadow: 0.5vh 0.5vh 1vh  rgb(143, 143, 143);
}
.bottom{
    margin:1vh;
    /* 后者覆盖前者，所以向左是5%，上下和右边是1vh */
    margin-left:5%;
    font-size:0.9rem;
    display:flex;
    justify-content: space-between;
}
h5:hover{
    /* text-decoration: underline; */
    color:rgb(45, 150, 189)
}
</style>