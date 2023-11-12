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
        <el-table-column label="审核">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.if_pass"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="updateVolunteerPassStatus(scope.row)"/>
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
        <el-table-column label="名称" prop="org_name"></el-table-column>
        <el-table-column label="审核">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.org_pass_if"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="updateOrganizationPassStatus(scope.row)"/>
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
    };
  },
  created() {
    // 在组件创建时，获取待审核的志愿者和志愿组织列表
    this.fetchVolunteersToReview();
    this.fetchOrganizationsToReview();
  },
  methods: {
    fetchVolunteersToReview() {
      // 发起请求获取待审核的志愿者列表，并将结果赋给 volunteerListToReview
      request.post('/administrator/user/volunteer/search', JSON.stringify({
        ifPass: '0',
        page: this.currentPage,
        size: this.pageSize
      })).then(res => {
        if (res.data.code === 0) {
          this.volunteerList = res.data.result.objects;
          this.volunteerTotal = res.data.result.total;
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
      // 发起请求获取待审核的志愿组织列表，并将结果赋给 organizationListToReview
    },
    updateVolunteerPassStatus(volunteer) {
      // 发起请求更新志愿者的审核状态
      // volunteer 参数包含志愿者的信息，以及新的审核状态
    },
    updateOrganizationPassStatus(organization) {
      // 发起请求更新志愿组织的审核状态
      // organization 参数包含组织的信息，以及新的审核状态
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
