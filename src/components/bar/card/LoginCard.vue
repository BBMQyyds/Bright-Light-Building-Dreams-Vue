<template>
  <el-dialog v-model="loginVisible" class="width" destroy-on-close title="用户登录">
    <el-card class="box-card login-card">
      <el-form
          ref="user"
          :model="user"
          :rules="rules"
          label-width="0">
        <el-form-item class="input" prop="username">
          <el-input v-model="user.username"
                    name="username"
                    placeholder="用户名">
          </el-input>
        </el-form-item>

        <el-form-item class="input" prop="password">
          <el-input v-model="user.password"
                    name="password"
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
            <a id="forget" @click="forget">忘记密码</a>
          </div>
        </el-form-item>
        <el-form-item class="item">
          <el-button id="login" type="primary" @click="login">登录</el-button>
        </el-form-item>
        <el-form-item class="item">
          <a id="register">
            <span id="a1">没有账号？</span>
            <span id="a2" @click="register">立即注册</span>
          </a>
        </el-form-item>
      </el-form>
    </el-card>
  </el-dialog>
</template>

<script>

import {eventBus} from "@ai-zen/event-bus";
import request from "@/api";
import CryptoJS from "crypto-js";

export default {
  name: "LoginCard",
  props: {
    getAvatar: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      loginVisible: false,
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
    }
  },
  methods: {
    login() {
      this.$refs.user.validate((valid) => {
        if (valid) {
          console.log(CryptoJS.MD5(this.user.password));
          request.post('/user', JSON.stringify({
            apiType: this.$aes.encrypt('login'),
            data: this.$aes.encrypt(JSON.stringify({
              username: this.user.username,
              password: CryptoJS.MD5(this.user.password).toString(),
            })),
          })).then(response => {
            if (response.data.code === '200') {
              this.$store.commit('setUser', JSON.parse(this.$aes.decrypt(response.data.data)));
              if (this.auto) {
                this.$store.commit('setAuto', true);
              } else {
                this.$store.commit('setAuto', false);
              }
              this.$msg({
                customClass: 'messageIndex',
                duration: 1000,
                type: 'success',
                message: '登录成功'
              });
              this.getAvatar();
              this.loginVisible = false;
            } else {
              this.$msg({
                customClass: 'messageIndex',
                duration: 1000,
                type: 'error',
                message: this.$aes.decrypt(response.data.message)
              });
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
        } else {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            type: 'error',
            message: '用户名或密码错误'
          });
        }
      });
    },
    register() {
      eventBus.emit('register');
    },
    forget() {
      eventBus.emit('forget');
    }
  }
}
</script>

<style scoped>

.messageIndex {
  z-index: 20000 !important;
}

.login-card {
  background: transparent;
  width: 450px;
  height: 320px;
  text-align: center;
  z-index: 100;
  box-shadow: none !important;
  border: none !important;
}

.el-button {
  font-size: 16px;
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
  color: #333333;
}

#forget {
  margin-left: 210px;
  font-size: 13px;
}

#forget:hover {
  cursor: pointer;
  color: #F39C12;
}

#login {
  margin: auto;
}

#register {
  margin: auto;
  font-size: 16px;
  color: #409EFF;
}

#register:hover {
  cursor: pointer;
  color: #409EFF;
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
  color: #FF8C00;
}

</style>

<style>
.width {
  width: 500px !important;
  border-radius: 15px !important;
}
</style>