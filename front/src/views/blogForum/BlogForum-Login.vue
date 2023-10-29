<template>
  <el-container class="background">
    <el-main>
      <el-button id="index_btn" type="primary" @click="toIndex">返回首页</el-button>
      <el-button id="register_btn" type="primary" @click="toRegister">注册</el-button>

      <el-card class="box-card login-card">
        <span class="login-title">登录</span>
        <el-form
          ref="user"
          :model="user"
          :rules="rules"
          label-width="auto">
          <el-form-item class="input" prop="username">
            <el-input
              v-model="user.username"
              placeholder="用户名">
            </el-input>
          </el-form-item>
          <el-form-item class="input" prop="password">
            <el-input
              v-model="user.password"
              placeholder="请输入登录密码"
              show-password
              type="password">
            </el-input>
          </el-form-item>
          <el-form-item class="item">
            <div id="choice">
              <el-checkbox id="auto" v-model="auto">
                下次自动登录
              </el-checkbox>
              <div id="update" @click="toUpdate">修改密码</div>
            </div>
          </el-form-item>
          <el-form-item class="item">
            <el-button id="login" type="primary" @click="login">登录</el-button>
          </el-form-item>
          <el-form-item class="item">
            <a id="register" @click="toRegister">立即注册</a>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
  import request from "../../util/request";
  import Encrypt from "encryptlong"
  export default {
    name: "BlogForum-Login",
    created() {
      this.toMain();
      this.getPublicKey();
    },
    mounted() {
      if (localStorage.getItem("auto") !== null) {
        this.login();
      }
    },
    data() {
      return {
        PublicKey:'',
        name: '',
        user: {
          username: "",
          password: ""
        },
        commit: {
          username: "",
          password: ""
        },
        auto: false,
        rules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'},
            {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur'}
          ],
        }
      };
    },
    methods: {
      getPublicKey(){
        console.log("前往后端获取公钥");
        request.post('/Login/getPublicKey',this.$store.state.commonsModule.RequestBody).then(res => {
          this.PublicKey=res.data.data;
          console.log("获取公钥为："+this.PublicKey);
        }).catch(err => {
          console.log(err);
        });
      },
      login() {
        const encryptor = new Encrypt();
        encryptor.setPublicKey(this.PublicKey);
        this.commit.password=encryptor.encrypt(this.user.password);
        this.commit.username=encryptor.encrypt(this.user.username);
        this.$store.state.commonsModule.RequestBody.ip=localStorage.getItem("localIp")
        this.$store.state.commonsModule.RequestBody.data=JSON.stringify(this.commit);
        request.post('/Login/login', this.$store.state.commonsModule.RequestBody,{ withCredentials: true }).then(res => {
          console.log(res);
          if(res.data.code === 200) {
            if(res.data.msg==="success"){
              this.$message({
                message: '登录成功',
                type: 'success'
              });
              this.user.username = "";
              this.user.password = "";
              localStorage.setItem("user", res.data.data);
              this.setTime();
              this.$router.push('/BlogForum');
            }else if(res.data.msg === "failure"){
              this.$message({
                message: '登录失败，账号密码错误',
                type: 'warning'
              });
            }
          }else if(res.data.code === 401) {
            this.$message({
              message: '服务器出现异常，请重试',
              type: 'error'
            });
          }
        }).catch(err => {
          console.log(err);
        });
      },
      toRegister() {
        // 使用 router.push() 导航到注册页面
        this.$router.push('/BlogForum-Register');
      },
      toMain(){
        if(localStorage.getItem("user")!==null){
          this.$router.push('/BlogForum');
        }
      },
      toIndex() {
        // 使用 router.push() 导航到首页
        this.$router.push('/HomePage');
      },
      setTime(){
        const time=new Date().getTime();
        const expirationTime = 24 * 60 * 60 * 1000; // 24小时（以毫秒为单位）
        localStorage.setItem("time",time);
        localStorage.setItem("expirationTime",expirationTime);

      },
      toUpdate(){

      }
    },
  };

</script>

<style scoped>
  .background{
    background: url("../../assets/login_bg.jpg");
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
    padding: 0; /* 去除默认的页面内边距 */
  }
  el-main {
    position: center;
  }
  .el-input{
    width: 350px;
    height: 40px;
    border: none;
  }
  #logo {
    height: 90px;
    position: absolute;
    top: 3%;
    left: 2%;
    z-index: 10;
  }

  #logo:hover {
    cursor: pointer;
  }

  .login-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    width: 450px;
    height: 400px;
    border-radius: 15px;
    text-align: center;
    z-index: 20;
    padding: 10px;
  }

  .login-title {
    font-size: 24px;
    font-weight: bold;
    color: #333333;
    display: block;
    text-align: left;
    margin-bottom: 30px;
    margin-left: 22px;
  }

  .el-button {
    font-size: 16px;
    background-color: #F39C12;
    border: #F39C12;
    height: 40px;
    display: block;
    text-align: center;
    border-radius: 5px;
    flex-basis: 90%;
  }

  #register_btn {
    float: right;
    margin-right: 20px;
    margin-top: 20px;
    position: relative;
    z-index: 15;
    color: #FFFFFF;
    background-color: transparent;
    border: 1px solid #FFFFFF;
    border-radius: 50px;
  }

  #index_btn {
    float: right;
    margin-right: 40px;
    margin-top: 20px;
    position: relative;
    right: 0;
    z-index: 15;
    color: #FFFFFF;
    background-color: transparent;
    border: 1px solid #FFFFFF;
    border-radius: 50px;
  }

  #register_btn:hover {
    border: 2px solid #FFFFFF;
  }

  #index_btn:hover {
    border: 2px solid #FFFFFF;
  }

  .input {
    margin-bottom: 20px;
  }

  .item {
    margin-bottom: 10px;
    text-align: center;
  }

  #choice {
    margin-left: 20px;
    margin-right: 20px;
  }

  .el-checkbox {
    color: #C0C0C0;
  }

  #update {
    font-size: 14px;
  }

  #update:hover {
    cursor: pointer;
    color: #F39C12;
  }

  #login {
    margin: auto;
    width: 400px;
  }

  #login:hover {
    background-color: #FF8C00;
    border: #FF8C00;
  }

  #register {
    margin: auto;
    font-size: 16px;
    color: #409EFF;
  }

  #register:hover {
    cursor: pointer;
    color: #207EFF;
  }

  :deep(input) {
    width: 350px;
    height: 40px;
    border: none;
  }

  a {
    text-decoration: underline;
  }

</style>
