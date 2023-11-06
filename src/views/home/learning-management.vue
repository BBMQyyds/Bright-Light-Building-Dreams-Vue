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
        :data="pagedTaskList"
        :header-cell-style="{backgroundColor: '#D9AFD9', 'text-align': 'center', 'font-size': '15px', 'color': 'black', 'font-weight': 'normal', 'padding-left': '15px'}"
        class="table"
        style="margin-top: 20px;"
    >
      <el-table-column label="ID" prop="id" sortable></el-table-column>
      <el-table-column label="分数" prop="score" sortable></el-table-column>
      <el-table-column label="内容" prop="content" sortable></el-table-column>
      <el-table-column label="开始时间" prop="startTime" sortable></el-table-column>
      <el-table-column label="结束时间" prop="finishTime" sortable></el-table-column>
      <el-table-column label="视频" prop="video" sortable></el-table-column>
      <el-table-column label="科目" prop="subject" sortable></el-table-column>
      <el-table-column label="年级" prop="grade" sortable></el-table-column>
      <el-table-column label="状态" prop="status" sortable></el-table-column>
      <el-table-column label="必须完成" prop="isMustDo" sortable>
      </el-table-column>
      <!-- 根据你的实体类添加其他字段 -->
      <el-table-column label="操作" width="225">
        <template v-slot="scope">
          <div style="display: flex; justify-content: center; margin-left: 15px">
            <el-button size="default" type="warning" @click="editTask(scope.row)">编辑</el-button>
            <el-button size="default" type="danger" @click="deleteTask(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <p></p>
    <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :total="inputTaskList.length"
        layout="total, prev, pager, next"
        @current-change="handleCurrentPageChange">
    </el-pagination>
  </div>
</template>

<script>

export default {
  data() {
    return {
      searchKeyword: '',
      taskList: [
        {
          id: '1',
          score: 100,
          content: '完成数学作业',
          startTime: this.$utils.formatDateToYYMMDDHHMMSS(new Date()),
          finishTime: this.$utils.formatDateToYYMMDDHHMMSS(new Date()),
          video: 'math.mp4',
          subject: '数学',
          grade: '一年级',
          status: '进行中',
          isMustDo: true,
        },
        {
          id: '2',
          score: 90,
          content: '阅读英语书籍',
          startTime: new Date(),
          finishTime: new Date(),
          video: 'english.mp4',
          subject: '英语',
          grade: '二年级',
          status: '已完成',
          isMustDo: true,
        },
        {
          id: '3',
          score: 80,
          content: '科学实验',
          startTime: new Date(),
          finishTime: new Date(),
          video: 'science.mp4',
          subject: '科学',
          grade: '三年级',
          status: '未开始',
          isMustDo: false,
        },
        {
          id: '4',
          score: 95,
          content: '历史研究',
          startTime: new Date(),
          finishTime: new Date(),
          video: 'history.mp4',
          subject: '历史',
          grade: '四年级',
          status: '进行中',
          isMustDo: true,
        },
        {
          id: '5',
          score: 85,
          content: '音乐表演',
          startTime: new Date(),
          finishTime: new Date(),
          video: 'music.mp4',
          subject: '音乐',
          grade: '五年级',
          status: '已完成',
          isMustDo: true,
        },
        {
          id: '6',
          score: 75,
          content: '艺术创作',
          startTime: new Date(),
          finishTime: new Date(),
          video: 'art.mp4',
          subject: '艺术',
          grade: '六年级',
          status: '进行中',
          isMustDo: false,
        },
      ],
      currentPage: 1,
      pageSize: 10, // 默认每页显示10行
    };
  },
  computed: {
    pagedTaskList() {
      let list = this.inputTaskList;
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return list.slice(startIndex, endIndex);
    },
    inputTaskList() {
      let list = this.taskList;
      if (this.searchKeyword) {
        list = this.taskList.filter((task) =>
            ((task.id && task.id.toLowerCase().includes(this.searchKeyword.toLowerCase()))
                || (task.content && task.content.toLowerCase().includes(this.searchKeyword.toLowerCase()))
                || (task.subject && task.subject.toLowerCase().includes(this.searchKeyword.toLowerCase()))
                || (task.grade && task.grade.toLowerCase().includes(this.searchKeyword.toLowerCase()))
                // 根据其他字段添加过滤条件
            ));
      }
      return list;
    }
  },

  methods: {
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
  },
  filters: {
    formatDateTime(value) {
      if (!value) return "";
      // 将日期字符串解析为日期对象
      const dateObj = new Date(value.date.year, value.date.month - 1, value.date.day);
      const timeObj = value.time;
      // 格式化日期
      const formattedDate = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
      // 格式化时间
      const formattedTime = `${timeObj.hour}:${timeObj.minute}:${timeObj.second}`;
      return `${formattedDate}，${formattedTime}`;
    }
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
  background-color: #97D9E1;
}

.table ::v-deep .el-table__body tr:hover > td {
  background-color: #D9AFD9 !important;
}

.el-button {
  padding-top: 8px;
}

.table {
  border-radius: 15px;
}

</style>

<style lang="scss">
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
