<template>

  <el-row class="row">
    <el-col :span="12" style="padding: 40px">
      <el-row class="row" style="align-items: center">
        <el-col :span="8">
          <el-input v-model="searchChildKeyword" class="search" placeholder="搜索儿童" @input="search"></el-input>
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
        <el-table-column label="任务数">
          <template v-slot="scope">
            <span>{{ scope.row.duty }} / {{ scope.row.completedTasks }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="225">
          <template v-slot="scope">
            <div class="selectClass">
              <el-select v-model="scope.row.volunteerId" placeholder="请选择志愿者" size="small"
                         style="display: block;width: 110%;" @change="changeVolunteer(scope.row)">
                <el-option
                    v-for="item in volunteerList"
                    :key="item.volId"
                    :label="item.volName"
                    :value="item.volId">
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination :current-page="currentChildPage"
                     :page-size="pageSize"
                     :page-sizes="[10, 20, 30, 40]"
                     :total="totalChild"
                     layout="total, prev, pager, next"
                     style="margin-left: 20px"
                     @current-change="handleCurrentChildPageChange">
      </el-pagination>
    </el-col>
    <el-col :span="12" style="padding: 40px">
      <el-row class="row" style="align-items: center">
        <el-col :span="8">
          <el-input v-model="searchVolunteerKeyword" class="search" placeholder="搜索志愿者"
                    @input="search"></el-input>
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
        <el-table-column label="姓名" prop="volName"></el-table-column>
        <el-table-column label="地点" prop="volLocate"></el-table-column>
        <el-table-column label="组织" prop="volOrganization"></el-table-column>
        <el-table-column label="任务数">
          <template v-slot="scope">
            <span>{{ scope.row.volCorrectedTasks }} / {{ scope.row.volDuty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="225">
          <template v-slot="scope">
            <div class="selectClass">
              <el-select v-model="scope.row.childId" placeholder="请选择儿童" size="small"
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

      <el-pagination :current-page="currentVolunteerPage"
                     :page-size="pageSize"
                     :page-sizes="[10, 20, 30, 40]"
                     :total="totalVolunteer"
                     layout="total, prev, pager, next"
                     style="margin-left: 20px"
                     @current-change="handleCurrentVolunteerPageChange">
      </el-pagination>
    </el-col>
  </el-row>

</template>

<script>

import request from "@/api";

export default {
  name: "interactive-management",
  created() {
    this.searchChild();
    this.searchVolunteer();
  },
  methods: {
    search() {
      this.searchChild();
      this.searchVolunteer();
    },
    save() {
      this.$confirm('此操作将保存所有志愿者和儿童的任务分配, 是否继续?', '提示', {
        customClass: 'confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let success = true;
        for (let i = 0; i < this.childList.length; i++) {
          if (this.childList[i].volunteerId !== null && this.childList[i].volunteerId !== '') {
            request.post('/administrator/user/save', JSON.stringify({
              id: this.childList[i].id,
              volunteerId: this.childList[i].volunteerId
            })).then(res => {
              if (res.data.code === 0) {
                this.$msg({
                  message: '保存成功',
                  type: 'success',
                  duration: 500
                });
              } else {
                success = false;
                this.$msg({
                  message: '保存失败',
                  type: 'error',
                  duration: 500
                });
              }
            }).catch(err => {
              console.log(err);
            });
          }
        }
        if (success) {
          this.$msg({
            message: '保存成功',
            type: 'success',
            duration: 500
          });
          location.reload();
        } else {
          this.$msg({
            message: '保存失败',
            type: 'error',
            duration: 500
          });
          location.reload();
        }
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
          this.volunteerList[i].childId = '';
        }
        for (let i = 0; i < this.childList.length; i++) {
          this.childList[i].volunteerId = '';
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
      request.post('/administrator/user/search/childInNeed', JSON.stringify({
        name: this.searchChildKeyword,
        page: this.currentChildPage,
        size: this.pageSize,
        volunteerId: ''
      })).then(res => {
        if (res.data.code === 0) {
          this.childList = res.data.result.objects;
          this.totalChild = res.data.result.total;
          // for (let i = 0; i < this.childList.length; i++) {
          //   //遍历元素的属性
          //   for (let key in this.childList[i]) {
          //     //如果元素的属性为null，将其置为'暂无'
          //     if (typeof this.childList[i][key] === 'undefined' || this.childList[i][key] === null) {
          //       this.childList[i][key] = '暂无';
          //     }
          //   }
          // }
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
        name: this.searchVolunteerKeyword,
        page: this.currentVolunteerPage,
        size: this.pageSize,
      })).then(res => {
        if (res.data.code === 0) {
          this.volunteerList = res.data.result.objects;
          this.totalVolunteer = res.data.result.total;
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
    changeVolunteer(row) {
      for (let i = 0; i < this.childList.length; i++) {
        if (this.childList[i].volunteerId === row.volunteerId && this.childList[i].id !== row.id) {
          this.childList[i].volunteerId = '';
          break;
        }
      }
      for (let i = 0; i < this.volunteerList.length; i++) {
        if (this.volunteerList[i].volId === row.volunteerId) {
          this.volunteerList[i].childId = row.id;
        } else {
          if (this.volunteerList[i].childId === row.id) {
            this.volunteerList[i].childId = '';
          }
        }
      }
    },
    changeChild(row) {
      for (let i = 0; i < this.volunteerList.length; i++) {
        if (this.volunteerList[i].childId === row.childId && this.volunteerList[i].volId !== row.volId) {
          this.volunteerList[i].childId = '';
          break;
        }
      }
      for (let i = 0; i < this.childList.length; i++) {
        if (this.childList[i].id === row.childId) {
          this.childList[i].volunteerId = row.volId;
        } else {
          if (this.childList[i].volunteerId === row.volId) {
            this.childList[i].volunteerId = '';
          }
        }
      }
    },
    handleCurrentChildPageChange(page) {
      this.currentChildPage = page;
      this.searchChild();
      this.searchVolunteer();
    },
    handleCurrentVolunteerPageChange(page) {
      this.currentVolunteerPage = page;
      this.searchVolunteer();
      this.searchChild();
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

  .el-input_Inner {
    width: 125px !important;
  }

  .el-input--suffix .el-input_Inner {
    width: 125px !important;
  }

  .el-input_Icon {
    height: 100%;
  }
}

.el-select-dropdown,
.scroll-opacity.el-scrollbar,
.el-scrollbar__bar.is-vertical {
  opacity: 1; //改为0不显示滚动条
}

</style>