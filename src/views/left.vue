<!-- 这个组件点击后，携带分类名信息，从获取到的所有文章信息中找出相应的文章信息，
    并在 articlelist 中展示出来 -->
<template>
    <div  v-bind:class="{left:true,outter:flag}">
        <category :articleInfo="articleInfo" />
    </div>
</template>
    
<script>
import Category from '../components/category.vue';

import axios from 'axios'

export default {
    name: "leftComponent",
    components:{
        Category,
    },
    data() {
        return {
            length: "",
            arr: [],
            flag:false,
        }
    },
    props: ["articleInfo"],
    methods: {
        handleScroll() {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if(scrollTop>60){
                this.flag = true;
            }else{
                this.flag = false;
            }
            // console.log("left组件：滚动距离" + scrollTop);
        }
    },
    created() {
        axios({
            method: "get",
            url: "/category/getall",
        })
            .then((res) => {
                this.length = res.data.data.length;
                for (var i = 0; i < this.length; i++) {
                    this.arr.unshift(res.data.data[i]); //倒序输出
                }
                //console.log("文章目录数据：",this.arr);
            })
            .catch((err) => {
                console.log("left.vue:",err);
            })
    },
    mounted() {
        //console.log('category组件', this.articleInfo);
        window.addEventListener('scroll', this.handleScroll);
    }
}
</script>
    
<style scoped>
/* 隐藏滚动条 */
.left::-webkit-scrollbar {
    width: 0 !important;
}

.left {
    background-color: #ffffff;
    /* height: 90vh; */
    bottom: 0;
    border: 1px solid rgb(208, 215, 222);
    position: sticky;
    top: 10vh;
    overflow-y: scroll;

    /* position: fixed; */

}

.outter {
    position: sticky;
    top: 0;
}

#category:hover {
    /* background-color:lightgray; */
    background-color: #ffffff;
    /* color: black;
        font-weight: 520; */
}

#category:hover #character {
    color: black;
    font-weight: 520;
}

.content {
    padding-bottom: 2vh;
    margin-left: 3%;
}

#character {
    display: inline-block;
    width: 85%;
    color: dimgray;
}
/* #character:hover{
        color:black;
    } */
</style>