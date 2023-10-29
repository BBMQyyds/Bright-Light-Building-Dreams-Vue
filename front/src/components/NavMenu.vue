<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <div class="menu-container">
        <div class="first-item">
          <router-link to="/Home_page">
            <el-menu-item index="1" >
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </el-menu-item>
          </router-link>
        </div>
        <div>
          <el-submenu index="/source">
            <template slot="title">
              <i class="el-icon-share"></i> <!-- 添加图标 -->
              源码分享处
            </template>
            <el-menu-item index="/source/github" @click="goToGitHub">GitHub</el-menu-item>
            <el-menu-item index="/source/gitee" @click="goToGitee">Gitee</el-menu-item>
          </el-submenu>
        </div>
        <div>
          <router-link :to="canNavigate ? '/BlogForum' : '/BlogForum-Login'">
            <el-menu-item index="3">
              <i class="el-icon-s-promotion"></i>
              <span slot="title">博客论坛</span>
            </el-menu-item>
          </router-link>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      goToGitHub() {
        // 在这里添加跳转到 GitHub 主页的代码
        window.location.href = 'https://github.com/ffzzfz';
      },
      goToGitee() {
        // 在这里添加跳转到 Gitee 主页的代码
        window.location.href = 'https://gitee.com/fzzffz';
      }
    },
    computed: {
      // 使用computed属性来获取vuex中的user.username
      username() {
        return this.$store.state.commonsModule.User.userName;
      },
      // 根据user.username是否为空来决定是否允许跳转
      canNavigate() {
        return !!this.username; // 双感叹号用于将值转换为布尔类型
      },
    },
  }
</script>

<style scoped>
  .first-item {
    display: flex;
    margin-left: 380px;
    align-items: center; /* 在垂直方向上居中对齐 */
    height: 100%; /* 设置高度以充满整个导航栏 */
  }

  .el-menu-item {
    margin-left: 30px;
    width: 120px;
    display: flex; /* 使用Flex布局 */
    align-items: center; /* 在水平方向上居中对齐文本 */
  }

  /*去除下划线*/
  .router-link-active {
    text-decoration: none;
  }

  a {
    text-decoration: none;
  }
  .menu-container {
    display: flex;
    align-items: center;
  }

</style>
