import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

const router= new Router({
  mode: 'history', // 启用 History 模式
  routes: [
    {
      path:'/',
      redirect:'/HomePage'
    },
    {
      path:'/HomePage',
      name:'HomePage',
      component:()=>import('../views/HomePage.vue'),
      meta:{
        title:'首页'
      }
    },
    {
      path:'/BLogForum',
      name:'BLogForum',
      component:()=>import('../views/blogForum/BlogForum.vue'),
      meta:{
        title:'博客论坛'
      },
    },
    {
      path:'/BLogForum-Login',
      name:'BLogForum-Login',
      component:()=>import('../views/blogForum/BLogForum-Login.vue'),
      meta:{
        title:'博客论坛-登录',
        keepAlive:true
      },
      },
    {
      path:'/BLogForum-Register',
      name:'BLogForum-Register',
      component:()=>import('../views/blogForum/BLogForum-Register.vue'),
      meta:{
        title:'博客论坛-注册'
      }
    },
    {
      path:'/CreatePost',
      name:'CreatePost',
      component:()=>import('../views/post/CreatePost.vue'),
      meta:{
        title:'创建帖子'
      },
    },
    {
      path: '/BlogForum/Post/:postId',
      name: 'Post',
      component: () => import('../views/post/Post.vue'),
      meta: {
        title: '帖子详情'
      }
    },
    {
      path:'/CheckUser',
      name:'CheckUser',
      component:()=>import('../views/user/CheckUser.vue'),
      meta:{
        title:'查看其它人的用户'
      }
    },
    {
      path:'/Personal',
      name:'Personal',
      component:()=>import('../views/user/Personal.vue'),
      meta:{
        title:'个人中心'
      }
    }



  ]
})
export default router;
