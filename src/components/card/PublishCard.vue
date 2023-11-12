<template>
  <el-dialog v-model="editVisible" :close-on-click-modal="false" :show-close="false" class="width" destroy-on-close>
    <template #header="{ title }">
      <div style="font-size: 24px; font-weight: bolder;text-align: center; color: black;margin-top: 5px">
        {{ type === 'add' ? '添加学习任务' : '发布学习任务' }}
      </div>
    </template>
    <el-card class="box-card edit-card">
      <el-form ref="editForm" :model="editedData" :rules="editRules" label-width="100px">
        <el-form-item v-if="type === 'edit'" label="ID" prop="id">
          <el-input v-model="editedData.id" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime" style="margin-left: 42px;margin-bottom: 20px!important;">
          <el-date-picker v-model="editedData.startTime" placeholder="选择开始时间"
                          style="margin-bottom: 10px!important;" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="finishTime" style="margin-left: 42px;margin-bottom: 20px!important">
          <el-date-picker v-model="editedData.finishTime" placeholder="选择结束时间"
                          style="margin-bottom: 10px!important;" type="datetime"></el-date-picker>
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
  name: "PublishCard",
  data() {
    return {
      editVisible: false,
      type: "",
      editedData: {
        id: "",
        startTime: "",
        finishTime: "",
      },
      editRules: {
        startTime: [{required: true, message: '开始时间不能为空', trigger: 'blur'}],
        finishTime: [{required: true, message: '结束时间不能为空', trigger: 'blur'}],
      },
    };
  },
  methods: {
    publishTask(data) {
      this.type = 'edit';
      this.editedData = {...data};
      this.editVisible = true;
    },
    cancelEdit() {
      this.editVisible = false;
    },
    saveEdit() {
      if (this.editedData.startTime >= this.editedData.finishTime) {
        this.$msg({
          type: 'error',
          message: '结束时间必须大于开始时间',
        });
        return;
      }
      request.post('/administrator/task/create', JSON.stringify({
        id: this.editedData.id,
        startTime: this.formatDate(this.editedData.startTime),
        finishTime: this.formatDate(this.editedData.finishTime),
      })).then((res) => {
        if (res.data.code === 0) {
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
      }).catch((err) => {
        console.log(err);
        this.$msg({
          type: 'error',
          message: this.type === 'add' ? '添加失败' : '编辑失败',
        });
      });
    },
    formatDate(inputDate) {
      const date = new Date(inputDate);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
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
  margin-top: 200px !important;
  width: 500px !important;
  border-radius: 15px !important;
  text-align: center;
}
</style>
