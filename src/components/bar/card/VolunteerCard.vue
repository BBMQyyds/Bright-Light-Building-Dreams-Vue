<template>
  <el-dialog v-model="editVisible" :close-on-click-modal="false" :show-close="false" class="width" destroy-on-close>
    <template #header="{title}">
      <div style="font-size: 24px; font-weight: bolder; text-align: center; color: black; margin-top: 5px">
        {{ this.type === 'add' ? '添加志愿者账户' : '编辑志愿者账户' }}
      </div>
    </template>
    <el-card class="box-card edit-card">
      <el-form ref="editForm" :model="editedData" :rules="editRules" label-width="100px">
        <el-form-item v-if="type === 'edit'" label="ID" prop="volId">
          <el-input v-model="editedData.volId" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="volUsername">
          <el-input v-model="editedData.volUsername"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="volName">
          <el-input v-model="editedData.volName"></el-input>
        </el-form-item>
        <el-form-item label="地点" prop="volLocate">
          <el-input v-model="editedData.volLocate"></el-input>
        </el-form-item>
        <el-form-item label="组织" prop="volOrganization">
          <el-input v-model="editedData.volOrganization"></el-input>
        </el-form-item>
        <el-form-item label="持有任务数" prop="volDuty">
          <el-input v-model="editedData.volDuty"></el-input>
        </el-form-item>
        <el-form-item label="完成任务数" prop="volCorrectedTasks">
          <el-input v-model="editedData.completed_tasks"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="volTel">
          <el-input v-model="editedData.volTel"></el-input>
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
  name: "VolunteerCard",
  data() {
    return {
      editVisible: false,
      type: "",
      editedData: {
        volId: "",
        volUsername: "",
        volName: "",
        volLocate: "",
        volOrganization: "",
        volDuty: "",
        volCorrectedTasks: "",
        volTel: "",
      },
      editRules: {
        volUsername: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        // Add validation rules for other fields as needed
        volName: [
          {required: true, message: '姓名不能为空', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        volLocate: [
          {required: true, message: '地点不能为空', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        volOrganization: [
          {required: true, message: '组织不能为空', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        volDuty: [
          {required: true, message: '持有任务数不能为空', trigger: 'blur'},
          {type: 'number', message: '持有任务数必须为数字值', trigger: 'blur'},
          {min: 0, max: 100, message: '持有任务数必须在 0 到 100 之间', trigger: 'blur'}
        ],
        volCorrectedTasks: [
          {required: true, message: '完成任务数不能为空', trigger: 'blur'},
          {type: 'number', message: '完成任务数必须为数字值', trigger: 'blur'},
          {min: 0, max: 100, message: '完成任务数必须在 0 到 100 之间', trigger: 'blur'}
        ],
        volTel: [
          {required: true, message: '电话不能为空', trigger: 'blur'},
          {type: 'number', message: '电话必须为数字值', trigger: 'blur'},
          {min: 10000000000, max: 19999999999, message: '电话必须为 11 位数字', trigger: 'blur'}
        ],
      },
    };
  },
  methods: {
    addVolunteer() {
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
    editVolunteer(data) {
      this.type = "edit";
      this.editedData = {...data};
      this.editVisible = true;
    },
    cancelEdit() {
      this.$message({
        type: 'info',
        message: '取消' + (this.type === 'add' ? '添加' : '编辑'),
      });
      this.editVisible = false;
    },
    saveEdit() {
      request.post('/administrator/user/volunteer/save', JSON.stringify({
        volCorrectedTasks: this.editedData.volCorrectedTasks,
        volDuty: this.editedData.volDuty,
        volId: this.editedData.volId,
        volLocate: this.editedData.volLocate,
        volName: this.editedData.volName,
        volOrganization: this.editedData.volOrganization,
        volPassword: this.editedData.volPassword,
        volTel: this.editedData.volTel,
        volUsername: this.editedData.volUsername,
      })).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功',
          });
          this.editVisible = false;
        } else {
          this.$message({
            type: 'error',
            message: '保存失败',
          });
        }
      }).catch(err => {
        console.log(err);
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
  text-align: center;
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
}
</style>
