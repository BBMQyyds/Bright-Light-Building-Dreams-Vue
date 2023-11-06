<template>
  <div class="main">
    <el-row class="row">
      <el-col :span="4">
        <el-input v-model="searchKeyword" class="search" placeholder="搜索志愿者账户" @change="search"></el-input>
      </el-col>
      <el-col :span="2" class="text-right">
        <el-button type="primary" @click="addVolunteer">添加志愿者</el-button>
      </el-col>
    </el-row>
    <el-table
        ref="table"
        :cell-style="{'text-align':'center'}"
        :data="pagedVolunteerList"
        :header-cell-style="{backgroundColor:'#393E46','text-align':'center'
        , 'font-size': '15px','color': 'white', 'font-weight': 'normal','padding-left': '17px'}"
        class="table"
        style="margin-top: 20px;">
      <el-table-column label="ID" prop="id" sortable></el-table-column>
      <el-table-column label="用户名" prop="username" sortable></el-table-column>
      <el-table-column label="姓名" prop="name" sortable></el-table-column>
      <el-table-column label="地点" prop="locate" sortable></el-table-column>
      <el-table-column label="组织" prop="organization" sortable></el-table-column>
      <el-table-column label="持有任务数" prop="duty" sortable></el-table-column>
      <el-table-column label="已完成任务" prop="completed_tasks" sortable></el-table-column>
      <el-table-column label="电话" prop="tel" sortable></el-table-column>
      <el-table-column label="身份证" prop="sfz" sortable></el-table-column>
      <el-table-column label="是否审核通过" prop="if_pass" sortable></el-table-column>
      <el-table-column label="操作" width="225">
        <template v-slot="scope">
          <div style="display: flex; justify-content: center;margin-left: 15px">
            <el-button size="default" type="warning" @click="editVolunteer(scope.row)" style="margin-right: 10px">编辑
            </el-button>
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
import request from "@/api";

export default {
  name: "VolunteerManagement",
  created() {
    this.search();
  },
  data() {
    return {
      searchKeyword: '',
      volunteerVisible: false,
      volunteerList: [],
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
        // 根据你的志愿者数据模型和字段进行搜索
        list = this.volunteerList.filter((volunteer) =>
            ((volunteer.username && volunteer.username.toLowerCase().includes(this.searchKeyword.toLowerCase()))
                || (volunteer.name && volunteer.name.toLowerCase().includes(this.searchKeyword.toLowerCase()))
                // 继续添加其他字段的搜索条件
            ));
      }
      return list;
    }
  },
  methods: {
    search(){
      request
    },
    handleCurrentPageChange(page) {
      this.currentPage = page;
    },
    addVolunteer() {
      // 打开添加志愿者的对话框
      this.volunteerVisible = true;
    },
    editVolunteer(volunteer) {
      // 打开编辑志愿者的对话框，并传递志愿者信息
      this.volunteerVisible = true;
      // 更新对话框中的表单数据，根据传递的志愿者信息
    },
    deleteVolunteer(volunteer) {
      // 弹出确认框
      this.$confirm('此操作将永久删除该志愿者账户, 是否继续?', '提示', {
        customClass: 'confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 执行删除操作
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 500
        });
      }).catch(() => {
        this.$message({
          message: '已取消删除',
          type: 'info',
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