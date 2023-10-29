<template>
  <div class="content">
    <div class="identity">
      <div id="avatar">
        <el-avatar :size="80"></el-avatar>
        <el-button id="edit" @click="showDialog">编辑</el-button>
      </div>
    </div>
    <el-dialog
      class="upload_image"
      :visible.sync="visible"
      title="上传头像"
      @close="visible = false"
      :modal="false"
    >
      <el-upload
        ref="file"
        :show-file-list="false"
        :action="address"
        :before-upload="beforeUpload"
        :on-success="onSuccess"
        :on-error="onError"
        :accept="'image/png,image/jpeg'"
      >
        <i class="el-icon-plus avatar-uploader-icon"></i>
        <div class="el-text-center">点击或拖动图片上传</div>
      </el-upload>
      <el-button @click="commitFile">确认头像</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import request from "../../util/request";
  export default {
    name: "Personal",
    data() {
      return {
        file: null, // 使用 null 来初始化
        address: "fzzf",
        visible: false,
        user: {},
      };
    },
    created() {
      this.judgeIdentity();
    },
    methods: {
      showDialog() {
        this.visible = true;
      },
      beforeUpload(file) {
        const fileType = file.type;
        const isJpgOrPng = fileType === "image/jpeg" || fileType === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isJpgOrPng) {
          this.$message.error("上传图片只能是 JPG/PNG 格式!");
          return false;
        }
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 5MB!");
          return false;
        }
        this.file = file;
        return true;
      },
      onSuccess(response, file, fileList) {
        // 处理上传成功后的逻辑，response 包含了上传成功后的数据
        console.log("上传成功：", response);
      },
      onError(error, file, fileList) {
        // 处理上传失败后的逻辑，error 包含了上传失败的错误信息
        console.error("上传失败：", error);
      },
      commitFile() {
        if (this.file) {
          // 执行确认上传头像的逻辑
          console.log("确认上传头像：", this.file);
          // 创建 FormData 对象
          const formData = new FormData();
          // 将文件添加到 FormData
          formData.append('file', this.file);
          formData.append('user_id', this.user.userId);
          // 发起上传文件的请求
          request.post("/File/uploadAvatar",formData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data; charset=UTF-8'
            }
          })
            .then((res) => {
              // 处理上传成功的逻辑
              this.$message.success('文件上传成功');
            })
            .catch((err) => {
              // 处理上传失败的逻辑
              console.log(err);
              this.$message.error('文件上传失败');
            })
            .finally(() => {
              // 关闭上传对话框
              this.uploadDialogVisible = false;
            });
        }else {}
          this.$message.error("请先选择图片上传。");
        },
      judgeIdentity() {
        if (localStorage.getItem("user") !== null) {
          this.user = JSON.parse(localStorage.getItem("user"));
          console.log(this.user);
        } else {
          this.$router.push("/BlogForum-Login");
        }
      },
      },

    }
</script>


<style scoped>
  .content{
    position: absolute;
    width: 54%;
    height: 100%;
    margin-left: 15%;
  }
  .upload_image{
    width: 80%;
  }
</style>
