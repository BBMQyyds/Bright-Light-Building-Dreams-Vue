<template>
  <el-dialog v-model="editVisible" :close-on-click-modal="false" :show-close=false
             class="width2" destroy-on-close>
    <template #header="{title}">
      <div style="font-size: 24px; font-weight: bolder;text-align: center; color: black;margin-top: 5px">
        儿童任务分配详情
      </div>
    </template>

    <el-table
        ref="table"
        :cell-style="{'text-align': 'center'}"
        :data="taskList"
        :header-cell-style="{backgroundColor:'#393E46','text-align':'center'
        , 'font-size': '15px','color': 'white', 'font-weight': 'normal'}"
        class="table"
        style="margin-top: 20px;">
      <el-table-column label="任务" prop="taskName"></el-table-column>
      <el-table-column label="儿童" prop="childName"></el-table-column>
      <el-table-column label="分数" prop="score"></el-table-column>
      <el-table-column label="内容" prop="content"></el-table-column>
      <el-table-column label="开始时间" prop="taskStartTime"></el-table-column>
      <el-table-column label="结束时间" prop="taskEndTime"></el-table-column>
      <!-- 根据你的实体类添加其他字段 -->
      <el-table-column label="操作" width="275">
        <template v-slot="scope">
          <div style="display:inline-block;align-items: center">
            <div style="text-align: left;margin-left: 5px">
              <el-select v-model="scope.row.volunteerId" placeholder="请选择志愿者">
                <el-option
                    v-for="item in scope.row.volunteerList"
                    :key="item.volId"
                    :label="item.volName"
                    :value="item.volId">
                </el-option>
              </el-select>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <p></p>
    <el-pagination
        :current-page="currentPage"
        :hide-on-single-page="false"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 40]"
        :total="total"
        layout="total, prev, pager, next"
        style="margin-bottom: 40px"
        @current-change="handleCurrentPageChange">
    </el-pagination>

    <span slot="footer" class="dialog-footer">
      <el-button style="margin-right: 100px" type="normal" @click="cancelEdit">取 消</el-button>
      <el-button type="primary" @click="saveEdit">保 存</el-button>
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
      taskList: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      taskId: '',
    };
  },
  methods: {
    detail(task) {
      this.editVisible = true;
      this.taskId = task.id;
      this.search();
    },
    cancelEdit() {
      this.$msg({
        type: 'info',
        message: '取消分配',
      });
      this.editVisible = false;
    },
    saveEdit() {
      let success = true;
      for (let i = 0; i < this.taskList.length; i++) {
        if (this.taskList[i].volunteerId !== null) {
          request.post('/administrator/taskChild/assign', JSON.stringify({
            taskId: this.taskList[i].taskId,
            volunteerId: this.taskList[i].volunteerId,
            childId: this.taskList[i].childId,
          })).then(res => {
            if (res.data.code !== 0) {
              success = false;
            }
          }).catch(err => {
            console.log(err);
          });
        }
      }
      setTimeout(() => {
        if (success) {
          this.$msg({
            type: 'success',
            message: '分配成功',
          });
          this.editVisible = false;
          setTimeout(() => {
            // location.reload();
          }, 500);
        } else {
          this.$msg({
            type: 'error',
            message: '分配失败',
          });
          setTimeout(() => {
            // location.reload();
          }, 500);
        }
      }, 500);
    },
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage;
      this.search();
    },
    search() {
      request.post('/administrator/taskChild/search?pageNo=' + this.currentPage + '&pageSize=' + this.pageSize, JSON.stringify({
        taskId: this.taskId,
      })).then(res => {
        if (res.data.code === 0) {
          this.taskList = res.data.result.items;
          this.total = res.data.result.counts;
          for (let i = 0; i < this.taskList.length; i++) {
            this.taskList[i].volunteerId = [];
            request.post('/administrator/taskChild/searchVol', JSON.stringify({
              taskId: this.taskList[i].taskId,
              childId: this.taskList[i].childId,
            })).then(res => {
              if (res.data.code === 0) {
                this.taskList[i].volunteerList = res.data.result.items;
              } else {
                this.$msg({
                  message: '获取志愿者列表失败',
                  type: 'error',
                  duration: 500
                });
              }
            }).catch(err => {
              console.log(err);
            });
          }
        } else {
          this.$msg({
            type: 'error',
            message: '获取任务分配详情失败',
          });
        }
      }).catch(err => {
        console.log(err);
      });
    }
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

::v-deep .el-table__row {
  background-color: lightgray;
}

.table ::v-deep .el-table__body tr:hover > td {
  background-color: #E6E6E6;
}

.table {
  border-radius: 5px;
}

:deep(input) {
  width: 250px;
  height: 40px;
  border: none;
}

</style>

<style>
.width2 {
  z-index: 20000;
  margin-top: 100px !important;
  width: 1400px !important;
  border-radius: 15px !important;
  text-align: center;
}
</style>
