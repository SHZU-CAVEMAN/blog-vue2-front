<template>
    <div style="position: relative">
        <!-- 渐进式图片封装 其效果就是让两个图片叠加显示，完整的图片用css样式中的opacity给隐藏起来，表面显示的是占位图片
      通过传入一定的时间，让展位图逐渐过度到完整的图片-->

        <!-- 通过v-if来判断，如果全部的任务完成了将原来的展占位图片给移除掉 -->
        <keep-alive>
            <!-- 使用占位图有点问题 -->
            <!-- <img v-if="!everything" ref="zhanwei" src="../assets/zhanwei.jpg" alt="" style="position: absolute" /> -->
        </keep-alive>
        <!-- 这部分是完整图片，可以看到，绑定了一个事件叫做 handleLoad，其效果是将图片加载完成和通过一个计数器经过一段时间的
      模糊处理，将状态量变为true，从而更改到数据中的opacity的值，从而将完整图片展示出来，注意，这里绑定了style样式，可以在这里
    通过绑定的style样式对该标签进行样式上的变更，但要注意，vue本质上是通过数据来确定样式的，无法使用js原生的思路，注意看这里，在
  style中，传入了对象形式的方法，写入了一个opaity对应的值为originOpacity方法所产生的返回值，后面的transition提供了这个过度所需要的时间-->
        <keep-alive>
            <img ref="img" :src="srcload" alt="" @load="handleLoad"
                :style="{ opacity: originOpacity, transition: `${duration}ms` }" />
        </keep-alive>
    </div>
</template>
  
<script>
export default {
    name: "imageLoad",
    data() {
        return {
            originL: false, //图片加载完成的状态变量
            everthing: false, //所有事情都做完的状态变量
            zhanwei: "../assets/zhishui.jpg", //懒加载之前展示占位图片，或者模糊图。
            srcload: "../assets/zhanwei.jpg"
        };
    },
    computed: {
        originOpacity() {
            //通过计算属性确定图片是否加载完成，完成了返回1，然后传入到style里面完成原始图片的opacity展示
            return this.originL ? 1 : 0;
        },
        // srcload(){
        //     if (this.$refs.zhanwei.getBoundingClientRect().top < 500) {
        //         return this.src
        //         // console.log("nihaoniasdbdbsjdbchdb")
        //     }
        //     return this.src
        // }
    },
    props: {
        src: {
            //原始图片
            type: String,
            required: true,
        },
        placeholder: {
            //占位图片
            type: String,
            required: true,
        },
        duration: {
            //切换到原始图经过的毫秒数
            type: Number,
            default: 500,
        },
    },
    methods: {
        //这里提供了一个函数，由将状态由原来的flase变为true，同时写入了settimeou计时器，经过传入的动画执行几秒的秒数，然后将所有的事情都完成
        //将所有都完成的状态变为true，从而传入到originOpacity函数中，再将0或者1传入到style的opacity中。
        //@load="handleLoad"调用此事件将状态更改，然后在style中调用originOpacity完成对style的opacity的值的更改
        handleLoad() {
            this.originL = true;
            setTimeout(() => {
                this.everthing = true;
                // this.$emit("load")//并且还抛出事件通知父组件
            }, this.duration);
        },
        lazyload() {
            let seeHeight = document.documentElement.clientHeight;
            // console.log('ssssss',this.$refs.img.getBoundingClientRect().top);
            // this.$nextTick(() => {
                if (this.$refs.img.getBoundingClientRect().top < seeHeight) {
                    this.$refs.img.src = this.src;
                }
                // console.log("lazyload执行了！！！", this.$refs.img.src);
            // })

        },
        //节流函数
        throttle(fn, delay) {
            let valid = true;
            return function () {
                if (valid) {
                    //如果阀门已经打开，就继续往下
                    setTimeout(() => {
                        fn.apply(this, arguments); //定时器结束后执行
                        valid = true; //执行完成后打开阀门
                    }, delay);
                    valid = false; //关闭阀门
                }
            };
        },
        // load() {
        //     if (this.$refs.zhanwei.getBoundingClientRect().top < 500) {
        //         this.$refs.img.src = this.src;
        //         console.log("nihaoniasdbdbsjdbchdb")
        //     }
        // }
    },
    creared() { },
    beforeUpdate() {
        console.log(" beforeUpdate执行了!!!")
    },
    updated() {
        console.log(" Update执行了!!!")
    },
    mounted() {
        //为什么不显示呢?这里更新的应该是下一轮
        // if (this.$refs.img.getBoundingClientRect().top < 500) {
        //     this.$refs.img.src = this.src;
        //     console.log("nihaoniasdbdbsjdbchdb");
        // }
        this.lazyload();
        //以下实际是监听滚动，修改dom（加载图片）
        window.addEventListener("scroll", this.lazyload); //一滚动就疯狂调用lazyload函数，因此要节流。
    },
};
</script>
  
<style scoped>
.zhanwei {
    /* filter: blur(2vw); */
    /* 占位图片脱离文档流，在上层显示 */
    position: absolute;
    width: 20%;
}

/* img {
    width: 100%;
    height: 170px;
    object-fit: cover;
    flex: 1;
} */
</style>
  