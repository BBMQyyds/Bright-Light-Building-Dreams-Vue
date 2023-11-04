<template>
  <div class="main">
    <el-row class="row">
      <el-col :span="12">
        <el-input class="search" v-model="searchKeyword" placeholder="搜索儿童账户"></el-input>
      </el-col>
    </el-row>
    <el-table
        ref="table"
        :data="pagedChildList"
        :cell-style="{'text-align':'center'}"
        :header-cell-style="{backgroundColor:'#D9AFD9','text-align':'center'
        , 'font-size': '15px','color': 'black', 'font-weight': 'normal','padding-left': '15px'}"
        class="table"
        style="margin-top: 20px;">
      <el-table-column label="ID" prop="id" sortable></el-table-column>
      <el-table-column label="用户名" prop="username" sortable></el-table-column>
      <el-table-column label="分数" prop="score" sortable></el-table-column>
      <el-table-column label="姓名" prop="name" sortable></el-table-column>
      <el-table-column label="年级" prop="grade" sortable></el-table-column>
      <el-table-column label="地点" prop="locate" sortable></el-table-column>
      <el-table-column label="责任" prop="duty" sortable></el-table-column>
      <el-table-column label="已完成任务" prop="completed_tasks" sortable></el-table-column>
      <el-table-column label="志愿者ID" prop="volunteer_id" sortable></el-table-column>
      <el-table-column label="操作" width="225">
        <template v-slot="scope">
          <div style="display: flex; justify-content: center;margin-left: 15px">
            <el-button type="warning" size="default" @click="editChild(scope.row)">编辑</el-button>
            <el-button type="danger" size="default" @click="deleteChild(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <p></p>
    <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="inputChildList.length"
        @current-change="handleCurrentPageChange">
    </el-pagination>
      <div id="button">
          <el-button
          type="primary"
          @click="LoginOut"
          >退出登录</el-button>
      </div>
  </div>
</template>


<script>
import router from "@/router";

export default {
  data() {
    return {
      searchKeyword: '',
      childList: [
        {
          id: 1,
          username: 'child1',
          score: 100,
          name: '儿童1',
          grade: '一年级',
          locate: '北京',
          duty: '父母',
          completed_tasks: 10,
          volunteer_id: 1,
        },
        {
          id: 2,
          username: 'child2',
          score: 100,
          name: '儿童2',
          grade: '一年级',
          locate: '北京',
          duty: '父母',
          completed_tasks: 10,
          volunteer_id: 1,
        },
        {
          id: 3,
          username: 'child3',
          score: 100,
          name: '儿童3',
          grade: '一年级',
          locate: '北京',
          duty: '父母',
          completed_tasks: 10,
          volunteer_id: 1,
        },
        {
          id: 4,
          username: 'child4',
          score: 100,
          name: '儿童4',
          grade: '一年级',
          locate: '北京',
          duty: '父母',
          completed_tasks: 10,
          volunteer_id: 1,
        },
        {
          id: 5,
          username: 'child5',
          score: 100,
          name: '儿童5',
          grade: '一年级',
          locate: '北京',
          duty: '父母',
          completed_tasks: 10,
          volunteer_id: 1,
        },
        {
          id: 6,
          username: 'child6',
          score: 100,
          name: '儿童6',
          grade: '一年级',
          locate: '北京',
          duty: '父母',
          completed_tasks: 10,
          volunteer_id: 1,
        },
        {
          id: 7,
        },
        {
          id: 8,
        },
        {
          id: 9,
        },
        {
          id: 10,
        },
        {
          id: 11,
        },
        {
          id: 12,
        },
        {
          id: 13,
        },
      ], // 用于存储儿童账户数据
      currentPage: 1,
      pageSize: 10, // 默认每页显示10行
    };
  },
  computed: {
    pagedChildList() {
      let list = this.inputChildList;
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return list.slice(startIndex, endIndex);
    },
    inputChildList() {
      let list = this.childList;
      if (this.searchKeyword) {
        list = this.childList.filter((child) =>
            ((child.username && child.username.toLowerCase().includes(this.searchKeyword.toLowerCase()))
                || (child.name && child.name.toLowerCase().includes(this.searchKeyword.toLowerCase()))
                || (child.grade && child.grade.toLowerCase().includes(this.searchKeyword.toLowerCase()))
                || (child.locate && child.locate.toLowerCase().includes(this.searchKeyword.toLowerCase()))
                || (child.duty && child.duty.toLowerCase().includes(this.searchKeyword.toLowerCase()))));
      }
      return list;
    }
  },
  methods: {
    handleCurrentPageChange(page) {
      this.currentPage = page;
    },
    editChild(child) {

    },
      LoginOut(){
          router.push({
              path: '/login',
          });
          sessionStorage.removeItem("token");
      },
    deleteChild(child) {
      // 弹出确认框
      this.$confirm('此操作将永久删除该儿童账户, 是否继续?', '提示', {
        customClass: 'confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success',
          offset: 75,
          duration: 500
        });
      }).catch(() => {
        this.$message({
          message: '已取消删除',
          type: 'info',
          offset: 75,
          duration: 500
        });
      });
    },
  },
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
    #button{
      margin-left: 90%;
    }
</style>
