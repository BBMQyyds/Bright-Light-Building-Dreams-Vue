<template>
  <div class="main">
    <VolunteerCard ref="volunteerCard"></VolunteerCard>
    <el-row class="row">
      <el-col :span="4">
        <el-input v-model="searchKeyword" class="search" placeholder="搜索志愿者账户" @input="search"></el-input>
      </el-col>
      <el-col :span="2" class="text-right" style="margin-left: 25px">
        <el-button type="primary" @click="addVolunteer">添加志愿者</el-button>
      </el-col>
    </el-row>
    <el-table
        ref="table"
        :cell-style="{'text-align':'center'}"
        :data="volunteerList"
        :header-cell-style="{backgroundColor:'#393E46','text-align':'center'
        , 'font-size': '15px','color': 'white', 'font-weight': 'normal'}"
        class="table"
        style="margin-top: 20px;">
      <!--      <el-table-column label="ID" prop="volId"></el-table-column>-->
      <el-table-column label="用户名" prop="volUsername"></el-table-column>
      <el-table-column label="姓名" prop="volName"></el-table-column>
      <el-table-column label="地点" prop="volLocate"></el-table-column>
      <el-table-column label="组织" prop="volOrganization"></el-table-column>
      <el-table-column label="持有任务数" prop="volDuty"></el-table-column>
      <el-table-column label="完成任务数" prop="volCorrectedTasks"></el-table-column>
      <el-table-column label="电话" prop="volTel"></el-table-column>
      <el-table-column label="操作" width="225">
        <template v-slot="scope">
          <div style="display: flex; justify-content: center;margin-left: 15px">
            <el-button size="default" style="margin-right: 10px" type="warning" @click="editVolunteer(scope.row)">编辑
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
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handleCurrentPageChange">
    </el-pagination>
  </div>
</template>

<script>

import VolunteerCard from "@/components/card/VolunteerCard.vue";
import request from "@/api";

export default {
  name: "VolunteerManagement",
  components: {
    VolunteerCard,
  },
  created() {
    this.search();
  },
  data() {
    return {
      searchKeyword: '',
      volunteerList: [],
      currentPage: 1,
      pageSize: 10, // 默认每页显示10行
      total: 0,
    };
  },
  methods: {
    search() {
      request.post('/administrator/user/volunteer/search', JSON.stringify({
        volName: this.searchKeyword,
        page: this.currentPage,
        size: this.pageSize
      })).then(res => {
        if (res.data.code === 0) {
          this.volunteerList = res.data.result.objects;
          this.total = res.data.result.total;
          // for (let i = 0; i < this.volunteerList.length; i++) {
          //   //遍历元素的属性
          //   for (let key in this.volunteerList[i]) {
          //     //如果元素的属性为null，将其置为'暂无'
          //     if (typeof this.volunteerList[i][key] === 'undefined' || this.volunteerList[i][key] === null) {
          //       this.volunteerList[i][key] = '暂无';
          //     }
          //   }
          // }
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
    handleCurrentPageChange(page) {
      this.currentPage = page;
      this.search();
    },
    addVolunteer() {
      // 打开添加志愿者的对话框
      this.$refs.volunteerCard.addVolunteer();
    },
    editVolunteer(volunteer) {
      // 打开编辑志愿者的对话框，并传递志愿者信息
      this.$refs.volunteerCard.editVolunteer(volunteer);
      // 更新对话框中的表单数据，根据传递的志愿者信息
    },
    deleteVolunteer(volunteer) {
      console.log(volunteer.volId);
      // 弹出确认框
      this.$confirm('此操作将永久删除该志愿者账户, 是否继续?', '提示', {
        customClass: 'confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.post('/administrator/user/volunteer/delete?id=' + volunteer.volId).then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 500
            });
            setTimeout(() => {
              location.reload();
            }, 500);
            this.search();
          } else {
            this.$message({
              message: '删除失败',
              type: 'error',
              duration: 500
            });
          }
        }).catch(err => {
          console.log(err);
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
  width: 1400px;
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