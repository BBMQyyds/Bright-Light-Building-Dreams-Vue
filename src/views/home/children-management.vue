<template>
  <div class="main">
    <el-row class="row">
      <el-col :span="4">
        <el-input v-model="searchKeyword" class="search" placeholder="搜索儿童账户"></el-input>
      </el-col>
      <el-col :span="2" class="text-right">
        <el-button type="primary" @click="addChild">添加儿童</el-button>
      </el-col>
    </el-row>
    <el-table
        ref="table"
        :cell-style="{'text-align':'center'}"
        :data="pagedChildList"
        :header-cell-style="{backgroundColor:'#D9AFD9','text-align':'center'
        , 'font-size': '15px','color': 'black', 'font-weight': 'normal','padding-left': '17px'}"
        class="table"
        style="margin-top: 20px;">
      <el-table-column label="ID" prop="id" sortable></el-table-column>
      <el-table-column label="用户名" prop="username" sortable></el-table-column>
      <el-table-column label="分数" prop="score" sortable></el-table-column>
      <el-table-column label="姓名" prop="name" sortable></el-table-column>
      <el-table-column label="年级" prop="grade" sortable></el-table-column>
      <el-table-column label="地点" prop="locate" sortable></el-table-column>
      <el-table-column label="持有任务数" prop="duty" sortable></el-table-column>
      <el-table-column label="已完成任务" prop="completed_tasks" sortable></el-table-column>
      <el-table-column label="志愿者ID" prop="volunteer_id" sortable></el-table-column>
      <el-table-column label="操作" width="225">
        <template v-slot="scope">
          <div style="display: flex; justify-content: center;margin-left: 15px">
            <el-button size="default" type="warning" @click="editChild(scope.row)"
            style="margin-right: 10px">编辑</el-button>
            <ChildCard ref="childCard"></ChildCard>
            <el-button size="default" type="danger" @click="deleteChild(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <p></p>
    <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :total="inputChildList.length"
        layout="total, prev, pager, next"
        @current-change="handleCurrentPageChange">
    </el-pagination>
  </div>
</template>


<script>
import ChildCard from "@/components/bar/card/ChildCard.vue";

export default {
  name: "ChildrenManagement",
  components: {
    ChildCard,
  },
  data() {
    return {
      searchKeyword: '',
      childVisible: false,
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
    addChild() {
      this.$refs.childCard.addChild();
    },
    editChild(child) {
      this.$refs.childCard.editChild(child);
    },
    deleteChild(child) {
      // 弹出确认框
      this.$confirm('此操作将永久删除该儿童账户, 是否继续?', '提示', {
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
