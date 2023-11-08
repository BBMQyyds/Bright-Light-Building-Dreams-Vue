<template>
  <div class="main">
    <ChildCard ref="childCard"></ChildCard>
    <el-row class="row">
      <el-col :span="4">
        <el-input v-model="searchKeyword" class="search" placeholder="搜索儿童账户" @input="search"></el-input>
      </el-col>
      <el-col :span="2" class="text-right">
        <el-button type="primary" @click="addChild">添加儿童</el-button>
      </el-col>
    </el-row>
    <el-table
        ref="table"
        :cell-style="{'text-align':'center'}"
        :data="childList"
        :header-cell-style="{backgroundColor:'#393E46','text-align':'center'
        , 'font-size': '15px','color': 'white', 'font-weight': 'normal'}"
        class="table"
        style="margin-top: 20px;">
<!--      <el-table-column label="ID" prop="id"></el-table-column>-->
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="分数" prop="score"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="年级" prop="grade"></el-table-column>
      <el-table-column label="地点" prop="locate"></el-table-column>
      <el-table-column label="持有任务数" prop="duty"></el-table-column>
      <el-table-column label="完成任务数" prop="completedTasks"></el-table-column>
      <el-table-column label="志愿者ID" prop="volunteerId"></el-table-column>
      <el-table-column label="操作" width="225">
        <template v-slot="scope">
          <div style="display: flex; justify-content: center;margin-left: 15px">
            <el-button size="default" style="margin-right: 10px" type="warning"
                       @click="editChild(scope.row)">编辑
            </el-button>
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
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handleCurrentPageChange">
    </el-pagination>

  </div>
</template>


<script>
import ChildCard from "@/components/bar/card/ChildCard.vue";
import request from "@/api";

export default {
  name: "ChildrenManagement",
  components: {
    ChildCard,
  },
  created() {
    this.search();
  },
  data() {
    return {
      searchKeyword: '',
      currentPage: 1,
      pageSize: 10, // 默认每页显示10行
      childList: [],
      total: 0,
    };
  },
  methods: {
    search() {
      request.post('/administrator/user/search', JSON.stringify({
        name: this.searchKeyword,
        page: this.currentPage,
        size: this.pageSize
      })).then(res => {
        if (res.data.code === 0) {
          this.childList = res.data.result.objects;
          this.total = res.data.result.total;
          for (let i = 0; i < this.childList.length; i++) {
            //遍历元素的属性
            for (let key in this.childList[i]) {
              //如果元素的属性为null，将其置为'暂无'
              if (typeof this.childList[i][key] === 'undefined' || this.childList[i][key] === null) {
                this.childList[i][key] = '暂无';
              }
            }
          }
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
    handleCurrentPageChange(page) {
      this.currentPage = page;
    },
    addChild() {
      console.log(this.$refs.childCard);
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
        request.post('/administrator/user/delete', JSON.stringify({
          id: child.id
        })).then(res => {
          if (res.data.code === 1) {
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
