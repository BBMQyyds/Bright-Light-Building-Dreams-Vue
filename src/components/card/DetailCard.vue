<template>
  <el-dialog v-model="editVisible" :close-on-click-modal="false" :show-close=false
             class="width" destroy-on-close>
    <template #header="{title}">
      <div style="font-size: 24px; font-weight: bolder;text-align: center; color: black;margin-top: 5px">
        任务分配详情
      </div>
    </template>

    <span slot="footer" class="dialog-footer">
      <el-button style="margin-right: 100px" @click="cancelEdit">取消</el-button>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>

import request from "@/api";

export default {
  name: "DetailCard",
  data() {
    return {
      editVisible: false,

    };
  },
  methods: {
    detail(task) {
      this.editVisible = true;
      request.post('/administrator/taskChild/search', {
        id: task.id
      }).then(res => {
        console.log(res);
      });
    },
    cancelEdit() {
      this.$msg({
        type: 'info',
        message: '取消分配',
      });
      this.editVisible = false;
    },
    saveEdit() {

    },
  },
};
</script>

<style scoped>

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
  width: 1400px !important;
  border-radius: 15px !important;
  text-align: center;
}
</style>
