<script>
    import BarGraph from '@/components/bar/BarGraph.vue';
export default {
  name: "material-management",
    components: {
        BarGraph
    },
}
</script>

<template>
    <bar-graph :width="'900px'" :height="'600px'"></bar-graph>
</template>

<style scoped>

</style>
