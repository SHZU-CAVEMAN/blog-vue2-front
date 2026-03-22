import Vue from "vue";
import Router from 'vue-router'
Vue.use(Router)

const routes = [
    //首页（有两个子组件）
    {
        path: '/',
        name: 'homeComponent',
        component: () => import('../components/home.vue'),
        children: [
            {
                path: 'cate',
                name: 'onFile',
                component: () => import('../components/onFile.vue'),
                props($route){
                    return{
                        name:$route.query.name,
                    }
                }
            },
            {
                path: '',  //默认页面
                name: 'articles',
                component: () => import('../components/articles.vue'),
            },
        ]

    },
    //关于
    {
        path:'/about',
        name:"aboutComponent",
        component:()=>import('../components/about.vue'),

    },
    // 编辑板
    {
        path: '/mdEditor',
        name: 'mdEditorComponent',
        component: () => import('../components/mdEditor.vue'),
        meta: {
            requireAuth: true // 编辑板 需要验证是否登录
        }
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
    {
        path:'/friends',
        name:'friendsComponent',
        component:()=>import('../components/friends.vue')
    },
    {
        path:'/statistics',
        name:'statisticsComponent',
        component:()=>import('../components/statistics.vue')
    },
    {
        path:'/messageBoard',
        name:'messageBoardComponent',
        component:()=>import('../components/messageBoard.vue')
    }

]
const route = new Router({
    routes
})

export default route;