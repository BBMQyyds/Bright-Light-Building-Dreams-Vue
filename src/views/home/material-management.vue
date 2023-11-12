<script>
    import BarGraph from "@/components/graph/graph2/BarGraph.vue";
    import BarGraph2 from "@/components/graph/graph2/BarGraph2.vue";
    import BarGraph3 from "@/components/graph/graph2/BarGraph3.vue";

    export default {
        name: "material-management",
        components: {
            BarGraph,
            BarGraph2,
            BarGraph3
        },
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

</style>
