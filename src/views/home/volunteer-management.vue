<template>
  <div class="main">
    <el-row class="row">
      <el-col :span="12">
        <el-input v-model="searchKeyword" class="search" placeholder="搜索志愿者账户"></el-input>
      </el-col>
    </el-row>
    <el-table
        ref="table"
        :cell-style="{'text-align': 'center'}"
        :data="pagedVolunteerList"
        :header-cell-style="{backgroundColor: '#D9AFD9', 'text-align': 'center', 'font-size': '15px', 'color': 'black', 'font-weight': 'normal', 'padding-left': '15px'}"
        class="table"
        style="margin-top: 20px;">
      <el-table-column label="ID" prop="id" sortable></el-table-column>
      <el-table-column label="用户名" prop="username" sortable></el-table-column>
      <el-table-column label="姓名" prop="name" sortable></el-table-column>
      <el-table-column label="地点" prop="locate" sortable></el-table-column>
      <el-table-column label="组织" prop="organization" sortable></el-table-column>
      <!-- 根据你的实体类添加其他字段 -->
      <el-table-column label="操作" width="225">
        <template v-slot="scope">
          <div style="display: flex; justify-content: center; margin-left: 15px">
            <el-button size="default" type="warning" @click="editVolunteer(scope.row)">编辑</el-button>
            <el-button size="default" type="danger" @click="deleteVolunteer(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <p></p>
    <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :total="inputVolunteerList.length"
        layout="total, prev, pager, next"
        @current-change="handleCurrentPageChange">
    </el-pagination>
  </div>
</template>


<script>
import router from "@/router";

export default {
  data() {
    return {
      searchKeyword: '',
      volunteerList: [
        {
          id: 1,
          username: 'volunteer1',
          name: '志愿者1',
          locate: '北京',
          organization: '组织1',
          // 根据你的实体类添加其他字段
        },
        {
          id: 2,
          username: 'volunteer2',
          name: '志愿者2',
          locate: '上海',
          organization: '组织2',
          // 根据你的实体类添加其他字段
        },
        // 添加更多志愿者数据
      ],
      currentPage: 1,
      pageSize: 10, // 默认每页显示10行
    };
  },
  computed: {
    pagedVolunteerList() {
      let list = this.inputVolunteerList;
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return list.slice(startIndex, endIndex);
    },
    inputVolunteerList() {
      let list = this.volunteerList;
      if (this.searchKeyword) {
        list = this.volunteerList.filter((volunteer) =>
            ((volunteer.username && volunteer.username.toLowerCase().includes(this.searchKeyword.toLowerCase()))
                || (volunteer.name && volunteer.name.toLowerCase().includes(this.searchKeyword.toLowerCase()))
                || (volunteer.locate && volunteer.locate.toLowerCase().includes(this.searchKeyword.toLowerCase()))
                || (volunteer.organization && volunteer.organization.toLowerCase().includes(this.searchKeyword.toLowerCase()))
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
    editChild(child) {

    },
    LoginOut() {
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

#button {
  margin-left: 90%;
}
</style>
