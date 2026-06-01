import Vue from 'vue'
import VueX from 'vuex'

// 三个模块：用户信息，文章信息，评论信息
import user from './user'
import articleInfo from './articleInfo'
import comment from './comment'

Vue.use(VueX);

export default new VueX.Store({
    strict: true,
    modules:{
        user,
        articleInfo,
        comment,
    }
})