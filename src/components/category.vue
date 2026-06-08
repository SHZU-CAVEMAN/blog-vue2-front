<!-- 这个组件点击后，携带分类名信息，从获取到的所有文章信息中找出相应的文章信息，
    并在 articlelist 中展示出来 -->
<template>
    <div class="category">
        <div style="margin-left: 5%; margin-right: 5%; padding-top: 0%">
            <div class="category-head">
                <a-icon type="folder" theme="filled" class="panel-icon" />
                <h6 class="panel-title">
                    分 类
                </h6>
            </div>
            <hr style="margin-top: 0;" />

            <div class="content">
                 <!-- 总计 -->
                 <div style="margin: 2vh 0;">
                    <div @click="jump('total')" :class="{ 'total-active': isCategoryActive('total') }" class="total">
                        <div >
                            Total
                        </div>
                        <div>
                            {{ articleInfo.length }}
                        </div>

                    </div>
                </div>

                <div v-for="item in category" :key="item" style="margin-top: 0.5vh;">
                    <div :class="{ 'category-item-active': isCategoryActive(item.name) }" class="category-item" @click="jump(item.name)">
                        <div >
                            {{ item.name }}
                        </div>
                        <div>
                            {{ item.number }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "categoryComponent",
    props: ["articleInfo"],
    computed: {
        // 分类数据统一从 Vuex 读取，确保多处组件复用同一份数据。
        category() {
            return this.$store.state.articleInfo.category || [];
        },
        currentCategoryName() {
            // 分类列表的选中态由当前路由决定，刷新页面或前进后退时也能保持一致。
            if (this.$route.name !== "onFile") return "";
            return this.$route.query.name || "";
        },
    },
    watch: {
        articleInfo: {
            // 直接基于已拿到的文章列表生成分类统计，避免重复请求 /category/getall。
            handler() {
                this.buildCategoryFromArticles();
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        // 从文章数据中提取分类名，兼容 category 为字符串或对象两种结构。
        getCategoryName(article) {
            if (!article) return "";
            const cate = article.category;
            if (typeof cate === "string") return cate;
            if (cate && typeof cate === "object") return cate.name || cate.title || "";
            return "";
        },
        // 使用文章列表聚合分类数量，复用已有数据来源。
        buildCategoryFromArticles() {
            const list = Array.isArray(this.articleInfo) ? this.articleInfo : [];
            const map = {};

            list.forEach((article) => {
                const name = this.getCategoryName(article);
                if (!name) return;
                if (!map[name]) {
                    map[name] = 0;
                }
                map[name] += 1;
            });

            const categoryStats = Object.keys(map)
                .map((name) => ({ name, number: map[name] }))
                .sort((a, b) => b.number - a.number);

            // 将分类统计结果写入 Vuex，供其它组件直接读取复用。
            this.$store.dispatch("setCategory", categoryStats);
        },
        isCategoryActive(name) {
            return this.currentCategoryName === name;
        },
        // 点击分类，跳转到分类页面（onFile.vue），并把分类名传过去
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
    },
    mounted() {
        //console.log('文章数据', this.articleInfo);
    }

}
</script>

<style scoped>
.category {
    background-color: #ffffff;
    width: 100%;
    height: auto;
    margin-left: 0%;
    margin-top: 0;
    padding-top: 3vh;
    /* border-radius: 1vh; */
    /* box-shadow: 0px 4px 6px 2px rgb(223, 223, 223); */
    /* border: 1px solid rgb(208, 215, 222); */
}

.content {
    padding-bottom: 2vh;
}

.category-head {
    background-color: #ffffff;
    display: flex;
    align-items: center;
}

.panel-icon {
    font-size: var(--font-size-xl);
}

.panel-title {
    margin: 5px 0 5px 2vh;
    display: inline-block;
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-medium);
    color: dimgray;
}

.category-item {
    background-color: #EFF2F5;
    width: 90%;
    margin-left: 5%;
    padding: 0 2vh;
    font-size: var(--font-size-md);
    color: var(--interactive-text-rest);
    display: flex;
    justify-content: space-between;
    cursor: pointer;

}

.category-item:hover,
.category-item-active {
    background-color: #f3f4f6;
    color: var(--interactive-text-active);
    font-weight: 550;
}



.total {
    width:90%;
    margin-left: 5%;
    padding:0 2vh;
    font-size: var(--font-size-md);
    /* background-color: #EFF2F5; */
    background-color: #707070;
    color:white;
    font-weight: var(--font-weight-medium);


    border-radius: 1vh;
    border: 1px solid rgb(178, 178, 178);

    display: flex;
    justify-content: space-between;
    cursor: pointer;

}
.total:hover,
.total-active{
    background-color: #535456;
}

</style>