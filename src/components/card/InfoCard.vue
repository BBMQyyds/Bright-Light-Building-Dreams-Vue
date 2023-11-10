<template>

  <el-card v-show="isCardVisible" class="card">
    <div class="card-header">
      <div class="username">{{ user.name }}：{{ user.username }}</div>
    </div>
    <hr>
    <el-menu class="menu">
      <el-menu-item @click="logout">
        <img alt="登出" class="logout" src="../../assets/img/icon/logout.png" style="width: 20px;margin-left: -5px">
        <span class="span2">退出登录</span>
      </el-menu-item>
    </el-menu>
    <hr>
  </el-card>
</template>

<script>
import router from "@/router";

export default {
  name: "InfoCard",
  data() {
    return {
      user: this.$store.state.user,
      isCardVisible: false,
    };
  },
  methods: {
    toInfoPage() {
      this.isCardVisible = false;
      router.push({path: '/home/admin-info'});
    },
    logout() {
      this.$store.commit('logout');
      this.$cookies.remove('token');
      this.$msg({
        customClass: 'messageIndex',
        duration: 1000,
        message: '登出成功',
        type: 'success'
      });
      router.push({path: '/login'});
    }
  },
}
</script>

<style scoped>

.messageIndex {
  z-index: 20000 !important;
}

.card {
  text-align: center;
  justify-content: center;
  border-radius: 5px;
}

.username {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
}

.logout {
  margin-left: 3px;
}

.menu {
  width: 150px;
  margin: 5px auto auto;
  border: none !important;
}

.el-menu-item {
  font-size: 15px;
}

hr {
  border: 0;
  background-color: #EEEEEE;
  height: 1px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.span1 {
  margin-left: 25px;
}

.span2 {
  margin-left: 25px;
}

:deep(.el-table__body tr:hover > td) {
  color: #409EFF !important;
  background: #F5F7FA !important;
}

</style>