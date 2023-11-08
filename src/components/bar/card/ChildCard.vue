<template>
  <el-dialog v-model="editVisible" :close-on-click-modal="false" :show-close=false
             class="width" destroy-on-close>
    <template #header="{title}">
      <div style="font-size: 24px; font-weight: bolder;text-align: center; color: black;margin-top: 5px">
        {{ this.type === 'add' ? '添加儿童账户' : '编辑儿童账户' }}
      </div>
    </template>
    <el-card class="box-card edit-card">
      <el-form ref="editForm"
               :model="editedData"
               :rules="editRules"
               label-width="100px">
        <el-form-item v-if="type === 'edit'" label="ID" prop="id">
          <el-input v-model="editedData.id" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editedData.username"></el-input>
        </el-form-item>
        <el-form-item label="分数" prop="score">
          <el-input v-model="editedData.score"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editedData.name"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input v-model="editedData.grade"></el-input>
        </el-form-item>
        <el-form-item label="地点" prop="locate">
          <el-input v-model="editedData.locate"></el-input>
        </el-form-item>
        <el-form-item label="持有任务数" prop="duty">
          <el-input v-model="editedData.duty"></el-input>
        </el-form-item>
        <el-form-item label="完成任务数" prop="completedTasks">
          <el-input v-model="editedData.completed_tasks"></el-input>
        </el-form-item>
        <el-form-item label="志愿者ID" prop="volunteerId">
          <el-input v-model="editedData.volunteer_id"></el-input>
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
export default {
  name: "ChildCard",
  data() {
    return {
      editVisible: false,
      type: "",
      editedData: {
        id: "",
        username: "",
        score: "",
        name: "",
        grade: "",
        locate: "",
        duty: "",
        completed_tasks: "",
        volunteer_id: "",
      },
      editRules: {
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        // Add validation rules for other fields as needed
      },
    };
  },
  methods: {
    addChild() {
      this.type = "add";
      this.editedData = {
        id: "",
        username: "",
        score: "",
        name: "",
        grade: "",
        locate: "",
        duty: "",
        completed_tasks: "",
        volunteer_id: "",
      };
      this.editVisible = true;
    },
    editChild(data) {
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
      this.$msg({
        type: 'success',
        message: '保存成功',
      });
      this.editVisible = false;
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
