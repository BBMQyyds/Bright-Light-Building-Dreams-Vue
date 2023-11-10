<template>
  <div class="main">
    <el-row class="row">
      <el-col :span="12">
        <el-input v-model="searchKeyword" class="search" placeholder="搜索任务"></el-input>
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
      <el-table-column label="开始时间" prop="startTime"></el-table-column>
      <el-table-column label="结束时间" prop="finishTime"></el-table-column>
      <el-table-column label="视频" prop="video">
        <template v-slot="scope">
          <el-button type="primary" @click="toVideo(scope.row.video)">查看视频</el-button>
        </template>
      </el-table-column>
      <el-table-column label="照片" prop="photo">
        <template v-slot="scope">
          <el-button type="primary" @click="toPhoto(scope.row.photo)">查看图片</el-button>
        </template>
      </el-table-column>
      <el-table-column label="科目" prop="subject"></el-table-column>
      <el-table-column label="年级" prop="grade"></el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
      <el-table-column label="必须完成" prop="isMustDo">
      </el-table-column>
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
                    :key="item.id"
                    :label="item.volName"
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
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handleCurrentPageChange">
    </el-pagination>
  </div>
</template>

<script>

import request from "@/api";

export default {
  created() {
    this.search();
    this.searchChild();
    this.searchVolunteer();
  },
  data() {
    return {
      searchKeyword: '',
      currentPage: 1,
      pageSize: 10, // 默认每页显示10行
      total: 0,
      childList: [],
      volunteerList: [],
      taskList: [
        {
          id: '1',
          score: 100,
          content: '完成数学作业',
          startTime: this.$utils.formatDateToYYMMDDHHMMSS(new Date()),
          finishTime: this.$utils.formatDateToYYMMDDHHMMSS(new Date()),
          video: 'http://123.56.248.217:9000/videos/2023/11/09/video_url_1.MP4',
          photo: 'http://123.56.248.217:9000/photos/2023/11/09/photo_url_4.png',
          subject: '数学',
          grade: '一年级',
          status: '进行中',
          isMustDo: true,
        },
      ],
    };
  },
  methods: {
    search() {
      request.post('/administrator/task/search', JSON.stringify({
        name: this.searchKeyword,
        page: this.currentPage,
        size: this.pageSize
      })).then(res => {
        if (res.data.code === 0) {
          this.taskList = res.data.result.objects;
          this.total = res.data.result.total;
          for (let i = 0; i < this.taskList.length; i++) {
            //遍历元素的属性
            for (let key in this.taskList[i]) {
              //如果元素的属性为null，将其置为'暂无'
              if (typeof this.taskList[i][key] === 'undefined' || this.taskList[i][key] === null) {
                this.taskList[i][key] = '暂无';
              }
            }
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
    },
    editTask(task) {
      // 编辑任务
    },
    deleteTask(task) {
      // 弹出确认框
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        customClass: 'confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$msg({
          message: '删除成功',
          type: 'success',
          duration: 500
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
