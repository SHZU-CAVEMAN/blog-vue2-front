<!--右侧界面，包含博主和公告-->
<template>
    <div v-bind:class="{one:true,outter:flag}">
        <notice class="notice"/>
        <blogger-intro class="blogger-intro"/>
    </div>
</template>

<script>
import bloggerIntro from "../components/bloggerIntro.vue";
import notice from "../components/notice.vue";

export default {
    name: 'rightComponent',
    components: {
        bloggerIntro,
        notice,
    },
    data(){
        return {
            flag:false,
        }
    },
    methods: {
        handleScroll() {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if(scrollTop>60){
                this.flag = true;
            }else{
                this.flag = false;
            }
            // console.log("right组件：滚动距离" + scrollTop);
        }
    },
    mounted() {
       // console.log('category组件', this.articleInfo);
        window.addEventListener('scroll', this.handleScroll);
    }

}
</script>

<style scoped>
.one {
    position: sticky;
    top: 10vh;
    margin-left: 0;
}
.outter{
    position: sticky;
    top: 0;
}
.notice{
    margin-left: 2%;
    margin-top: 8%;
}
.blogger-intro{
    margin-left: 2%;
    margin-top: 8%;
}

</style>