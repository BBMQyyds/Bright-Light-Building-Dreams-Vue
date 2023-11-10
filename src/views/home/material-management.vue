<script>
import BarGraph from '@/components/graph/BarGraph.vue';

export default {
  name: "material-management",
  components: {
    BarGraph
  },
}
</script>

<template>
  <div class="main">
    <bar-graph :height="'600px'" :width="'900px'"></bar-graph>
  </div>
</template>

<style scoped>
.main {
  margin: 40px;
}
</style>
