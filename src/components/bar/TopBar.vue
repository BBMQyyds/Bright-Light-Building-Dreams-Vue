<template>
  <div class="top-bar">
    <img alt="logo" class="logo" src="../../assets/img/logo.png" @click="toHome">
    <el-menu :default-active="this.$route.path" class="menu" mode="horizontal">
      <router-link to="/home/main">
        <el-menu-item index="/home/main"><i class="icon el-icon-s-home"></i>首页</el-menu-item>
      </router-link>
      <router-link to="/home/library">
        <el-menu-item index="/home/library"><i class="icon el-icon-s-management"></i>书库</el-menu-item>
      </router-link>
      <router-link to="/home/shelf">
        <el-menu-item index="/home/shelf"><i class="icon el-icon-s-grid"></i>书架</el-menu-item>
      </router-link>
      <router-link to="/home/rank">
        <el-menu-item index="/home/rank"><i class="icon el-icon-s-data"></i>榜单</el-menu-item>
      </router-link>
    </el-menu>
    <el-input v-model="searchKeyWord" class="search" placeholder="请输入书名或作者名"
              size="default" @keyup.enter.native="search">
      <template v-slot:prefix>
        <i v-if="this.$route.path!=='/home/search'" class="el-input__icon el-icon-search" style="color: black"
           @click="search"></i>
        <i v-if="this.$route.path==='/home/search'" class="el-input__icon el-icon-search" style="color: #409EFF"
           @click="search"></i>
      </template>
    </el-input>
    <el-menu :default-active="this.$route.path" class="menu2" mode="horizontal">
      <el-button v-if="!$store.state.user" class="user-button" link type="primary" @click="login">登录</el-button>
      <LoginCard ref="loginCard" :getAvatar="getAvatar"></LoginCard>
      <el-button v-if="!$store.state.user" class="user-button" link type="primary" @click="register">注册</el-button>
      <RegisterCard ref="registerCard"></RegisterCard>
      <div class="avatar"
           @mouseout="this.$refs.avatarCard.isCardVisible=false"
           @mouseover="this.$refs.avatarCard.isCardVisible=true">
        <el-avatar v-if="$store.state.user" v-loading="!imageUrl"
                   :src="imageUrl"
                   :style="(this.$route.path === '/personal/center')
                   ? {border:'2px solid #409EFF'} : {border:'1px solid white'}"
                   size="default">
          用户
        </el-avatar>
        <AvatarCard v-if="$store.state.user" ref="avatarCard" class="info"></AvatarCard>
      </div>
      <router-link to="/personal/message">
        <el-menu-item index="/personal/message"><i class="icon el-icon-message"></i>消息</el-menu-item>
      </router-link>
      <router-link to="/personal/moment">
        <el-menu-item index="/personal/moment"><i class="icon el-icon-location-information"></i>动态</el-menu-item>
      </router-link>
      <router-link to="/personal/history">
        <el-menu-item index="/personal/history"><i class="icon el-icon-time"></i>历史</el-menu-item>
      </router-link>
      <router-link to="/personal/study">
        <el-menu-item index="/personal/study"><i class="icon el-icon-help"></i>学习</el-menu-item>
      </router-link>
    </el-menu>
    <el-button class="publish" size="default" type="primary" @click="toPublish">
      <i class="el-icon-plus"></i>&ensp;发布
    </el-button>
  </div>
</template>

<script>

import LoginCard from "@/components/bar/card/LoginCard.vue";
import RegisterCard from "@/components/bar/card/RegisterCard.vue";
import AvatarCard from "@/components/bar/card/AvatarCard.vue";
import request, {fileRequest} from "@/api";
import {eventBus} from "@ai-zen/event-bus";
import router from "@/router";


export default {
  name: "TopBar",
  components: {AvatarCard, RegisterCard, LoginCard},
  created() {
    if (this.$store.state.auto) {
      this.tokenLogin();
    } else {
      this.$store.commit('logout');
    }
  },
  data() {
    return {
      searchKeyWord: '',
      imageUrl: '',
      user: this.$store.state.user,
      isCardVisible: false,
      timer: null,
    };
  },
  methods: {
    toHome() {
      router.push('/home/main');
    },
    toPublish() {
      if (this.$store.state.user) {
        router.push({
          path: '/personal/publish',
          query: {
            type: 'tale',
          }
        });
      } else {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '请先登录'
        });
      }
    },
    login() {
      this.$refs.loginCard.loginVisible = true;
      this.$refs.loginCard.user.username = '';
      this.$refs.loginCard.user.password = '';
      this.$refs.loginCard.auto = false;
    },
    register() {
      this.$refs.registerCard.registerVisible = true;
      this.$refs.registerCard.user.username = '';
      this.$refs.registerCard.user.password = '';
      this.$refs.registerCard.user.confirm = '';
    },
    search() {
      this.$store.state.searchKeyWord = this.searchKeyWord;
      if (this.$route.path !== '/home/search') {
        router.push('/home/search');
      } else {
        eventBus.emit('search');
      }
    },
    getAvatar() {
      fileRequest.post('/download', JSON.stringify({
        apiType: this.$aes.encrypt('downloadUserAvatar'),
        data: this.$aes.encrypt(this.$store.state.user.avatar),
      }), {
        responseType: 'arraybuffer', // 指定响应类型为字节数组
      }).then(response => {
        // 将字节数组转换为Blob对象
        const blob = new Blob([response.data], {type: response.headers['content-type']});
        // 将Blob对象转换为DataURL
        // 在界面中显示图像
        this.imageUrl = URL.createObjectURL(blob);
      }).catch((err => {
        console.log(err);
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'error',
          message: '请求异常，请刷新重试'
        });
      }));
    },
    tokenLogin() {
      request.post('/user', JSON.stringify({
        apiType: this.$aes.encrypt('tokenLogin'),
        data: null,
      })).then(response => {
        if (response.data.code === '200') {
          this.$store.commit('setUser', JSON.parse(this.$aes.decrypt(response.data.data)));
          // this.$msg({
          // customClass: 'messageIndex',
          //   duration: 1000,
          //   type: 'success',
          //   message: '登录成功'
          // });
          this.getAvatar();
        } else {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            type: 'warning',
            message: this.$aes.decrypt(response.data.message)
          });
          this.$store.commit('logout');
        }
      }).catch((err => {
        console.log(err);
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'error',
          message: '请求异常，请刷新重试'
        });
      }));
    }
  }
};

</script>

<style lang="scss" scoped>

.messageIndex {
  z-index: 20000 !important;
}

.top-bar {
  display: flex;
  align-items: center;
  background: url("../../assets/img/top.jpg") no-repeat;
  background-size: cover;
  width: 99.20%;
  position: fixed;
  top: 0;
  z-index: 10000;
}

.logo {
  margin-left: 5%;
  margin-right: 5%;
}

.menu {
  flex: 5;
  background: transparent;

  .el-menu-item {
    font-size: 15px;
    font-weight: bold;
  }
}

.search {
  flex: 3;
}

.menu2 {
  flex: 7;
  background: transparent;
  align-items: center;

  .el-menu-item {
    font-size: 15px;
    font-weight: bold;
  }
}

.publish {
  margin-right: 5%;
  padding-top: 8px;
}

:deep(input) {
  border: none;
}

.el-button {
  color: white;
}

.el-menu-item {
  color: black;
  background: transparent !important;
}

.icon {
  color: black;
}

.el-menu-item:hover {
  color: #409EFF !important;
  background: transparent !important;

  .icon {
    color: #409EFF !important;
  }
}

.el-submenu .el-submenu__title:hover {
  background: transparent !important;
}

.el-sub-menu.is-active {
  background: transparent !important;
}

.el-menu--horizontal > .el-menu-item {
  border-bottom: none !important;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: none !important;
}

a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

.user-button {
  color: black !important;
  font-size: 15px;
  font-weight: bold;
  margin-right: 10px;
  margin-left: 10px;
}

.user-button:focus, .user-button:hover {
  color: #409EFF !important;
}

.user-button:focus:not(.user-button:hover) {
  color: black !important;
}

.el-avatar {
  margin-top: 5px;
  margin-right: 20px;
  margin-left: 20px;
  background: #409EFF;
}

.el-avatar:hover {
  cursor: pointer;
  transform: scale(1.1);
  transition: all 0.5s;
}

.publish:focus:not(.publish:hover) {
  color: white;
  background: #409EFF;
}

.avatar {
  position: relative;
}

.info {
  position: absolute;
  top: 100%; /* 将卡片放在头像的正下方，可以调整这个值来调整卡片与头像的间距 */
  left: -139px;
}

.el-icon-search:hover {
  cursor: pointer;
}

.logo:hover {
  cursor: pointer;
}

.el-menu-item.is-active {
  color: #409EFF !important;
  background: transparent !important;

  .icon {
    color: #409EFF !important;
  }
}

</style>
