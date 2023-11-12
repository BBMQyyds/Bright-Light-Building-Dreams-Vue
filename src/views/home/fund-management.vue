<script>
import BarGraph from "@/components/graph/BarGraph.vue";
import BarGraph2 from "@/components/graph/BarGraph2.vue";
import BarGraph3 from "@/components/graph/BarGraph3.vue";
import request from "@/api";

export default {
  name: "fund-management",
  components: {
    BarGraph,
    BarGraph2,
    BarGraph3,
  },
  data() {
    return {
      fundingLogList: [], // 在这里存储从后端获取的资金日志数据
      currentPage: 1,
      pageSize: 5, // 默认每页显示10行
      total: 0,
    };
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      request.post('/administrator/log/searchFundingLog', JSON.stringify({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      })).then(res => {
        this.fundingLogList = res.data.items;
        this.total = res.data.counts;
      }).catch(err => {
        console.log(err);
      });
    },
    handleCurrentPageChange(page) {
      this.currentPage = page;
      this.search();
    },
  },
}
</script>

<template>
  <div>
    <div class="graph"></div>
    <div style="display: flex">
      <div id="graph1">
        <BarGraph :height="'460px'" :width="'840px'"></BarGraph>
      </div>
      <div id="graph2">
        <BarGraph2 :height="'360px'" :width="'820px'"></BarGraph2>
      </div>
    </div>
    <div id="graph3">
      <BarGraph3></BarGraph3>
    </div>
    <div id="table">
      <div>
        <el-table
            ref="table"
            :cell-style="{'text-align': 'center'}"
            :data="fundingLogList"
            :header-cell-style="{backgroundColor:'#393E46','text-align':'center'
        , 'font-size': '15px','color': 'white', 'font-weight': 'normal'}"
            class="table"
            style="margin-top: 20px;">
          <el-table-column label="金额" prop="changeAmonut"></el-table-column>
          <el-table-column label="描述" prop="descriptions"></el-table-column>
          <el-table-column label="捐赠来源" prop="organizationName"></el-table-column>
          <el-table-column label="捐赠日期" prop="createDate"></el-table-column>
        </el-table>

        <p></p>
        <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[5, 10, 20, 40]"
            :total="total"
            layout="total, prev, pager, next"
            @current-change="handleCurrentPageChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<style scoped>
.graph {
  margin: 50px;
}

#graph1 {
  margin-left: 80px;
}

#graph2 {
  margin-top: 50px;
}

#graph3 {
  margin-left: -1080px;
  margin-top: -125px;
}

#table {
  width: 800px;
  margin-left: 920px;
  margin-top: -600px;
  z-index: 20000 !important;
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

<style>
:deep(.page) {
  z-index: 2000 !important;
}

.el-pagination {
  z-index: 2000 !important;
  position: relative !important;
}
</style>
