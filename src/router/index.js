// 导入用来创建路由和确定路由模式的两个方法
import {createRouter, createWebHashHistory} from 'vue-router';
import store from '../store';


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
    {
        path: '/home',
        component: () => import('@/views/home'),
        children: [
            {
                path: 'children-management',
                name: 'children-management',
                component: () => import('@/views/home/children-management'),
                meta: {
                    keepAlive: true,
                    title: '管理员-儿童账户管理'
                }
            },
            {
                path: 'volunteer-management',
                name: 'volunteer-management',
                component: () => import('@/views/home/volunteer-management'),
                meta: {
                    keepAlive: true,
                    title: '管理员-志愿者账户管理'
                }
            },
            {
                path: 'learning-management',
                name: 'learning-management',
                component: () => import('@/views/home/learning-management'),
                meta: {
                    keepAlive: true,
                    title: '管理员-学习任务管理'
                }
            },
            {
                path: 'interactive-management',
                name: 'interactive-management',
                component: () => import('@/views/home/interactive-management'),
                meta: {
                    keepAlive: true,
                    title: '管理员-交互任务管理'
                }
            },
            {
                path: 'volunteer-review',
                name: 'volunteer-review',
                component: () => import('@/views/home/volunteer-review'),
                meta: {
                    keepAlive: true,
                    title: '管理员-志愿者资质审核'
                }
            },
            {
                path: 'children-review',
                name: 'children-review',
                component: () => import('@/views/home/children-review'),
                meta: {
                    keepAlive: true,
                    title: '管理员-儿童资质审核'
                }
            },
            {
                path: 'organization-review',
                name: 'organization-review',
                component: () => import('@/views/home/organization-review'),
                meta: {
                    keepAlive: true,
                    title: '管理员-志愿者组织资质审核'
                }
            },
            {
                path: 'fund-management',
                name: 'fund-management',
                component: () => import('@/views/home/fund-management'),
                meta: {
                    keepAlive: true,
                    title: '管理员-资金管理'
                }
            },
            {
                path: 'material-management',
                name: 'material-management',
                component: () => import('@/views/home/material-management'),
                meta: {
                    keepAlive: true,
                    title: '管理员-物资管理'
                }
            },
            {
                path: 'admin-info',
                name: 'admin-info',
                component: () => import('@/views/home/admin-info'),
                meta: {
                    keepAlive: true,
                    title: '管理员-个人信息'
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