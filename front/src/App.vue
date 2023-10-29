<template>
  <div id="app">
    <div class="NavMenu">
      <div class="logo" v-if="shouldShowMiddleSection">
      </div>
      <NavMenu v-if="shouldShowMiddleSection"></NavMenu>
    </div>
    <div id="backdrop" class="except-Login" v-if="shouldShowMiddleSection">
      <!-- 使用伪元素创建白色长方形 -->
      <div class="white-rectangle"></div>
    </div>
    <div id="identity">
      <Identity v-if="shouldShowMiddleSection" :imageUrl="imageUrl"></Identity>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import NavMenu from "./components/NavMenu.vue";
  import Identity from "./components/Identity.vue";
  import router from "./router";
  import request from "./util/request";
  export default {
    name: 'App',
    data(){
      return{
        imageUrl: "",
      }
    },
    components: {
      NavMenu,
      Identity
    },
    mounted() {
      this.checkTime();
      if(localStorage.getItem("user")!==null&&this.imageUrl===""){
        console.log("获取头像");
        this.getAvatar();
      }
    },
    created() {
      if (localStorage.getItem("localIp") === null) {
        this.fetchPublicIpAddress();
      } else {
        console.log("本地地址已获取")
      }
    },
    computed: {
      shouldShowMiddleSection() {
        // 获取当前路由的名称
        const currentRouteName = this.$route.name;
        // 判断当前路由是否不等于 'BLogForum-Login' 且不等于 'BlogForum-Register'
        return currentRouteName !== 'BLogForum-Login' && currentRouteName !== 'BLogForum-Register';
      },
    },
    methods: {
      checkTime(){
        const currentTime=new Date().getTime();
        const storedTime=localStorage.getItem("time");
        const expirationTime=localStorage.getItem("expirationTime");
        if(storedTime===null||expirationTime===null){
          localStorage.removeItem("user");
          return false;
        }else{
          if(currentTime-storedTime<=expirationTime) {
            localStorage.setItem("time",currentTime);
            return true;
          }else{
            this.$router.push('/BlogForum-Login');
            localStorage.removeItem("time");
            localStorage.removeItem("expirationTime");
            return false;
          }
        }
      },
      //获取ip
      fetchPublicIpAddress() {
        // 使用一个可靠的 IP 查询服务
        const apiUrl = "https://api.ipify.org?format=json";
        // 发送 GET 请求
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            if (data && data.ip) {
              // 将 IP 地址存储到 Vuex 中
              localStorage.setItem("localIp", data.ip);
              console.log("获取本地的IP address: " + data.ip);
            } else {
              console.error("Failed to get IP address");
            }
          })
          .catch((error) => {
            console.error("Error: " + error);
          });
      },
      getAvatar(){
        if(this.imageUrl===""){
          let user=JSON.parse(localStorage.getItem("user"));
          this.$store.state.commonsModule.RequestBody.ip=localStorage.getItem("localIp");
          this.$store.state.commonsModule.RequestBody.data=user.userId;
          request.post("/File/getAvatar",this.$store.state.commonsModule.RequestBody,{responseType: 'blob',withCredentials:true}).then(res=>{
            let blob = new Blob([res.data], { type: "application/octet-stream" });
            let url = window.URL.createObjectURL(blob);
            console.log(url);
            this.imageUrl=url;
          }).catch(err=>{
            console.log(err);
          })
        }
      },
    }

  }
</script>

<style>
  .logo{
    z-index: 1000;
    position: absolute;
    background: url("assets/Logo4.png");
    width: 115px;
    height: 48px;
    background-size: cover; /* 使用 cover 填充整个背景容器 */
    top: 10px; /* 距离顶部的距离，根据需要调整 */
    left: 20px; /* 距离左侧的距离，根据需要调整 */
  }
  #backdrop {
    background: rgba(199, 185, 185, 0.5);
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
    padding: 0; /* 去除默认的页面内边距 */
    overflow: hidden; /* 禁止溢出 */
    flex-direction: column; /* 垂直布局 */
    justify-content: center; /* 在垂直方向上居中对齐内容 */
    align-items: center; /* 在水平方向上居中对齐内容 */
    opacity: 1; /* 设置背景图片的透明度 */
  }
  .NavMenu{
    display: flex;
  }

  /* 创建白色长方形 */
  .white-rectangle {
    z-index: -1;
    width: 55%; /* 宽度 */
    height: 100%; /* 高度 */
    background-color: white; /* 白色背景 */
    position: absolute; /* 绝对定位 */
    top: 50%; /* 从顶部垂直居中 */
    left: 42%; /* 从左侧水平居中 */
    transform: translate(-50%, -50%); /* 居中对齐 */
  }
  #identity{
    position: absolute;
    margin-left: 77%;
    z-index: 9999; /* 设置一个较高的 z-index 值，例如9999 */
  }

</style>
