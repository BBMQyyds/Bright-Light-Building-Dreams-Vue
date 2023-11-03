<template>

  <el-card v-show="isCardVisible" class="card">
    <div class="card-header">
      <div class="username">{{ user.username }}</div>
    </div>
    <hr>
    <el-table
        :cell-style="{'text-align':'center','cursor':'pointer'}"
        :data="[{fan_count: user.fan_count, follow_count: user.follow_count, tale_count: user.tale_count,
         segment_count: user.segment_count}]"
        :header-cell-style="{'text-align':'center'}">
      <el-table-column label="粉丝" prop="fan_count">
        <template v-slot:default="scope">
          <div @click="toInfoPage()">{{ user.fan_count }}</div>
        </template>
      </el-table-column>
      <el-table-column label="关注" prop="follow_count">
        <template v-slot:default="scope">
          <div @click="toInfoPage()">{{ user.follow_count }}</div>
        </template>
      </el-table-column>
      <el-table-column label="故事" prop="tale_count">
        <template v-slot:default="scope">
          <div @click="toInfoPage()">{{ user.tale_count }}</div>
        </template>
      </el-table-column>
      <el-table-column label="章节" prop="segment_count">
        <template v-slot:default="scope">
          <div @click="toInfoPage()">{{ user.segment_count }}</div>
        </template>
      </el-table-column>
    </el-table>
    <hr>
    <el-menu class="menu">
      <el-menu-item @click="toCenterPage"><img alt="用户" src="../../../assets/img/icon/user.png"><span
          class="span1">个人中心</span></el-menu-item>
      <el-menu-item @click="logout"><img alt="登出" class="logout" src="../../../assets/img/icon/logout.png"><span
          class="span2">退出登录</span>
      </el-menu-item>
    </el-menu>
    <hr>
  </el-card>
</template>

<script>
import router from "@/router";

export default {
  name: "AvatarCard",
  data() {
    return {
      user: this.$store.state.user,
      isCardVisible: false,
    };
  },
  methods: {
    toInfoPage() {
      this.isCardVisible = false;
      router.push({path: '/personal/center'});
    },
    toCenterPage() {
      this.isCardVisible = false;
      router.push({path: '/personal/center'});
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
      router.push({path: '/home/main'});
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
  border-radius: 15px;
}

.username {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.img {
  margin-right: 50px;
}

.logout {
  margin-left: 3px;
}

.el-submenu__title {
  border-radius: 10px !important;
}

.menu {
  width: 300px;
  margin: 20px auto auto;
  border: none !important;
}

.el-menu-item {
  font-size: 16px;
}

.el-table {
  border: 1px solid #ccc;
  border-radius: 10px !important;
}

hr {
  border: 0;
  background-color: #D8D8D8;
  height: 1px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.span1 {
  margin-left: 23px;
}

.span2 {
  margin-left: 20px;
}

:deep(.el-table__body tr:hover > td) {
  color: #409EFF !important;
  background: #F5F7FA !important;
}

</style>