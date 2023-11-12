<template>
  <div class="main">
    <TaskCard ref="taskCard"></TaskCard>
    <PublishCard ref="publishCard"></PublishCard>
    <DetailCard ref="detailCard"></DetailCard>
    <el-row class="row">
      <el-col :span="4">
        <el-input v-model="searchKeyword" class="search" placeholder="搜索任务" @input="search"></el-input>
      </el-col>
      <el-col :span="2" class="text-right" style="display: flex;align-items: center">
        <el-button style="margin-right: 20px" type="primary" @click="addTask">添加任务</el-button>
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
          <el-button v-if="scope.row.startTime === null || scope.row.startTime === ''" type="primary"
                     @click="publishTask(scope.row)">发布任务
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" prop="finishTime">
        <template v-slot="scope">
          <span v-if="scope.row.finishTime === null || scope.row.finishTime === ''">尚未发布</span>
          <span v-else>{{ scope.row.finishTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="视频" prop="video" width="200">
        <template v-slot="scope">
          <el-button v-if="scope.row.video !== null && scope.row.video !== ''" type="text"
                     @click="toVideo(scope.row.video)">查看视频
          </el-button>
          <div v-else>
            <el-upload :auto-upload="false" :file-list="scope.row.videoList"
                       :on-change="(file, fileList) => {handleVideoChange(file, fileList, scope.row.id)}"
                       accept="video/mp4,video/avi,video/mkv,video/wmv,video/rmvb,video/mov,video/flv"
                       action="#" class="upload" multiple>
              <el-button type="primary">上传视频</el-button>
            </el-upload>
            <el-button v-if="scope.row.videoList.length > 0" type="primary" @click="uploadVideo(scope.row.id)">
              确认上传
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="照片" prop="taskPhoto" width="200">
        <template v-slot="scope">
          <el-button v-if="scope.row.taskPhoto !== null && scope.row.taskPhoto !== ''" type="text"
                     @click="toPhoto(scope.row.taskPhoto)">查看照片
          </el-button>
          <div v-else>
            <el-upload :auto-upload="false" :file-list="scope.row.photoList"
                       :on-change="(file, fileList) => {handlePhotoChange(file, fileList, scope.row.id)}"
                       accept="image/*" action="#" class="upload" multiple>
              <el-button type="primary">上传照片</el-button>
            </el-upload>
            <el-button v-if="scope.row.photoList.length > 0" type="primary" @click="uploadPhoto(scope.row.id)">
              确认上传
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="科目" prop="subject"></el-table-column>
      <el-table-column label="年级" prop="grade"></el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
      <!-- 根据你的实体类添加其他字段 -->
      <el-table-column label="操作" width="275">
        <template v-slot="scope">
          <div style="display:inline-block;align-items: center">
            <el-button size="default" style="margin-right: 5px" type="warning" @click="editTask(scope.row)">编辑
            </el-button>
            <el-button size="default" style="margin-right: 5px" type="danger"
                       @click="deleteTask(scope.row)">删除
            </el-button>
            <el-button size="default" type="primary"
                       @click="detail(scope.row)">详情
            </el-button>
            <hr>
            <div style="text-align: left;margin-left: 5px">
              <el-select v-model="scope.row.child_id" multiple placeholder="分配任务给儿童" size="normal">
                <el-option
                    v-for="item in scope.row.childList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
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
  </div>
</template>

<script>

import request, {fileRequest} from "@/api";
import TaskCard from "@/components/card/TaskCard.vue";
import PublishCard from "@/components/card/PublishCard.vue";
import DetailCard from "@/components/card/DetailCard.vue";

export default {
  components: {
    TaskCard,
    PublishCard,
    DetailCard,
  },
  created() {
    this.search();
  },
  data() {
    return {
      searchKeyword: '',
      currentPage: 1,
      pageSize: 5, // 默认每页显示10行
      total: 0,
      taskList: [],
    };
  },
  methods: {
    uploadVideo(id) {
      let formData = new FormData();
      for (let i = 0; i < this.taskList.length; i++) {
        if (this.taskList[i].id === id) {
          formData.append('file', this.taskList[i].videoList[0].raw);
          formData.append('taskId', id);
          break;
        }
      }
      fileRequest.post('/administrator/task/upload/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.$msg({
            message: '上传成功',
            type: 'success',
            duration: 500
          });
          this.search();
        } else {
          this.$msg({
            message: '上传失败',
            type: 'error',
            duration: 500
          });
        }
      }).catch(err => {
        console.log(err);
      });
    },
    uploadPhoto(id) {
      let formData = new FormData();
      for (let i = 0; i < this.taskList.length; i++) {
        if (this.taskList[i].id === id) {
          formData.append('file', this.taskList[i].photoList[0].raw);
          formData.append('taskId', id);
          break;
        }
      }
      fileRequest.post('/administrator/task/upload/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.$msg({
            message: '上传成功',
            type: 'success',
            duration: 500
          });
          this.search();
        } else {
          this.$msg({
            message: '上传失败',
            type: 'error',
            duration: 500
          });
        }
      }).catch(err => {
        console.log(err);
      });
    },
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
            this.taskList[i].videoList = [];
            this.taskList[i].photoList = [];
            request.post('/administrator/user/search/childNotAssign', JSON.stringify({
              taskId: this.taskList[i].id,
              page: this.currentPage,
              size: 100
            })).then(res => {
              if (res.data.code === 0) {
                this.taskList[i].childList = res.data.result.objects;
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
    detail(task) {
      this.$refs.detailCard.detail(task);
    },
    save() {
      this.$confirm('此操作将保存分配的任务, 是否继续?', '提示', {
        customClass: 'confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let success = true;
        for (let i = 0; i < this.taskList.length; i++) {
          if (this.taskList[i].child_id !== null && this.taskList[i].child_id.length !== 0) {
            let children = [];
            for (let j = 0; j < this.taskList[i].child_id.length; j++) {
              children.push({
                id: this.taskList[i].child_id[j],
              });
            }
            request.post('/administrator/task/assignChild', JSON.stringify({
              taskId: this.taskList[i].id,
              children: children,
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
              message: '保存成功',
              type: 'success',
              duration: 500
            });
            setTimeout(() => {
              location.reload();
            }, 500);
          } else {
            this.$msg({
              message: '保存失败',
              type: 'error',
              duration: 500
            });
            setTimeout(() => {
              location.reload();
            }, 500);
          }
        }, 1000);
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
    handleVideoChange(file, fileList, id) {
      //判断文件大小不超过 100MB
      if (file.size > 100 * 1024 * 1024) {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '文件大小不能超过 100MB!'
        });
        fileList.pop();
      }
      if (fileList.length > 0) {
        for (let i = 0; i < this.taskList.length; i++) {
          if (this.taskList[i].id === id) {
            this.taskList[i].videoList = [fileList[fileList.length - 1]];
            break;
          }
        }
      }
    },
    handlePhotoChange(file, fileList, id) {
      //判断文件大小不超过 10MB
      if (file.size > 10 * 1024 * 1024) {
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'warning',
          message: '文件大小不能超过 10MB!'
        });
        fileList.pop();
      }
      if (fileList.length > 0) {
        for (let i = 0; i < this.taskList.length; i++) {
          if (this.taskList[i].id === id) {
            this.taskList[i].photoList = [fileList[fileList.length - 1]];
            break;
          }
        }
      }
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
  width: 1800px;
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
