<template>
  <div class="content">
    <div id="menu">
      <el-menu class="menu">
        <div class="avatar">
          <el-avatar :size="70" :src="imageUrl" id="avatar"></el-avatar>
          <div class="username">{{ username }}</div>
        </div>
        <router-link to="/CreatePost">
          <el-button class="active-item" index="CreatePost">
            <i class="el-icon-circle-plus-outline"></i>
            <span>创建帖子</span>
          </el-button>
        </router-link>
        <router-link to="">
        <el-button class="active-item" index="manage">
          <i class="el-icon-s-home"></i>
          <span>我的帖子</span>
        </el-button>
        </router-link>
        <router-link to="">
        <el-button class="active-item" id="star" index="star">
          <i class="el-icon-star-off"></i>
          <span>收藏的帖子</span>
        </el-button>
        </router-link>
        <router-link to="/Personal">
          <el-button class="active-item" id="house" index="house">
            <i class="el-icon-s-check"></i>
            <span>个人主页</span>
          </el-button>
        </router-link>
      </el-menu>
    </div>
  </div>
</template>

<script>
  import request from "../util/request";
  export default {
    name: "Identity",
    data() {
      return {
        activeMenu: "",
      };
    },
    props: {
      imageUrl: String, // 假设imageUrl是一个字符串类型
    },
    created() {
      console.log(this.imageUrl);
    },
    computed: {
      username() {
        if (localStorage.getItem("user") !== null) {
          let user = JSON.parse(localStorage.getItem("user"));
          return user.username;
        } else {
          return "游客";
        }
      },
    },
    methods: {
    },
  };
</script>


<style scoped>
  .content {
    width: 250px;
  }


  .avatar #avatar{
    margin-top: 3%;
    margin-left: 39%;
    width: 70px;
    height: 120px;
    display: block;
  }

  .username {
    text-align: center;
  }


  .menu {
    width: 120%; /* 导航栏的宽度 */
    background-color: #eeeeee;
    border: none;
  }


  .el-button {
    width: 100%;
    font-size: 16px;
    height: 50px;
  }

  .active-item {
    font-weight: bold; /* 设置选中时的字体加粗 */
    color: #000000;
  }


  /*去除下划线*/
  a{
    text-decoration: none !important;
  }
</style>
