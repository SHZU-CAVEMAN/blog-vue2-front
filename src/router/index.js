import Vue from "vue";
import Router from 'vue-router'
Vue.use(Router)

const routes = [
    //首页 （默认页面）
    {
        path: '/',
        name: 'homeComponent',
        component: () => import('../views/home.vue'),
        children: [
            {
                path: 'cate', // 点击分类，进入归档页面
                name: 'onFile',
                component: () => import('../components/onFile.vue'),
                props($route){
                    return{
                        name:$route.query.name,
                    }
                }
            },
            {
                path: '',  //默认页面 （文章卡片）
                name: 'articles',
                component: () => import('../components/articles.vue'),
            },
        ]

    },
    // 文章展示
    {
        path: '/articleView/:id/:name',
        name: 'articleViewComponent',
        props($route) {
            return {
                id: $route.params.id,
                name: $route.params.name,
            }
        },
        component: () => import('../components/articleView.vue')
    },
    // 友情链接
    {
        path:'/friends',
        name:'friendsComponent',
        component:()=>import('../components/friends.vue')
    },

]
const route = new Router({
    routes
})

export default route;