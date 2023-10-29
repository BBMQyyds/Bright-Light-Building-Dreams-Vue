<template>
  <el-container class="background">
    <el-main>
      <el-button id="index_btn" type="primary" @click="toIndex">返回首页</el-button>
      <el-button id="login_btn" type="primary" @click="toLogin">登录</el-button>

      <el-card class="box-card register-card">
        <span class="register-title">注册</span>
        <el-form
          ref="user"
          :model="inputData"
          :rules="rules"
          label-width="auto">
          <el-form-item class="input" prop="username">
            <el-input
              v-model="inputData.username"
              placeholder="请输入用户名">
            </el-input>
          </el-form-item>

          <el-form-item class="input" prop="password">
            <el-input
              v-model="inputData.password"
              placeholder="设置密码（6-32位字母、数字或特殊符号）"
              show-password
              type="password">
            </el-input>
          </el-form-item>

          <el-form-item class="input" prop="confirm">
            <el-input
              v-model="inputData.confirm"
              placeholder="确认密码"
              show-password
              type="password">
            </el-input>
          </el-form-item>

          <!-- 在这里添加日期选择器 -->
          <el-form-item class="input" prop="date">
            <el-date-picker
              v-model="inputData.date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item class="item">
            <el-button id="create" type="primary" @click="register">创建用户</el-button>
          </el-form-item>
          <el-form-item class="item">
            <a id="register">
              <span id="a1">已有账号？</span>
              <span id="a2" @click="toLogin">立即登录</span>
            </a>
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
    name: "BlogForum-Register",
    data() {
      return {
        PublicKey:'',
        name: '',
        inputData: {
          username: "",
          password: "",
          confirm: "",
          date:""
        },
        user:{
          username: "",
          password: "",
          birthday:""
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
          confirm: [
            {required: true, message: '重复密码不能为空', trigger: 'blur'},
            {min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur'},
          ],
        }
      };
    },
    created() {
      // 在页面初始化时获取RegisterToken
        if(this.$store.state.commonsModule.RequestBody.identity==="") {
          this.getRegisterToken();
        }else{
          console.log("注册令牌已获取,为"+this.$store.state.commonsModule.RequestBody.identity)
        }

        this.getPublicKey();
    },
    methods: {
      async encryptUserData() {
        const encryptor = new Encrypt();
        encryptor.setPublicKey(this.PublicKey);
        // 异步加密用户名
        this.user.username = await encryptor.encrypt(this.inputData.username);
        // 异步加密密码
        this.user.password = await encryptor.encrypt(this.inputData.password);
        // 异步加密生日
        this.user.birthday = await encryptor.encrypt(this.inputData.date.toISOString());
        console.log("异步执行完毕")
      },
      async register() {
        if (this.inputData.password !== this.inputData.confirm) {
          this.pushMessage();
        } else if (this.inputData.username === "" || this.inputData.password === "" || this.inputData.confirm === "") {
          this.$message({
            message: '用户名或密码不能为空',
            type: 'warning'
          });
        } else if (this.inputData.date === "") {
          this.$message({
            message: '请选择出生日期',
            type: 'warning'
          });
        } else {
          await this.encryptUserData();
          this.$store.state.commonsModule.RequestBody.ip = localStorage.getItem("localIp")
          this.$store.state.commonsModule.RequestBody.data = JSON.stringify(this.user);
          request.post('/Register/register', this.$store.state.commonsModule.RequestBody, {withCredentials: true}).then(res => {
            console.log(res);
            if (res.data.code === 200) {
              this.$store.state.commonsModule.RequestBody.identity = "";
              this.$message({
                message: '注册成功',
                type: 'success'
              });
              this.$router.push('/BlogForum-Login');
            } else if (res.data.code === 501) {
              this.$message({
                message: '用户名已存在',
                type: 'warning'
              });
            } else if (res.data.code === 500) {
              this.$message({
                message: '注册失败',
                type: 'error'
              });
            }
          }).catch(err => {
            console.log(err);
          });
        }
      },
      toLogin() {
        this.$router.push('/BlogForum-Login');
      },
      toIndex() {
        this.$router.push('/HomePage');
      },
      pushMessage() {
        this.$message({
          message: '确认密码与输入密码不一致',
          type: 'warning'
        });
      },
      getPublicKey(){
        console.log("前往后端获取公钥");
        request.post('/Register/getPublicKey',this.$store.state.commonsModule.RequestBody).then(res => {
          this.PublicKey=res.data.data;
          console.log("获取公钥为："+this.PublicKey);
        }).catch(err => {
          console.log(err);
        });
      },
      getRegisterToken() {
        console.log("前往后端获取注册令牌");
        this.$store.state.commonsModule.RequestBody.ip=localStorage.getItem("localIp");
        request.post('/Register/getRegisterToken', this.$store.state.commonsModule.RequestBody,{ withCredentials: true }).then(res => {
          if(res.data.code === 200) {
            this.$store.state.commonsModule.RequestBody.identity = res.data.data;
            // console.log("获取注册令牌为："+this.$store.state.commonsModule.RequestBody.identity)
          }else if(res.data.code === 500) {
            console.log("获取注册令牌失败")
            this.$message({
              message: '获取注册令牌失败'+res.data.msg,
              type: 'error'
            });
          }
        }).catch(err => {
          console.log(err);
        });
      }
    },
    computed: {
      passwordsNotEqual() {
        // 检查密码和确认密码是否都不为空且不相等
        if(this.inputData.password !== "" &&
          this.inputData.confirm !== "" &&
          this.inputData.password !== this.inputData.confirm){
          this.pushMessage();
        }
        return "";
      },
    },
  };

</script>

<style scoped>

  el-main {
    position: center;
  }

  #bg {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 5;
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

  .register-card {
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    width: 450px;
    height: 470px;
    border-radius: 15px;
    text-align: center;
    z-index: 20;
    padding: 10px;
  }

  .register-title {
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

  .el-input{
    width: 350px;
    height: 40px;
    border: none;
  }

  #login_btn {
    float: right;
    margin-right: 20px;
    margin-top: 20px;
    position: relative;
    z-index: 15;
    background-color: transparent;
    border: 1px solid #ffffff;
    border-radius: 50px;
  }

  #index_btn {
    float: right;
    margin-right: 40px;
    margin-top: 20px;
    position: relative;
    z-index: 15;
    background-color: transparent;
    border: 1px solid #ffffff;
    border-radius: 50px;
  }

  #login_btn:hover {
    border: 2px solid #ffffff;
  }

  #index_btn:hover {
    border: 2px solid #ffffff;
  }

  .input {
    margin-bottom: 20px;
  }

  .item {
    margin-bottom: 30px;
    text-align: center;
  }

  #create {
    margin: auto;
  }

  #create:hover {
    background-color: #FF8C00;
    border: #FF8C00;
  }

  #register {
    margin: auto;
    font-size: 16px;
    color: #409EFF;
  }

  #register:hover {
    color: #519EFF;
  }

  :deep(input) {
    width: 350px;
    height: 40px;
    border: none;
  }

  #a1 {
    color: #000000;
  }

  #a2 {
    text-decoration: underline;
  }

  #a2:hover {
    cursor: pointer;
    color: #207EFF;
  }
  .background{
    background: url("../../assets/login_bg.jpg");
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
    padding: 0; /* 去除默认的页面内边距 */
  }
</style>
