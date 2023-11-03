<template>

  <el-container>
    <img id="bg" alt="bg" src="../../assets/img/fullstack.jpg">
    <el-main>
      <el-card class="box-card login-card">
        <img id="logo" alt="logo" src="../../assets/img/logo.png">
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
                <span style="font-size: 15px">记住我</span>
              </el-checkbox>
              <a id="register" @click="toRegister">新用户注册</a>
            </div>
          </el-form-item>
          <el-form-item class="item">
            <el-button id="login" type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>

import request from "@/api";
import router from "@/router";
import CryptoJS from 'crypto-js'

export default {
  name: "login",
  created() {
    if (localStorage.getItem("username") !== null && localStorage.getItem("password") !== null) {
      this.user.username = localStorage.getItem("username");
      this.user.password = localStorage.getItem("password");
      if (localStorage.getItem("auto") !== null) {
        this.auto = true;
      }
    }
  },
  mounted() {
    if (localStorage.getItem("auto") !== null) {
      this.login();
    }
  },
  data() {
    return {
      name: '',
      user: {
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
    login() {
      //进行表单验证
      this.$refs.user.validate(valid => {
        //表单验证成功
        if (valid) {
          console.log(JSON.stringify({
            username: this.user.username,
            password: this.user.password,
          }));
          request.post('/administrator/user/login', JSON.stringify({
            username: this.user.username,
            password: this.user.password,
          })).then(res => {
            if (res.data !== null && 'username' in res.data && res.data.username !== null) {
              this.$message({
                message: '登录成功！',
                type: 'success',
                offset: 50,
                duration: 500
              });
              //自动登录
              if (this.auto) {
                localStorage.setItem("username", this.user.username);
                localStorage.setItem("password", this.user.password);
                localStorage.setItem("auto", "true");
              } else {
                localStorage.removeItem("auto");
                localStorage.removeItem("username");
                localStorage.removeItem("password");
              }

              sessionStorage.setItem("token", res.data.id);

              if (res.data.username !== 'admin') {
                router.push({
                  path: '/project',
                  query: {
                    id: res.data.id
                  }
                })
              } else {
                router.push({
                  path: '/user',
                  query: {
                    username: res.data.username
                  }
                })
              }
            } else {
              this.$message({
                message: '用户名或密码不正确，请重新输入',
                type: 'error'
              });
              localStorage.removeItem("auto");
              localStorage.removeItem("username");
              localStorage.removeItem("password");
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$message({
            message: '输入格式不正确，请重新输入',
            type: 'error'
          });
        }
      });
    },
    toRegister() {
      console.log("register");
      router.push({
        path: '/register',
      })
    },
  },
};

</script>

<style scoped>

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
}

#bg {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 5;
}


#logo {
  height: 50px;
  margin-bottom: 20px;
}

.login-card {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  width: 450px;
  height: 370px;
  border-radius: 10px;
  text-align: center;
  z-index: 20;
  padding: 10px;
}

.el-button {
  font-size: 16px;
  background-color: #207EFF;
  border: #207EFF;
  height: 40px;
  display: block;
  text-align: center;
  border-radius: 5px;
  flex-basis: 90%;
}

.input {
  margin-bottom: 20px;
}

.item {
  margin-bottom: 30px;
  text-align: center;
}

#choice {
  margin-left: 20px;
  margin-right: 20px;
}

.el-checkbox {
  color: #C0C0C0;
}

#register {
  margin-left: 210px;
  font-size: 15px;
}

#register:hover {
  cursor: pointer;
  color: #207EFF;
}

#login {
  margin: auto;
  width: 400px;
  background-color: #409EFF;
  border: #409EFF;
}

#login:hover {
  cursor: pointer;
  background-color: #207EFF;
  border: #207EFF;
}

a {
  color: #409EFF;
}

>>> .el-input__inner {
  width: 400px;
  height: 40px;
}

:deep(input) {
  width: 350px;
  height: 40px;
  border: none;
}

</style>
