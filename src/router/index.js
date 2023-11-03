// 导入用来创建路由和确定路由模式的两个方法
import {createRouter, createWebHashHistory} from 'vue-router';
import store from '../store';
import MainPage from "@/components/home/MainPage";
import LibraryPage from "@/components/home/LibraryPage";
import ShelfPage from "@/components/home/ShelfPage";
import RankPage from "@/components/home/RankPage";
import SearchPage from "@/components/home/SearchPage";
import MessagePage from "@/components/personal/MessagePage";
import MomentPage from "@/components/personal/MomentPage";
import HistoryPage from "@/components/personal/HistoryPage";
import StudyPage from "@/components/personal/StudyPage.vue";
import CenterPage from "@/components/personal/CenterPage";
import PublishPage from "@/components/personal/PublishPage.vue";


const routes = [
    {
        path: '/',
        redirect: '/login',
        component: () => import('../views/login/login.vue'),
        meta: {
            title: '管理员-登录'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login/login.vue'),
        meta: {
            title: '管理员-登录'
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/login/register.vue'),
        meta: {
            title: '管理员-注册'
        }
    },
];


// 创建路由实例并传递 `routes` 配置
// 我们在这里使用 html5 的路由模式，url中不带有#，部署项目的时候需要注意。
const router = createRouter({
    history: createWebHashHistory(),
    base: 'mgzm',
    routes,
});

router.beforeEach((to, from, next) => {
    store.commit('clearToken');
    next();
});


// 讲路由实例导出
export default router