<template>
  <div class="main">
    <TaskCard ref="taskCard"></TaskCard>
    <PublishCard ref="publishCard"></PublishCard>
    <el-row class="row">
      <el-col :span="4">
        <el-input v-model="searchKeyword" class="search" placeholder="搜索任务" @input="search"></el-input>
      </el-col>
      <el-col :span="2" class="text-right" style="display: flex;align-items: center">
        <el-button type="primary" @click="addTask" style="margin-right: 20px">添加任务</el-button>
        <el-button type="primary" @click="save">保存分配</el-button>
      </el-col>
    </el-row>
    <el-table
        ref="table"
        :cell-style="{'text-align': 'center'}"
        :data="taskList"
        :header-cell-style="{backgroundColor:'#393E46','text-align':'center'
        , 'font-size': '15px','color': 'white', 'font-weight': 'normal'}"
        class="table"
        style="margin-top: 20px;">
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="分数" prop="score"></el-table-column>
      <el-table-column label="内容" prop="content"></el-table-column>
      <el-table-column label="开始时间" prop="startTime">
        <template v-slot="scope">
          <el-button type="primary" @click="publishTask(scope.row)"
                     v-if="scope.row.startTime === null || scope.row.startTime === ''">发布任务
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" prop="finishTime">
        <template v-slot="scope">
          <el-button type="primary" @click="publishTask(scope.row)"
                     v-if="scope.row.finishTime === null || scope.row.finishTime === ''">发布任务
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="视频" prop="video">
        <template v-slot="scope">
          <el-button type="primary" @click="toVideo(scope.row.video)"
                     v-if="scope.row.video !== null && scope.row.video !== ''">查看视频
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="照片" prop="taskPhoto">
        <template v-slot="scope">
          <el-button type="primary" @click="toPhoto(scope.row.taskPhoto)"
                     v-if="scope.row.taskPhoto !== null && scope.row.taskPhoto !== ''">查看照片
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="科目" prop="subject"></el-table-column>
      <el-table-column label="年级" prop="grade"></el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
      <!-- 根据你的实体类添加其他字段 -->
      <el-table-column label="操作" width="275">
        <template v-slot="scope">
          <div style="display:inline-block; margin-left: 15px;align-items: center">
            <el-button size="default" type="warning" @click="editTask(scope.row)">编辑</el-button>
            <el-button size="default" style="margin-right: 15px" type="danger"
                       @click="deleteTask(scope.row)">删除
            </el-button>
            <hr>
            <div style="text-align: left;">
              <el-select v-model="scope.row.child_id" placeholder="分配任务给儿童" size="small">
                <el-option
                    v-for="item in childList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </div>
            <hr>
            <div style="text-align: left;">
              <el-select v-model="scope.row.volunteer_id" placeholder="分配任务给志愿者" size="small">
                <el-option
                    v-for="item in volunteerList"
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
        style="margin-bottom: 40px"
        :hide-on-single-page="false"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 40]"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handleCurrentPageChange">
    </el-pagination>
  </div>
</template>

<script>

import request from "@/api";
import TaskCard from "@/components/card/TaskCard.vue";
import PublishCard from "@/components/card/PublishCard.vue";

export default {
  components: {
    TaskCard,
    PublishCard,
  },
  created() {
    this.search();
    this.searchChild();
    this.searchVolunteer();
  },
  data() {
    return {
      searchKeyword: '',
      currentPage: 1,
      pageSize: 5, // 默认每页显示10行
      total: 0,
      childList: [],
      volunteerList: [],
      taskList: [],
    };
  },
  methods: {
    search() {
      request.post('/administrator/task/search?pageNo=' + this.currentPage + '&pageSize=' + this.pageSize, JSON.stringify({
        name: this.searchKeyword,
      })).then(res => {
        if (res.data.code === 0) {
          this.taskList = res.data.result.items;
          this.total = res.data.result.counts;
          for (let i = 0; i < this.taskList.length; i++) {
            this.taskList[i].child_id = '';
            this.taskList[i].volunteer_id = '';
          }
        } else {
          this.$msg({
            message: '获取任务列表失败',
            type: 'error',
            duration: 500
          });
        }
      }).catch(err => {
        console.log(err);
      });
    },
    searchChild() {
      request.post('/administrator/user/search', JSON.stringify({
        name: '',
        page: this.currentPage,
        size: 100
      })).then(res => {
        if (res.data.code === 0) {
          this.childList = res.data.result.objects;
        } else {
          this.$msg({
            message: '获取儿童列表失败',
            type: 'error',
            duration: 500
          });
        }
      }).catch(err => {
        console.log(err);
      });
    },
    searchVolunteer() {
      request.post('/administrator/user/volunteer/search', JSON.stringify({
        page: this.currentPage,
        size: 100
      })).then(res => {
        if (res.data.code === 0) {
          this.volunteerList = res.data.result.objects;
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
    },
    toVideo(url) {
      window.open(url);
    },
    toPhoto(url) {
      window.open(url);
    },
    handleCurrentPageChange(page) {
      this.currentPage = page;
      this.search();
    },
    addTask() {
      // 打开添加任务的对话框
      this.$refs.taskCard.addTask();
    },
    editTask(task) {
      // 打开编辑任务的对话框，并传递任务信息
      this.$refs.taskCard.editTask(task);
      // 更新对话框中的表单数据，根据传递的任务信息
    },
    publishTask(task) {
      // 打开发布任务的对话框，并传递任务信息
      this.$refs.publishCard.publishTask(task);
      // 更新对话框中的表单数据，根据传递的任务信息
    },
    save() {
      this.$confirm('此操作将保存分配的任务, 是否继续?', '提示', {
        customClass: 'confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.post('/administrator/task/save', JSON.stringify(this.taskList)).then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '保存成功',
              type: 'success',
              duration: 500
            });
            location.reload();

          } else {
            this.$msg({
              message: '保存失败',
              type: 'error',
              duration: 500
            });
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch(() => {
        this.$msg({
          message: '已取消保存',
          type: 'info',
          duration: 500
        });
      });
    },
    deleteTask(task) {
      // 弹出确认框
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        customClass: 'confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.post('/administrator/task/delete', JSON.stringify({
          id: task.id,
        })).then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '删除成功',
              type: 'success',
              duration: 500
            });
            this.search();
          } else {
            this.$msg({
              message: '删除失败',
              type: 'error',
              duration: 500
            });
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch(() => {
        this.$msg({
          message: '已取消删除',
          type: 'info',
          duration: 500
        });
      });
    },
  }
};
</script>

<style scoped>

:deep(input) {
  width: 200px;
  height: 40px;
  border: none;
}

.main {
  width: 1600px;
  margin: 40px auto auto;
}

.row {
  margin-top: 20px;
  align-items: center;
}

::v-deep .el-table__row {
  background-color: lightgray;
}

.table ::v-deep .el-table__body tr:hover > td {
  background-color: #E6E6E6;
}

.el-button {
  padding-top: 8px;
}

.table {
  border-radius: 5px;
}

</style>

<style lang="scss">

.selectChild {
  width: 1px !important;
}

.confirm {
  .el-button:nth-child(1) {
    padding-top: 8px;
  }

  .el-button:nth-child(2) {
    padding-top: 8px;
  }
}

#button {
  margin-left: 90%;
}
</style>
