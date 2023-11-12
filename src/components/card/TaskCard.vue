<template>
  <el-dialog v-model="editVisible" :close-on-click-modal="false" :show-close=false
             class="width" destroy-on-close>
    <template #header="{title}">
      <div style="font-size: 24px; font-weight: bolder;text-align: center; color: black;margin-top: 5px">
        {{ this.type === 'add' ? '添加学习任务' : '编辑学习任务' }}
      </div>
    </template>
    <el-card class="box-card edit-card">
      <el-form ref="editForm" :model="editedData" :rules="editRules" label-width="100px">
        <el-form-item v-if="type === 'edit'" label="ID" prop="id">
          <el-input v-model="editedData.id" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editedData.name"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="editedData.content"></el-input>
        </el-form-item>
        <el-form-item label="分数" prop="score">
          <el-input v-model="editedData.score"></el-input>
        </el-form-item>
        <el-form-item label="科目" prop="subject">
          <el-input v-model="editedData.subject"></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="grade">
          <el-input v-model="editedData.grade"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="editedData.status"></el-input>
        </el-form-item>
        <el-form-item label="是否必做" prop="mustDo">
          <el-input v-model="editedData.mustDo"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button style="margin-right: 40px" @click="cancelEdit">取消</el-button>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from "@/api";

export default {
  name: "TaskCard",
  data() {
    return {
      editVisible: false,
      type: "",
      editedData: {
        id: "",
        name: "",
        content: "",
        score: "",
        startTime: "",
        finishTime: "",
        subject: "",
        grade: "",
        status: "",
        mustDo: "",
      },
      editRules: {
        score: [
          {required: true, message: '分数不能为空', trigger: 'blur'},
        ],
        startTime: [
          {required: true, message: '开始时间不能为空', trigger: 'blur'},
        ],
        finishTime: [
          {required: true, message: '结束时间不能为空', trigger: 'blur'},
        ],
        subject: [
          {required: true, message: '科目不能为空', trigger: 'blur'},
        ],
        grade: [
          {required: true, message: '等级不能为空', trigger: 'blur'},
        ],
        status: [
          {required: true, message: '状态不能为空', trigger: 'blur'},
        ],
        mustDo: [
          {required: true, message: '是否必做不能为空', trigger: 'blur'},
        ],
        content: [
          {required: true, message: '内容不能为空', trigger: 'blur'},
        ],
        name: [
          {required: true, message: '名称不能为空', trigger: 'blur'},
        ],
      },
    };
  },
  methods: {
    addTask() {
      this.type = "add";
      this.editedData = {
        id: this.$uuid.v1(),
        name: "",
        content: "",
        score: "",
        startTime: "",
        finishTime: "",
        subject: "",
        grade: "",
        status: "",
        mustDo: "",
      };
      this.editVisible = true;
    },
    editTask(data) {
      this.type = "edit";
      this.editedData = {...data};
      this.editVisible = true;
    },
    cancelEdit() {
      this.$msg({
        type: 'info',
        message: '取消' + (this.type === 'add' ? '添加' : '编辑'),
      });
      this.editVisible = false;
    },
    saveEdit() {
      request.post('/administrator/task/create', JSON.stringify(this.editedData))
          .then(res => {
            if (res.data.code === 0 || res.data.code === -1) {
              this.$msg({
                type: 'success',
                message: this.type === 'add' ? '添加成功' : '编辑成功',
              });
              setTimeout(() => {
                location.reload();
              }, 500);
              this.editVisible = false;
              this.$emit('refresh');
            } else {
              this.$msg({
                type: 'error',
                message: this.type === 'add' ? '添加失败' : '编辑失败',
              });
            }
          })
          .catch(err => {
            console.log(err);
            this.$msg({
              type: 'error',
              message: this.type === 'add' ? '添加失败' : '编辑失败',
            });
          });
    },
  },
};
</script>

<style scoped>

.edit-card {
  margin-top: 0;
  background: transparent;
  width: 450px;
  height: auto;
  text-align: center;
  z-index: 100;
  box-shadow: none !important;
  border: none !important;
}

.dialog-footer {
  padding: 20px 0;
  text-align: center !important;
}

.el-button {
  padding-top: 8px;
}

:deep(input) {
  width: 250px;
  height: 40px;
  border: none;
}
</style>

<style>
.width {
  z-index: 20000;
  margin-top: 100px !important;
  width: 500px !important;
  border-radius: 15px !important;
  text-align: center;
}
</style>
