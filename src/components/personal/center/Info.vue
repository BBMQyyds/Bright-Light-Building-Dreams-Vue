<template>
  <div>
    <div>
      <!-- 显示用户基本信息 -->
      <el-card style="background: transparent;border: none;box-shadow: none">
        <div slot="header" class="clearfix" style="display: flex;align-items: center;margin-left: 28%">
          <div>
            <el-avatar v-if="user" v-loading="!imageUrl"
                       :src="imageUrl"
                       size="default"></el-avatar>
            <br>
            <el-upload :auto-upload="false" :file-list="this.fileList" :on-change="handleChange"
                       accept="image/jpeg,image/jpg,image/png" action="#" class="upload-demo"
                       multiple>
              <el-button type="text">更换头像</el-button>
            </el-upload>
            <el-button v-if="this.fileList.length > 0" type="text" @click="uploadAvatar">确认更换</el-button>
          </div>
          <div style="text-align: left">
            <div class="user-name" style="margin-left: 20px;font-size: 18px;margin-bottom: 10px">
              {{ user.username }}
              <el-tag style="margin-left: 10px">&ensp;LV<span STYLE="font-size: 14px">
                {{ this.$utils.level(user.exp) }}</span>&ensp;
              </el-tag>
              <el-button style="margin-left: 20px" type="text"
                         @click="this.editName?this.editName=false:this.editName=true">编辑
              </el-button>
            </div>
            <div v-if="this.editName" class="update-username"
                 style="margin-left: 20px;font-size: 18px;margin-bottom: 10px">
              <el-input v-model="this.newName" class="name" placeholder="请输入新的用户名"
                        style="width: 180px;"></el-input>
              <el-button style="margin-left: 40px" type="text" @click="updateUsername">确定</el-button>
            </div>
            <el-tooltip :content="user.exp>=20000?user.exp:user.exp + '/' + this.$utils.nextLevel(user.exp)"
                        effect="light" placement="bottom">
              <el-progress :percentage="user.exp >= 20000 ? 100 : user.exp * 100 / this.$utils.nextLevel(user.exp)"
                           :stroke-width="15"
                           :text-inside="true"
                           class="progress"
                           striped
                           style="margin-left: 20px;margin-bottom: 5px;width: 200px"/>
            </el-tooltip>
            <div class="user-info" style="margin-left: 20px;font-size: 14px;margin-bottom: 10px">
              <el-tooltip v-if="user.intro.length > 40"
                          :content="user.intro.substring(32,user.intro.length)" effect="light" placement="bottom-end">
                <span>{{ user.intro.length > 40 ? user.intro.substring(0, 32) + '...' : user.intro }}</span>
              </el-tooltip>
              <span v-if="user.intro.length <= 40">
                {{ user.intro.length > 40 ? user.intro.substring(0, 32) + '...' : user.intro }}</span>
              <el-button style="margin-left: 20px" type="text"
                         @click="this.editIntro?this.editIntro=false:this.editIntro=true">编辑
              </el-button>
            </div>
            <div v-if="this.editIntro" class="update-intro"
                 style="margin-left: 20px;font-size: 14px;margin-bottom: 10px;align-items: center">
              <el-input v-model="this.newIntro" class="intro" placeholder="请输入新的个人简介"
                        style="width: 540px;"></el-input>
              <el-button style="margin-left: 40px" type="text" @click="updateIntro">确定</el-button>
            </div>
          </div>
        </div>
        <div style="display: flex;align-items: center;margin-left: 30%">
          <span style="font-size: 16px">粉丝数： {{ user.fan_count }}</span>
          <el-button style="margin-left: 30px" type="text" @click="this.listType='fan'">查看粉丝列表</el-button>
          <span style="font-size: 16px;margin-left: 80px">关注数： {{ user.follow_count }}</span>
          <el-button style="margin-left: 30px" type="text" @click="this.listType='follow'">查看关注列表</el-button>
        </div>
        <div style="display: flex;align-items: center;margin-left: 30%">
          <span style="font-size: 16px">故事数： {{ user.tale_count }}</span>
          <el-button style="margin-left: 30px" type="text" @click="this.listType='tale'">查看故事列表</el-button>
          <span style="font-size: 16px;margin-left: 80px">章节数： {{ user.segment_count }}</span>
          <el-button style="margin-left: 30px" type="text" @click="this.listType='segment'">查看章节列表</el-button>
        </div>
        <div style="display: flex;align-items: center;margin-left: 30%;margin-bottom: 10px;margin-top: 10px">
          <span style="font-size: 16px">邮箱：&emsp;&emsp;{{ user.email ? user.email : '未绑定' }}</span>
          <el-button v-if="!user.email" style="margin-left: 30px" type="text"
                     @click="this.editEmail?this.editEmail=false:this.editEmail=true">绑定
          </el-button>
          <el-button v-if="user.email" style="margin-left: 30px" type="text" @click="sendEmailCode">解绑</el-button>
        </div>
        <div v-if="this.editEmail"
             class="update-email" style="display: flex;align-items: center;margin-left: 30%;margin-bottom: 10px">
          <el-input v-model="this.newEmail" placeholder="请输入您的邮箱"
                    style="width: 240px;"></el-input>
          <el-button style="margin-left: 40px" type="text" @click="sendEmailCode">获取验证码</el-button>
        </div>
        <div v-if="this.confirmEmail"
             class="update-email" style="display: flex;align-items: center;margin-left: 30%;margin-bottom: 10px">
          <el-input v-model="this.emailCode" placeholder="请输入验证码"
                    style="width: 240px;"></el-input>
          <el-button style="margin-left: 40px" type="text" @click="updateEmail">确定</el-button>
        </div>
        <div style="display: flex;align-items: center;margin-left: 30%;margin-bottom: 10px">
          <span style="font-size: 16px">手机号：&emsp;&emsp;{{ user.phone ? user.phone : '未绑定' }}</span>
          <el-button v-if="!user.phone" style="margin-left: 30px" type="text"
                     @click="this.editPhone?this.editPhone=false:this.editPhone=true">绑定
          </el-button>
          <el-button v-if="user.phone" style="margin-left: 30px" type="text" @click="unBindPhone">解绑</el-button>
        </div>
        <div v-if="this.editPhone"
             class="update-phone" style="display: flex;align-items: center;margin-left: 30%;margin-bottom: 10px">
          <el-input v-model="this.newPhone" placeholder="请输入您的手机号"
                    style="width: 240px;"></el-input>
          <el-button style="margin-left: 40px" type="text" @click="sendPhoneCode">获取验证码</el-button>
        </div>
        <div v-if="this.confirmPhone"
             class="update-phone" style="display: flex;align-items: center;margin-left: 30%;margin-bottom: 10px">
          <el-input v-model="this.phoneCode" placeholder="请输入验证码"
                    style="width: 240px;"></el-input>
          <el-button style="margin-left: 40px" type="text" @click="updatePhone">确定</el-button>
        </div>
        <div style="display: flex;align-items: center;margin-left: 30%;margin-bottom: 10px">
          <span style="font-size: 16px">QQ号：&emsp;&emsp;{{ user.qq ? user.qq : '未绑定' }}</span>
          <el-button v-if="!user.qq" style="margin-left: 30px" type="text"
                     @click="this.editQQ?this.editQQ=false:this.editQQ=true">绑定
          </el-button>
          <el-button v-if="user.qq" style="margin-left: 30px" type="text" @click="unBindQQ">解绑</el-button>
        </div>
        <div v-if="this.editQQ"
             class="update-qq" style="display: flex;align-items: center;margin-left: 30%;margin-bottom: 10px">
          <el-input v-model="this.newQQ" placeholder="请输入您的QQ号"
                    style="width: 240px;"></el-input>
          <el-button style="margin-left: 40px" type="text" @click="sendQQCode">确定</el-button>
        </div>
        <div style="display: flex;align-items: center;margin-left: 30%;margin-bottom: 10px">
          <span style="font-size: 16px">微信号：&emsp;&emsp;{{ user.wechat ? user.wechat : '未绑定' }}</span>
          <el-button v-if="!user.wechat" style="margin-left: 30px" type="text"
                     @click="this.editWechat?this.editWechat=false:this.editWechat=true">绑定
          </el-button>
          <el-button v-if="user.wechat" style="margin-left: 30px" type="text" @click="unBindWechat">解绑</el-button>
        </div>
        <div v-if="this.editWechat"
             class="update-wechat" style="display: flex;align-items: center;margin-left: 30%;margin-bottom: 10px">
          <el-input v-model="this.newWechat" placeholder="请输入您的微信号"
                    style="width: 240px;"></el-input>
          <el-button style="margin-left: 40px" type="text" @click="sendWechatCode">确定</el-button>
        </div>
        <div style="display: flex;align-items: center;margin-left: 30%;margin-bottom: 10px">
          <el-button type="primary" @click="this.changePwd?this.changePwd=false:this.changePwd=true">
            修改密码
          </el-button>
        </div>
        <div v-if="this.changePwd"
             class="update-pwd" style="display: flex;align-items: center;margin-left: 30%;margin-bottom: 10px">
          <el-input v-model="this.OriginPwd" placeholder="请输入原密码"
                    style="width: 240px;"></el-input>
          <el-input v-model="this.newPwd" placeholder="请输入新密码"
                    style="width: 240px;margin-left: 40px"></el-input>
          <el-button style="margin-left: 40px" type="text" @click="updatePwd">确定</el-button>
        </div>
        <div style="display: flex;align-items: center;margin-left: 30%;margin-bottom: 10px;margin-top: 15px">
          <span style="font-size: 16px">注册时间：&emsp;&emsp;{{ user.create_time }}</span>
        </div>
        <ItemList :value='this.listType' @getChildData='getChildData'></ItemList>
      </el-card>
    </div>
  </div>
</template>

<script>

import request, {fileRequest} from "@/api";
import ItemList from "@/components/personal/center/info/ItemList.vue";
import router from "@/router";

export default {
  name: "Info",
  components: {
    ItemList,
  },
  created() {
    this.getAvatar();
  },
  data() {
    return {
      listType: 'fan',
      user: this.$store.state.user,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      fileList: [],
      imageUrl: '',
      editName: false,
      editIntro: false,
      editEmail: false,
      editPhone: false,
      editQQ: false,
      editWechat: false,
      changePwd: false,
      confirmEmail: false,
      confirmPhone: false,
      emailCode: '',
      phoneCode: '',
      newName: '',
      newIntro: '',
      newEmail: '',
      newPhone: '',
      newQQ: '',
      newWechat: '',
      OriginPwd: '',
      newPwd: '',
    };
  },
  methods: {
    getChildData(v) {
      this.value = v
    },
    updatePwd() {
      if (this.OriginPwd === '') {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '原密码不能为空',
        });
        return;
      }
      if (this.newPwd === '') {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '新密码不能为空',
        });
        return;
      }
      if (this.newPwd.length > 16 || this.newPwd.length < 6) {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '密码长度在 6 到 16 个字符',
        });
        return;
      }
      let data = {
        id: this.$store.state.user.id,
        username: this.$store.state.user.username,
        password: this.OriginPwd,
        newPassword: this.newPwd,
      };
      request.post('/user', JSON.stringify({
        apiType: this.$aes.encrypt('changePassword'),
        data: this.$aes.encrypt(JSON.stringify(data)),
      })).then(res => {
        if (res.data.code === '200') {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            type: 'success',
            message: this.$aes.decrypt(res.data.message),
          });
          router.go(0);
        } else {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            type: 'error',
            message: this.$aes.decrypt(res.data.message),
          });
        }
      }).catch(err => {
        console.log(err);
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'error',
          message: '请求异常，请刷新重试',
        });
      });
    },
    changeUserInfo(data) {
      request.post('/user', JSON.stringify({
        apiType: this.$aes.encrypt('changeUserInfo'),
        data: this.$aes.encrypt(data),
      })).then(res => {
        if (res.data.code === '200') {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            type: 'success',
            message: this.$aes.decrypt(res.data.message),
          });
          router.go(0);
        } else {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            type: 'error',
            message: this.$aes.decrypt(res.data.message),
          });
        }
      }).catch(err => {
        console.log(err);
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'error',
          message: '请求异常，请刷新重试',
        });
      });
    },
    updateUsername() {
      if (this.newName === '') {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '用户名不能为空',
        });
        return;
      }
      if (this.newName.length > 16 || this.newName.length < 2) {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '用户名长度在 2 到 16 个字符',
        });
        return;
      }
      let data = {
        id: this.$store.state.user.id,
        username: this.newName,
      };
      this.changeUserInfo(JSON.stringify(data));
    },
    updateIntro() {
      if (this.newIntro === '') {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '个人简介不能为空',
        });
        return;
      }
      if (this.newIntro.length > 64 || this.newIntro.length < 2) {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '个人简介长度在 2 到 64 个字符',
        });
        return;
      }
      let data = {
        id: this.$store.state.user.id,
        intro: this.newIntro,
      };
      this.changeUserInfo(JSON.stringify(data));
    },
    sendEmailCode() {
      if (!this.user.email) {
        if (this.newEmail === '') {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            type: 'warning',
            message: '邮箱不能为空',
          });
          return;
        }
        if (!this.$utils.checkEmail(this.newEmail)) {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            type: 'warning',
            message: '邮箱格式不正确',
          });
          return;
        }
      }

      let confirm = {
        tos: [this.newEmail ? this.newEmail : this.user.email],
      };

      request.post('/confirm', JSON.stringify({
        apiType: this.$aes.encrypt('confirmEmail'),
        data: this.$aes.encrypt(JSON.stringify(confirm)),
      })).then(res => {
        if (res.data.code === '200') {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            type: 'success',
            message: this.$aes.decrypt(res.data.message),
          });
          this.confirmEmail = true;
        } else {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            type: 'error',
            message: this.$aes.decrypt(res.data.message),
          });
        }
      }).catch(err => {
        console.log(err);
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'error',
          message: '请求异常，请刷新重试',
        });
      });
    },
    updateEmail() {
      if (this.emailCode === '') {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '验证码不能为空',
        });
        return;
      }

      let data;
      if (this.user.email) {
        data = {
          id: this.user.id,
          email: '',
          verCode: this.emailCode,
          verType: 'email',
        };
      } else {
        data = {
          id: this.user.id,
          email: this.newEmail,
          verCode: this.emailCode,
          verType: 'email',
        };
      }

      this.changeUserInfo(JSON.stringify(data));
    },
    sendPhoneCode() {
      if (this.newPhone === '') {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '手机号不能为空',
        });
        return;
      }
      if (!this.$utils.checkPhone(this.newPhone)) {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '手机号格式不正确',
        });
        return;
      }
      let data = {
        id: this.$store.state.user.id,
        phone: this.newPhone,
      };
      this.changeUserInfo(JSON.stringify(data));
    },
    sendQQCode() {
      if (this.newQQ === '') {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: 'QQ号不能为空',
        });
        return;
      }
      if (!this.$utils.checkQQ(this.newQQ)) {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: 'QQ号格式不正确',
        });
        return;
      }
      let data = {
        id: this.$store.state.user.id,
        qq: this.newQQ,
      };
      this.changeUserInfo(JSON.stringify(data));
    },
    sendWechatCode() {
      if (this.newWechat === '') {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '微信号不能为空',
        });
        return;
      }
      if (!this.$utils.checkWechat(this.newWechat)) {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '微信号格式不正确',
        });
        return;
      }
      let data = {
        id: this.$store.state.user.id,
        wechat: this.newWechat,
      };
      this.changeUserInfo(JSON.stringify(data));
    },
    unBindPhone() {
      //确认解绑
      this.$confirm('确认解绑手机号？', '提示', {
        customClass: 'confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let data = {
          id: this.$store.state.user.id,
          phone: '',
        };
        this.changeUserInfo(JSON.stringify(data));
      }).catch(() => {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'info',
          message: '已取消解绑',
        });
      });
    },
    unBindQQ() {
      //确认解绑
      this.$confirm('确认解绑QQ号？', '提示', {
        customClass: 'confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let data = {
          id: this.$store.state.user.id,
          qq: '',
        };
        this.changeUserInfo(JSON.stringify(data));
      }).catch(() => {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'info',
          message: '已取消解绑',
        });
      });
    },
    unBindWechat() {
      //确认解绑
      this.$confirm('确认解绑微信号？', '提示', {
        customClass: 'confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let data = {
          id: this.$store.state.user.id,
          wechat: '',
        };
        this.changeUserInfo(JSON.stringify(data));
      }).catch(() => {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'info',
          message: '已取消解绑',
        });
      });
    },
    getAvatar() {
      fileRequest.post('/download', JSON.stringify({
        apiType: this.$aes.encrypt('downloadUserAvatar'),
        data: this.$aes.encrypt(this.$store.state.user.avatar),
      }), {
        responseType: 'arraybuffer', // 指定响应类型为字节数组
      }).then(response => {
        // 将字节数组转换为Blob对象
        const blob = new Blob([response.data], {type: response.headers['content-type']});
        // 将Blob对象转换为DataURL
        // 在界面中显示图像
        this.imageUrl = URL.createObjectURL(blob);
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
    handleChange(file, fileList) {
      //判断文件大小不超过 2MB
      if (file.size > 2 * 1024 * 1024) {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '文件大小不能超过 2MB!'
        });
        fileList.pop();
      }
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },
    uploadAvatar() {
      const formData = new FormData();
      formData.append('file', this.fileList[0].raw);
      formData.append('apiType', this.$aes.encrypt('uploadUserAvatar'));
      formData.append('id', this.$aes.encrypt(this.$store.state.user.id));
      fileRequest.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === '200') {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            type: 'success',
            message: this.$aes.decrypt(res.data.message)
          });
          router.go(0);
        } else {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            type: 'error',
            message: this.$aes.decrypt(res.data.message)
          });
        }
      }).catch(err => {
        console.log(err);
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'error',
          message: '请求异常，请刷新重试'
        });
      });
    },
  },
};

</script>

<style lang="scss" scoped>

.el-progress {
  border: 1px solid #409eff;
  border-radius: 10px;
}

.update-username {
  :deep(.el-input__inner) {
    width: 180px;
  }
}

.update-intro {
  :deep(.el-input__inner) {
    width: 540px;
  }
}

.update-email {
  :deep(.el-input__inner) {
    width: 240px;
  }
}

.update-phone {
  :deep(.el-input__inner) {
    width: 240px;
  }
}

.update-qq {
  :deep(.el-input__inner) {
    width: 240px !important;
  }
}

.update-wechat {
  :deep(.el-input__inner) {
    width: 240px;
  }
}

:deep(input) {
  border: none;
}

.el-button {
  padding-top: 8px;
}

.el-avatar {
  background: #409eff;
}

.el-avatar:hover {
  cursor: pointer;
  transform: scale(1.1);
  transition: all 0.5s;
}

</style>

<style lang="scss">
.confirm {
  .el-button:nth-child(1) {
    padding-top: 8px;
  }

  .el-button:nth-child(2) {
    padding-top: 8px;
  }
}
</style>