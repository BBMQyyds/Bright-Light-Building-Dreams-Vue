<script>
import BarGraph from "@/components/bar/BarGraph.vue";
import BarGraph2 from "@/components/bar/BarGraph2.vue";
import BarGraph3 from "@/components/bar/BarGraph3.vue";
import BarGraph4 from "@/components/bar/BarGraph4.vue";
export default {
  name: "fund-management",
    components: {
        BarGraph,
        BarGraph2,
        BarGraph3,
        BarGraph4
    },
}
</script>

<template>
    <div class="graph"></div>
    <div id="graph1">
        <BarGraph :width="'840px'" :height="'460px'"></BarGraph>
    </div>
    <div id="graph2">
        <BarGraph2 :width="'820px'" :height="'360px'"></BarGraph2>
    </div>
    <div id="graph3">
        <BarGraph3></BarGraph3>
    </div>
    <div id="graph4">
    </div>

</template>

<style scoped>
    .graph{
    }
    #graph1{
        position: absolute;
    }
    #graph2{
        position: absolute;
        margin-left: 50%;
        margin-top: 2%;
    }
    #graph3{
        margin-left: -60%;
        margin-top: 15%;
    }
    #graph4{
        z-index: 9999 !important;
        position: absolute;
    }
</style>
