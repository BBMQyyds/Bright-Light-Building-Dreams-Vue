<template>
  <el-dialog v-model="registerVisible" class="width" destroy-on-close title="用户注册">
    <el-card class="box-card register-card">
      <el-form
          ref="user"
          :model="user"
          :rules="rules"
          label-width="0">
        <el-form-item class="input" prop="username">
          <el-input
              v-model="user.username"
              placeholder="请输入用户名">
          </el-input>
        </el-form-item>

        <el-form-item class="input" prop="password">
          <el-input
              v-model="user.password"
              placeholder="设置密码（6-32位字母、数字或特殊符号）"
              show-password
              type="password">
          </el-input>
        </el-form-item>

        <el-form-item class="input" prop="confirm">
          <el-input
              v-model="user.confirm"
              placeholder="确认密码"
              show-password
              type="password">
          </el-input>
        </el-form-item>
        <el-form-item class="item">
          <el-button id="create" type="primary" @click="register">创建用户</el-button>
        </el-form-item>
        <el-form-item class="item">
          <a id="register">
            <span id="a1">已有账号？</span>
            <span id="a2" @click="login">立即登录</span>
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
  name: "RegisterCard",
  data() {
    return {
      registerVisible: false,
      user: {
        username: "",
        password: "",
        confirm: "",
      },
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
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    register() {
      //进行表单验证
      this.$refs.user.validate(valid => {
        //表单验证成功
        if (valid) {
          if (this.user.password === this.user.confirm) {
            request.post('/user', JSON.stringify({
              apiType: this.$aes.encrypt('register'),
              data: this.$aes.encrypt(JSON.stringify({
                username: this.user.username,
                password: CryptoJS.MD5(this.user.password).toString(),
              })),
            })).then(response => {
              if (response.data.code === '200') {
                this.$msg({
                  customClass: 'messageIndex',
                  duration: 1000,
                  type: 'success',
                  message: this.$aes.decrypt(response.data.message)
                });
                this.registerVisible = false;
              } else {
                this.$msg({
                  customClass: 'messageIndex',
                  duration: 1000,
                  type: 'error',
                  message: this.$aes.decrypt(response.data.message)
                });
              }
            });
          } else {
            this.$msg({
              customClass: 'messageIndex',
              duration: 1000,
              message: '两次输入的密码不一致，请重新输入',
              type: 'error'
            });
          }
        } else {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            message: '输入格式不正确，请重新输入',
            type: 'error'
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
    },
    login() {
      eventBus.emit('login');
    },
  }
}
</script>

<style scoped>

.messageIndex {
  z-index: 20000 !important;
}

.register-card {
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

#create {
  margin: auto;
}

#create:hover {
  background-color: #FF8C00;
  border: #FF8C00;
}

#register {
  margin: auto;
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