// 导入用来创建路由和确定路由模式的两个方法
import {createRouter, createWebHashHistory} from 'vue-router';
import store from '../store';
import Login from "@/views/login/login.vue";
import Register from "@/views/login/register.vue";
import Home from "@/views/home.vue";
import ChildrenManagement from "@/views/home/children-management.vue";
import VolunteerManagement from "@/views/home/volunteer-management.vue";
import LearningManagement from "@/views/home/learning-management.vue";
import InteractiveManagement from "@/views/home/interactive-management.vue";
import Review from "@/views/home/review.vue";
import FundManagement from "@/views/home/fund-management.vue";
import MaterialManagement from "@/views/home/material-management.vue";

const routes = [
    {
        path: '/',
        redirect: '/login',
        component: Login,
        meta: {
            title: '管理员-登录'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: '管理员-登录'
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            title: '管理员-注册'
        }
    },
    {
        path: '/home',
        component: Home,
        children: [
            {
                path: 'children-management',
                name: 'children-management',
                component: ChildrenManagement,
                meta: {
                    keepAlive: true,
                    title: '管理员-儿童账户管理'
                }
            },
            {
                path: 'volunteer-management',
                name: 'volunteer-management',
                component: VolunteerManagement,
                meta: {
                    keepAlive: true,
                    title: '管理员-志愿者账户管理'
                }
            },
            {
                path: 'learning-management',
                name: 'learning-management',
                component: LearningManagement,
                meta: {
                    keepAlive: true,
                    title: '管理员-学习任务管理'
                }
            },
            {
                path: 'interactive-management',
                name: 'interactive-management',
                component: InteractiveManagement,
                meta: {
                    keepAlive: true,
                    title: '管理员-交互任务管理'
                }
            },
            {
                path: 'review',
                name: 'review',
                component: Review,
                meta: {
                    keepAlive: true,
                    title: '管理员-资质审核'
                }
            },
            {
                path: 'fund-management',
                name: 'fund-management',
                component: FundManagement,
                meta: {
                    keepAlive: true,
                    title: '管理员-资金管理'
                }
            },
            {
                path: 'material-management',
                name: 'material-management',
                component: MaterialManagement,
                meta: {
                    keepAlive: true,
                    title: '管理员-物资管理'
                }
            }
        ]
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