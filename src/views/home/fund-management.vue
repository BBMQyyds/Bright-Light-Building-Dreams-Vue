<script>
import BarGraph from "@/components/graph/BarGraph.vue";
import BarGraph2 from "@/components/graph/BarGraph2.vue";
import BarGraph3 from "@/components/graph/BarGraph3.vue";
import BarGraph4 from "@/components/graph/BarGraph4.vue";

export default {
  name: "fund-management",
  components: {
    BarGraph,
    BarGraph2,
    BarGraph3,
    BarGraph4
  },
    data() {
        return {
            fundingLogList: [] // 在这里存储从后端获取的资金日志数据
        };
    },
    created() {
        // 在这里调用后端接口获取资金日志数据，然后赋值给 fundingLogList
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
        <el-table id="data-table" :data="fundingLogList" style="width: 100%">
            <el-table-column prop="change_amonut" label="金额"></el-table-column>
            <el-table-column prop="descriptions" label="描述"></el-table-column>
            <el-table-column prop="organization_id" label="捐赠来源"></el-table-column>
            <el-table-column prop="create_date" label="捐赠日期"></el-table-column>
        </el-table>
    </div>
</template>

<style scoped>
.graph {
  margin: 50px;
}

#graph1 {
  margin-left: 50px;
}

#graph2 {
  margin-top: 50px;
}

#graph3{
    margin-left: -50%;
    margin-top:-12%;
}

#table{
    width: 700px;
    margin-left: 55%;
    margin-top: -35%;
}

#data-table{
    height: 300px;
}

</style>
