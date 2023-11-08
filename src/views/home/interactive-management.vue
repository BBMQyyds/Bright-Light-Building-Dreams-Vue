<template>

  <el-row class="row">
    <el-col :span="12" style="padding: 40px">
      <el-row class="row" style="align-items: center">
        <el-col :span="8">
          <el-input v-model="searchChildKeyword" class="search" placeholder="搜索儿童" @change="searchChild"></el-input>
        </el-col>
        <el-col :span="12">
          <el-button class="reset" type="info" @click="reset">重置</el-button>
          <el-button class="save" type="primary" @click="save">保存</el-button>
        </el-col>
      </el-row>
      <el-table
          ref="table"
          :cell-style="{'text-align':'center'}"
          :data="childList"
          :header-cell-style="{backgroundColor:'#393E46','text-align':'center'
        , 'font-size': '15px','color': 'white', 'font-weight': 'normal'}"
          class="table"
          style="margin: 20px;">
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="分数" prop="score"></el-table-column>
        <el-table-column label="年级" prop="grade"></el-table-column>
        <el-table-column label="地点" prop="locate"></el-table-column>
        <el-table-column label="任务数" prop="tasks"></el-table-column>
        <el-table-column label="操作" width="225">
          <template v-slot="scope">
            <div class="selectClass">
              <el-select v-model="scope.row.volunteer_id" placeholder="请选择志愿者" size="small"
                         style="display: block;width: 110%;" @change="changeVolunteer(scope.row)">
                <el-option
                    v-for="item in volunteerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination style="margin-left: 20px"
          :current-page="currentChildPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :total="totalChild"
          layout="total, prev, pager, next"
          @current-change="handleCurrentChildPageChange">
      </el-pagination>
    </el-col>
    <el-col :span="12" style="padding: 40px">
      <el-row class="row" style="align-items: center">
        <el-col :span="8">
          <el-input v-model="searchVolunteerKeyword" class="search" placeholder="搜索志愿者"
                    @change="searchVolunteer"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="reset" type="info" @click="reset">重置</el-button>
        </el-col>
      </el-row>
      <el-table
          ref="table"
          :cell-style="{'text-align':'center'}"
          :data="volunteerList"
          :header-cell-style="{backgroundColor:'#393E46','text-align':'center'
        , 'font-size': '15px','color': 'white', 'font-weight': 'normal'}"
          class="table"
          style="margin: 20px;">
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="地点" prop="locate"></el-table-column>
        <el-table-column label="组织" prop="organization"></el-table-column>
        <el-table-column label="任务数" prop="tasks"></el-table-column>
        <el-table-column label="操作" width="225">
          <template v-slot="scope">
            <div class="selectClass">
              <el-select v-model="scope.row.child_id" placeholder="请选择儿童" size="small"
                         style="display: block;width: 110%;" @change="changeChild(scope.row)">
                <el-option
                    v-for="item in childList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination style="margin-left: 20px"
          :current-page="currentVolunteerPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :total="totalVolunteer"
          layout="total, prev, pager, next"
          @current-change="handleCurrentVolunteerPageChange">
      </el-pagination>
    </el-col>
  </el-row>

</template>

<script>
export default {
  name: "interactive-management",
  created() {
    this.searchChild();
    this.searchVolunteer();
  },
  methods: {
    save() {
      this.$confirm('此操作将保存所有志愿者和儿童的任务分配, 是否继续?', '提示', {
        customClass: 'confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$msg({
          message: '保存成功',
          type: 'success',
          duration: 500
        });
        this.reload();
      }).catch(() => {
        this.$msg({
          message: '已取消保存',
          type: 'info',
          duration: 500
        });
      });
    },
    reset() {
      this.$confirm('此操作将重置所有志愿者和儿童的任务分配, 是否继续?', '提示', {
        customClass: 'confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.volunteerList.length; i++) {
          this.volunteerList[i].child_id = '';
        }
        for (let i = 0; i < this.childList.length; i++) {
          this.childList[i].volunteer_id = '';
        }
        this.$msg({
          message: '重置成功',
          type: 'success',
          duration: 500
        });
      }).catch(() => {
        this.$msg({
          message: '已取消重置',
          type: 'info',
          duration: 500
        });
      });
    },
    searchChild() {

    },
    searchVolunteer() {

    },
    changeVolunteer(row) {
      for (let i = 0; i < this.childList.length; i++) {
        if (this.childList[i].volunteer_id === row.volunteer_id && this.childList[i].id !== row.id) {
          this.childList[i].volunteer_id = '';
          break;
        }
      }
      for (let i = 0; i < this.volunteerList.length; i++) {
        if (this.volunteerList[i].id === row.volunteer_id) {
          this.volunteerList[i].child_id = row.id;
        } else {
          if (this.volunteerList[i].child_id === row.id) {
            this.volunteerList[i].child_id = '';
          }
        }
      }
    },
    changeChild(row) {
      for (let i = 0; i < this.volunteerList.length; i++) {
        if (this.volunteerList[i].child_id === row.child_id && this.volunteerList[i].id !== row.id) {
          this.volunteerList[i].child_id = '';
          break;
        }
      }
      for (let i = 0; i < this.childList.length; i++) {
        if (this.childList[i].id === row.child_id) {
          this.childList[i].volunteer_id = row.id;
        } else {
          if (this.childList[i].volunteer_id === row.id) {
            this.childList[i].volunteer_id = '';
          }
        }
      }
    },
    handleCurrentChildPageChange(page) {
      this.currentChildPage = page;
    },
    handleCurrentVolunteerPageChange(page) {
      this.currentVolunteerPage = page;
    },
  },
  data() {
    return {
      searchChildKeyword: '',
      searchVolunteerKeyword: '',
      currentChildPage: 1,
      currentVolunteerPage: 1,
      pageSize: 10, // 默认每页显示20行
      totalChild: 0,
      totalVolunteer: 0,
      childList: [],
      volunteerList: [],
    };
  },
}
</script>

<style scoped>

:deep(input) {
  width: 200px;
  height: 40px;
  border: none;
}

.row {
  margin-top: 10px;
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

.search {
  margin-left: 40px;
}

.reset {
  margin-left: 100px;
}

.save {
  margin-left: 80px;
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

.selectClass {
  display: inline-block;

  .el-input {
    width: 125px !important;
  }

  .el-input__inner {
    width: 125px !important;
  }

  .el-input--suffix .el-input__inner {
    width: 125px !important;
  }

  .el-input__icon {
    height: 100%;
  }
}

.el-select-dropdown
.scroll-opacity.el-scrollbar
.el-scrollbar__bar.is-vertical {
  opacity: 1; //改为0不显示滚动条
}

</style>