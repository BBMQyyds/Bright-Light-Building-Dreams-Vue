<template>
  <div class="main">
    <!-- 志愿者资质审核 -->
    <div style="margin-bottom: 80px">
      <h2 style="margin-left: 20px">志愿者资质审核</h2>
      <el-table
          ref="table"
          :cell-style="{'text-align':'center'}"
          :data="volunteerListToReview"
          :header-cell-style="{backgroundColor:'#393E46','text-align':'center', 'font-size': '15px',
          'color': 'white', 'font-weight': 'normal'}"
          class="table"
          style="margin: 20px;">
        <!-- 列定义 -->
        <el-table-column label="用户名" prop="volUsername"></el-table-column>
        <el-table-column label="姓名" prop="volName"></el-table-column>
        <el-table-column label="地点" prop="volLocate"></el-table-column>
        <el-table-column label="组织" prop="volOrganization"></el-table-column>
        <el-table-column label="材料">
          <el-button type="text" @click="downloadFile(this.fileNames[Math.floor(Math.random() * 6)])">下载材料
          </el-button>
        </el-table-column>
        <el-table-column label="审核">
          <template v-slot="scope">
            <div style="display: flex; justify-content: center;margin-left: 15px">
              <el-button size="default" style="margin-right: 10px" type="primary"
                         @click="passVolunteer(scope.row)">通过
              </el-button>
              <el-button size="default" type="danger" @click="rejectVolunteer(scope.row)">驳回</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          :current-page="volunteerCurrentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :total="volunteerTotal"
          layout="total, prev, pager, next"
          @current-change="handleVolunteerCurrentPageChange">
      </el-pagination>
    </div>

    <!-- 志愿组织资质审核 -->
    <div style="margin-bottom: 80px">
      <h2 style="margin-left: 20px">志愿组织资质审核</h2>
      <el-table
          ref="table"
          :cell-style="{'text-align':'center'}"
          :data="organizationListToReview"
          :header-cell-style="{backgroundColor:'#393E46','text-align':'center', 'font-size': '15px',
          'color': 'white', 'font-weight': 'normal'}"
          class="table"
          style="margin: 20px;">
        <!-- 列定义 -->
        <el-table-column label="名称" prop="orgName"></el-table-column>
        <el-table-column label="地点" prop="orgAddress"></el-table-column>
        <el-table-column label="介绍" prop="orgIntroduction"></el-table-column>
        <el-table-column label="人数" prop="orgNumber"></el-table-column>
        <el-table-column label="材料">
          <el-button type="text" @click="downloadFile(this.fileNames[Math.floor(Math.random() * 6)])">
            下载材料
          </el-button>
        </el-table-column>
        <el-table-column label="审核">
          <template v-slot="scope">
            <div style="display: flex; justify-content: center;margin-left: 15px">
              <el-button size="default" style="margin-right: 10px" type="primary"
                         @click="passOrganization(scope.row)">通过
              </el-button>
              <el-button size="default" type="danger" @click="rejectOrganization(scope.row)">驳回</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          :current-page="organizationCurrentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :total="organizationTotal"
          layout="total, prev, pager, next"
          @current-change="handleOrganizationCurrentPageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from "@/api";

export default {
  name: "review",
  data() {
    return {
      volunteerListToReview: [], // 待审核的志愿者列表
      organizationListToReview: [], // 待审核的志愿组织列表
      volunteerCurrentPage: 1, // 志愿者列表的当前页码
      organizationCurrentPage: 1, // 志愿组织列表的当前页码
      pageSize: 5, // 默认每页显示5行
      volunteerTotal: 0, // 志愿者列表的总行数
      organizationTotal: 0, // 志愿组织列表的总行数
      fileNames: [],
    };
  },
  created() {
    // 在组件创建时，获取待审核的志愿者和志愿组织列表
    this.fetchVolunteersToReview();
    this.fetchOrganizationsToReview();
    this.initFilenames();
  },
  methods: {
    fetchVolunteersToReview() {
      request.post('/administrator/user/volunteer/search', JSON.stringify({
        volName: '',
        passed: '0',
        page: this.volunteerCurrentPage,
        size: this.pageSize
      })).then(res => {
        if (res.data.code === 0) {
          this.volunteerListToReview = res.data.result.objects;
          this.volunteerTotal = res.data.result.total;
          console.log(this.volunteerListToReview);
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

    fetchOrganizationsToReview() {
      request.post('/administrator/user/organization/search/', JSON.stringify({
        orgName: '',
        passed: '0',
        page: this.organizationCurrentPage,
        size: this.pageSize
      })).then(res => {
        if (res.data.code === 0) {
          this.organizationListToReview = res.data.result.objects;
          this.organizationTotal = res.data.result.total;
        } else {
          this.$msg({
            message: '获取志愿组织列表失败',
            type: 'error',
            duration: 500
          });
        }
      }).catch(err => {
        console.log(err);
      });
    },
    passVolunteer(row) {
      // 通过志愿者的审核
      request.post('/administrator/qualifications/vol/pass', JSON.stringify({
        volId: row.volId
      })).then(res => {
        if (res.data.code === 0) {
          this.$msg({
            message: '通过志愿者审核成功',
            type: 'success',
            duration: 500
          });
          location.reload();
          this.fetchVolunteersToReview();
        } else {
          this.$msg({
            message: '通过志愿者审核失败',
            type: 'error',
            duration: 500
          });
        }
      }).catch(err => {
        console.log(err);
      });
    },
    rejectVolunteer(row) {
      // 驳回志愿者的审核
      this.$prompt('请输入驳回理由', '提示', {
        customClass: 'reject',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请输入驳回理由'
      }).then(({value}) => {
        request.post('/administrator/qualifications/vol/reject', JSON.stringify({
          volId: row.volId,
          reason: value
        })).then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '驳回志愿者审核成功',
              type: 'success',
              duration: 500
            });
            location.reload();
            this.fetchVolunteersToReview();
          } else {
            this.$msg({
              message: '驳回志愿者审核失败',
              type: 'error',
              duration: 500
            });
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch(() => {
        this.$msg({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    passOrganization(row) {
      // 通过志愿组织的审核
      request.post('/administrator/qualifications/org/pass', JSON.stringify({
        orgId: row.orgId
      })).then(res => {
        if (res.data.code === 0) {
          this.$msg({
            message: '通过志愿组织审核成功',
            type: 'success',
            duration: 500
          });
          location.reload();
          this.fetchOrganizationsToReview();
        } else {
          this.$msg({
            message: '通过志愿组织审核失败',
            type: 'error',
            duration: 500
          });
        }
      }).catch(err => {
        console.log(err);
      });
    },
    rejectOrganization(row) {
      // 驳回志愿组织的审核
      this.$prompt('请输入驳回理由', '提示', {
        customClass: 'reject',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请输入驳回理由'
      }).then(({value}) => {
        request.post('/administrator/qualifications/org/reject', JSON.stringify({
          orgId: row.orgId,
          reason: value
        })).then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '驳回志愿组织审核成功',
              type: 'success',
              duration: 500
            });
            location.reload();
            this.fetchOrganizationsToReview();
          } else {
            this.$msg({
              message: '驳回志愿组织审核失败',
              type: 'error',
              duration: 500
            });
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch(() => {
        this.$msg({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    initFilenames() {
      this.fileNames.push('144823095845864646.doc');
      this.fileNames.push('154131454676768883.doc');
      this.fileNames.push('168934304025406056.doc');
      this.fileNames.push('342265163958849536.doc');
      this.fileNames.push('353570952728154113.doc');
      this.fileNames.push('361240044025024512.doc');
    },
    handleVolunteerCurrentPageChange(page) {
      // 处理志愿者列表的页码变化
      this.volunteerCurrentPage = page;
      this.fetchVolunteersToReview();
    },
    handleOrganizationCurrentPageChange(page) {
      // 处理志愿组织列表的页码变化
      this.organizationCurrentPage = page;
      this.fetchOrganizationsToReview();
    },
    downloadFile(id) {
      const link = document.createElement('a');
      // 本地路径
      link.href = 'http://123.56.248.217:9000/doc/' + id;
      document.body.appendChild(link);
      // 模拟点击链接以触发下载
      link.click();
      // 删除创建的链接元素
      document.body.removeChild(link);
    }
  },
};
</script>

<style scoped>

.main {
  width: 1400px;
  margin: 40px auto auto;
}

:deep(input) {
  width: 200px;
  height: 40px;
  border: none;
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

.reject {
  .el-input__inner {
    width: 300px !important;
    border: none;
  }

  .el-input--suffix .el-input__inner {
    width: 300px !important;
    border: none;
  }

  .el-input__icon {
    height: 100%;
    border: none;
  }

  :deep(input) {
    width: 200px;
    height: 40px;
    border: none;
  }

  .el-button:nth-child(1) {
    padding-top: 8px;
  }

  .el-button:nth-child(2) {
    padding-top: 8px;
  }
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

.el-select-dropdown,
.scroll-opacity.el-scrollbar,
.el-scrollbar__bar.is-vertical {
  opacity: 1; //改为0不显示滚动条
}

</style>
