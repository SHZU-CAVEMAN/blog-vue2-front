<template>
    <!--头菜单—关于-->
    <div class="about">
        <a-tabs default-active-key="2" @change="callback" type="card"  style="width:60%;text-align: center;">
            <a-tab-pane key="1">
                <span slot="tab">
                    <a-icon type="apple" />
                    博主
                </span>
                Tab 1
            </a-tab-pane>

            <a-tab-pane key="2">
                <span slot="tab">
                    <a-icon type="android" />
                    留言板
                </span>
                Tab 2
            </a-tab-pane>

            <a-tab-pane key="3">
                <span slot="tab">
                    <a-icon type="android" />
                    网站统计
                </span>
                <statistics/>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import statistics from './statistics.vue';
export default {
  components: { statistics },
    name: 'aboutComponent',
    data() {
        return {};
    },
    methods: {
        callback(key) {
            console.log(key);
        },
    },
}
</script>

<style scoped>
.about {
    display: flex;
    justify-content: center;
    /* background-color:aquamarine; */
}

</style>