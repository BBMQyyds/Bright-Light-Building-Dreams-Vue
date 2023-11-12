<script>
import BarGraph from "@/components/graph/graph2/BarGraph.vue";
import BarGraph2 from "@/components/graph/graph2/BarGraph2.vue";
import BarGraph3 from "@/components/graph/graph2/BarGraph3.vue";
import request from "@/api";

export default {
  name: "material-management",
  components: {
    BarGraph,
    BarGraph2,
    BarGraph3
  },
  data() {
    return {
      materialLogList: [], // 在这里存储从后端获取的物资日志数据
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
      // 在这里调用后端接口获取资金日志数据，然后赋值给 fundingLogList
      request.post('/administrator/log/searchSuppliesLog', JSON.stringify({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      })).then(res => {
        this.materialLogList = res.data.items;
        this.total = res.data.counts;
      }).catch(err => {
        console.log(err);
      });
    },
    handleCurrentPageChange(page) {
      this.currentPage = page;
      this.search();
    },
  }
}
</script>

<template>
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
    <el-table
        ref="table"
        :cell-style="{'text-align': 'center'}"
        :data="materialLogList"
        :header-cell-style="{backgroundColor:'#393E46','text-align':'center'
        , 'font-size': '15px','color': 'white', 'font-weight': 'normal'}"
        class="table"
        style="margin-top: 20px;">
      <el-table-column label="类别" prop="notes"></el-table-column>
      <el-table-column label="件数" prop="useQuantity"></el-table-column>
      <el-table-column label="描述" prop="descriptions"></el-table-column>
      <el-table-column label="捐赠来源" prop="recipient"></el-table-column>
      <el-table-column label="捐赠日期" prop="useDate"></el-table-column>
    </el-table>

    <p></p>
    <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :total="total"
        class="page"
        layout="total, prev, pager, next"
        @current-change="handleCurrentPageChange">
    </el-pagination>
  </div>

</template>

<style scoped>
.graph {
  margin: 50px;
  margin-top: 40px;
}

#graph1 {
  margin-left: 50px;
  margin-top: 40px;
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
  margin-top: -620px;
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
