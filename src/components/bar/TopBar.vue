<template>
  <div class="top-bar">
    <img alt="logo" class="logo" src="../../assets/img/logo.png">
    <el-menu :default-active="this.$route.path" class="menu" mode="horizontal">

      <router-link to="/home/children-management">
        <el-menu-item index="/home/children-management">
          <i class="el-icon-user-solid"></i>儿童账户管理
        </el-menu-item>
      </router-link>

      <router-link to="/home/volunteer-management">
        <el-menu-item index="/home/volunteer-management">
          <i class="el-icon-user-solid"></i>志愿者账户管理
        </el-menu-item>
      </router-link>

      <router-link to="/home/learning-management">
        <el-menu-item index="/home/learning-management">
          <i class="el-icon-document"></i>学习任务管理
        </el-menu-item>
      </router-link>

      <router-link to="/home/interactive-management">
        <el-menu-item index="/home/interactive-management">
          <i class="el-icon-document"></i>交互任务管理
        </el-menu-item>
      </router-link>

      <router-link to="/home/volunteer-review">
        <el-menu-item index="/home/volunteer-review">
          <i class="el-icon-box"></i>志愿者资质审核
        </el-menu-item>
      </router-link>

      <router-link to="/home/children-review">
        <el-menu-item index="/home/children-review">
          <i class="el-icon-box"></i>儿童资质审核
        </el-menu-item>
      </router-link>

      <router-link to="/home/organization-review">
        <el-menu-item index="/home/organization-review">
          <i class="el-icon-s-management"></i>志愿者组织资质审核
        </el-menu-item>
      </router-link>

      <router-link to="/home/fund-management">
        <el-menu-item index="/home/fund-management">
          <i class="el-icon-s-management"></i>资金管理
        </el-menu-item>
      </router-link>

      <router-link to="/home/material-management">
        <el-menu-item index="/home/material-management">
          <i class="el-icon-s-management"></i>物资管理
        </el-menu-item>
      </router-link>
    </el-menu>
    <span class="user">
      你好，<a class="username">{{this.$store.state.user.name}}</a>！
    </span>
  </div>
</template>

<script>

import router from "@/router";

export default {
  name: "TopBar",
  methods: {
    toHome() {
      router.push('/home/main');
    },
  }
};

</script>

<style lang="scss" scoped>

.messageIndex {
  z-index: 100 !important;
}

.top-bar {
  display: flex;
  align-items: center;
  background: url("../../assets/img/top.jpg") no-repeat;
  background-size: cover;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 10000;
}

.logo {
  margin-left: 1%;
  margin-right: 1%;
  width: 80px;
}

.menu {
  flex: 10;
  background: transparent;

  .el-menu-item {
    font-size: 15px;
    font-weight: bold;
  }
}

.el-menu-item {
  color: black;
  background: transparent !important;
}

.icon {
  color: black !important;
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

.el-menu-item.is-active {
  color: #409EFF !important;
  background: transparent !important;

  .icon {
    color: #409EFF !important;
  }
}

a {
  text-decoration: none;
}

.user{
  flex: 1;
  text-align: right;
  margin-right: 2%;
  font-size: 16px;
  font-weight: bold;
}

.username {
  color: #409EFF !important;
}

.username:hover {
  color: #207EFF !important;
  cursor: pointer;
}

</style>
