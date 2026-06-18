<template>
    <div class="catalog">
        <!-- <a-icon type="container" /> -->
                <div class="catalog-title">
            目录
        </div>

        <hr style="margin-top: 5px; margin-bottom: 5px" />

        <div :id="anchor.lineIndex" v-for="anchor in titles" :style="{
            padding: `0px 0px 0px ${anchor.indent * 30}px`,
            marginLeft: '1vh',
            marginRight: '0px',
        }" style="background-color: " @click="handleAnchorClick(anchor)" :key="anchor">
            <div id="font" style="cursor: pointer; height:5vh;font-size: 2.5vh;background-color: ">
                {{ anchor.title }}</div>
            <!-- <hr style="margin:0" /> -->
        </div>

        <div class="sider">
            <div class="siderbar">
            </div>
        </div>

        <br />
    </div>
</template>

<script>
export default {
    name: 'catalogComponent',
    props: ['anchors'],
    data() {
        return {

            titles: [],
            target: [],
            indexArray: [],//这个数组仅用于 siderbar的平移
        }
    },
    computed: {

    },
    methods: {
        readThemeVar(name, fallback) {
            const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
            return value || fallback;
        },
        //去除除了line所对应标题的字体样式（还原成dimgray）
        removeClass(line) {
            for (let i = 0; i < this.target.length; i++) {
                const domline = this.target[i].getAttribute("data-v-md-line");
                if (domline != line) {
                    document.getElementById(domline).style.color = this.readThemeVar("--interactive-text-rest", "dimgray");
                    document.getElementById(domline).style.fontWeight = "500";

                }
            }
            // console.log(line);
        },

        observeScroll(item) {
            // console.log(item.target);
            item.forEach((observe) => {//为什么这里要用 forEach ？
                console.log('哈？', observe);//observe是一个 IntersectionObserver对象，从其target属性中可以获取观察的dom对象。
                if (observe.isIntersecting) {
                    const line = item[0].target.getAttribute("data-v-md-line");
                    this.removeClass(line);
                    const dom = document.getElementById(line);
                    dom.style.color = this.readThemeVar("--interactive-text-active", "black");
                    dom.style.fontWeight = '550';
                    const index = this.indexArray.indexOf(line);
                    var sider = document.querySelector(".siderbar");
                    sider.style.transform = `translateY(${index * 5}vh)`;
                }
            });
        },

        // 目录跟随
        handleAnchorClick(anchor) {
            const { preview } = this.$refs;
            console.log("最好！", preview.html); //打印整个文章的html
            const { lineIndex } = anchor;
            // console.log("哈哈哈哈",anchor);
            //heading为滚动的位置
            const heading = preview.$el.querySelector(
                `[data-v-md-line="${lineIndex}"]`
            );

            if (heading) {
                preview.scrollToTarget({
                    //scrollToTarget是 v-md-editor 封装的方法。
                    target: heading,
                    scrollContainer: window,
                    top: 10,
                });
            }
        },

    },
    mounted() {
        // 一 、 拿到文章数据后获取文章标签等数据
        console.log("这里执行了");
        // const anchors =
        //   this.$refs.preview.$el.querySelectorAll("h1,h2,h3,h4,h5,h6");

        const anchors = this.anchors;
        console.log("呵呵呵呵呵呵呵", anchors);

        //anchors是一个NodeList对象，（类数组对象），表示一个有序的节点集合

        const titles = Array.from(anchors).filter(
            //Array.from：将anchors转换成一个数组
            (title) => !!title.innerText.trim() //保留具有非空文本内容的标题元素。
        );
        console.log(titles);

        // 没有标题，则 this.titles数组为空，返回空数组。
        if (!titles.length) {
            this.titles = [];
            return;
        }

        const hTags = Array.from(
            new Set(titles.map((title) => title.tagName))
        ).sort(); //去除重复的标题标签名，并将结果转换为数组 ?

        this.titles = titles.map((el) => ({
            title: el.innerText, //文本内容
            lineIndex: el.getAttribute("data-v-md-line"), //所在行数
            indent: hTags.indexOf(el.tagName), //标题级别-1
            //一个title对象 存储了文本内容，所在行数，标题级别。
        }));

        //二 、监听滚动
        for (let i = 0; i < this.titles.length; i++) {
            const item = this.$refs.preview.$el.querySelector(
                `[data-v-md-line="${this.titles[i].lineIndex}"]`
            );
            this.target.push(item);
            this.indexArray.push(this.titles[i].lineIndex);
        }
        const observer = new IntersectionObserver(this.observeScroll);
        // console.log("试一试", target);
        Array.from(this.target, (item) => observer.observe(item));
    }

}
</script>

