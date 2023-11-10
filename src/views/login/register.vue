<template>

  <el-container>
    <img id="bg" alt="bg" src="../../assets/img/fullstack.jpg">
    <el-main>
      <el-card class="box-card register-card">
        <img id="logo" alt="logo" src="../../assets/img/logo.png">
        <el-form
            ref="user"
            :model="user"
            :rules="rules"
            label-width="auto">
          <el-form-item class="input" prop="username">
            <el-input
                v-model="user.username"
                placeholder="请输入用户名">
            </el-input>
          </el-form-item>

          <el-form-item class="input" prop="name">
            <el-input
                v-model="user.name"
                placeholder="请输入姓名">
            </el-input>
          </el-form-item>

          <el-form-item class="input" prop="phone">
            <el-input
                v-model="user.phone"
                placeholder="请输入手机号">
            </el-input>
          </el-form-item>

          <el-form-item class="input" prop="idNumber">
            <el-input
                v-model="user.idNumber"
                placeholder="请输入身份证号">
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
              <span id="a2" @click="toLogin">立即登录</span>
            </a>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>

import request from "@/api";
import router from "@/router";

export default {
  name: "register",
  data() {
    return {
      name: '',
      user: {
        username: "",
        name: "",
        sex: 0,
        phone: "",
        idNumber: "",
        password: "",
        confirm: "",
      },
      auto: false,
      rules: {
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '姓名不能为空', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '性别不能为空', trigger: 'blur'},
        ],
        phone: [
          {required: true, message: '手机号不能为空', trigger: 'blur'},
          {min: 11, max: 11, message: '长度为 11 个字符', trigger: 'blur'}
        ],
        idNumber: [
          {required: true, message: '身份证号不能为空', trigger: 'blur'},
          {min: 18, max: 18, message: '长度为 18 个字符', trigger: 'blur'}
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
    };
  },
  methods: {
    register() {
      //进行表单验证
      this.$refs.user.validate(valid => {
        //表单验证成功
        if (valid) {
          if (this.user.password !== this.user.confirm) {
            this.$msg({
              message: '两次输入的密码不一致，请重新输入',
              type: 'error'
            });
            return;
          }
          request.post('/administrator/user/register', JSON.stringify({
            username: this.user.username,
            name: this.user.name,
            phone: this.user.phone,
            idNumber: this.user.idNumber,
            password: this.user.password,
          })).then(res => {
            if (res.data.code === 0) {
              this.$msg({
                message: '创建成功！',
                type: 'success',
                duration: 500
              });
              router.push({
                path: '/login',
              })
            } else {
              this.$msg({
                message: '该用户名已存在，请重新输入',
                type: 'error'
              });
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$msg({
            message: '输入格式不正确，请重新输入',
            type: 'error'
          });
        }
      });
    },
    toLogin() {
      console.log("toLogin");
      router.push({
        path: '/login',
      })
    },
  },
};

</script>

<style scoped>

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

.register-card {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  width: 450px;
  height: 600px;
  border-radius: 15px;
  text-align: center;
  z-index: 20;
  padding: 10px;
}

.el-button {
  font-size: 16px;
  background-color: #409EFF;
  border: #409EFF;
  height: 40px;
  display: block;
  text-align: center;
  border-radius: 5px;
  flex-basis: 90%;
}

.input {
  margin-bottom: 25px;
}

.item {
  margin-bottom: 15px;
  text-align: center;
}

#create {
  margin: auto;
  width: 400px;
}

#create:hover {
  background-color: #409EFF;
  border: #409EFF;
}

#register {
  margin: auto;
  font-size: 16px;
  color: #409EFF;
}

#register:hover {
  color: #519EFF;
}

#a1 {
  color: #000000;
}

#a2:hover {
  cursor: pointer;
  color: #207EFF;
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
