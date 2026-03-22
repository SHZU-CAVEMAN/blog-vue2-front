<!-- 这个组件点击后，携带分类名信息，从获取到的所有文章信息中找出相应的文章信息，
    并在 articlelist 中展示出来 -->
<template>
    <div class="category">
        <div style="margin-left: 5%; margin-right: 5%; padding-top: 0%">
            <div style="background-color:#ffffff;display:flex;align-items: center;">
                <a-icon type="folder" theme="filled" style="font-size: 3vh;" />
                <h6 style="margin:5px 0 5px 2vh;display:inline-block;font-weight: 550;color:dimgray">
                    分 类
                </h6>
            </div>
            <hr style="margin-top: 0;" />

            <div class="content">
                 <!-- 总计 -->
                 <div style="margin: 2vh 0;">
                    <div @click="jump('total')" class="total">

                        <div >
                            Total
                        </div>

                        <div>
                            {{ articleInfo.length }}
                        </div>

                    </div>
                </div>

                <div v-for="item in category" :key="item" style="margin-top: 0.5vh;">
                    <div id="category" @click="jump(item.name)">

                        <div >
                            {{ item.name }}
                        </div>

                        <div>
                            {{ item.number }}
                        </div>

                    </div>
                </div>
                <!-- 分割线 -->
                <!-- <hr style="margin: 1vh 0;"/> -->

               
            </div>


        </div>

    </div>
</template>

<script>

import axios from 'axios'
export default {
    name: "categoryComponent",
    data() {
        return {
            length: "",
            category: [],
        }
    },
    props: ["articleInfo"],
    methods: {
        jump(name) {
            // console.log("点击事件没问题",name)


            this.$router.push({
                name: "onFile",
                query: {
                    name,
                }
            });//这个时候articleListCate组件实例创建了吗 ?
            // this.$bus.$emit('cateEvent', name);  //被触发的那个组件还没被创建出来?
            //这个路由组件被创建出来后,再次点击jump,不会再次创建。

            //临时解决办法: 对操作后的dom进行渲染?
            // setTimeout(()=>{
            // this.$bus.$emit('cateEvent', name);  //被触发的那个组件还没被创建出来?
            // },200);


            // location.reload()
        }

    },
    created() {
        // if(sessionStorage.getItem('category')){
        //     this.category =  JSON.parse(sessionStorage.getItem('category'));
        // }

        axios({
            method: "get",
            url: "/category/getall",
        })
            .then((res) => {
                this.length = res.data.data.length;
                for (var i = 0; i < this.length; i++) {
                    this.category.unshift(res.data.data[i]); //倒序输出
                }
                // console.log(this.category);
                //vuex存起来
                //  this.$store.dispatch("setCategory", this.category)
                //sessionStorage存起来
                // sessionStorage.setItem('category',JSON.stringify(this.$store.state.articleInfo.category));
            })
            .catch((err) => {
                console.log(err);
            })
    },
    mounted() {
        console.log('category组件', this.articleInfo);
    }

}
</script>

<style scoped>
.category {
    background-color: #ffffff;
    width: 100%;
    height: auto;
    margin-left: 0%;
    margin-top: 8%;
    /* border-radius: 1vh; */
    /* box-shadow: 0px 4px 6px 2px rgb(223, 223, 223); */
    /* border: 1px solid rgb(208, 215, 222); */
}

.content {
    padding-bottom: 2vh;
}

#category {
    background-color: #EFF2F5;
    width: 90%;
    margin-left: 5%;
    padding: 0 2vh;
    font-size: 0.9rem;
    display: flex;
    justify-content: space-between;

}

#category:hover {
    /* background-color:lightgray; */
    background-color: #EFF8FF;
    color: rgb(0, 0, 0);
    font-weight: 550;
}



.total {
    width:90%;
    margin-left: 5%;
    padding:0 2vh;
    font-size: 1rem;
    /* background-color: #EFF2F5; */
    background-color: #707070;
    color:white;
    font-weight: 550;


    border-radius: 1vh;
    border: 1px solid rgb(178, 178, 178);

    display: flex;
    justify-content: space-between;

}
.total:hover{
    background-color: #535456;
}

</style>