<template>
  <div id="myChart" :style="{ width: this.width, height: this.height }"></div>
</template>

<script>
import {defineComponent, onMounted, reactive, toRefs} from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'Histogram',
  props: ["width", "height"],
  setup() {
    const state = reactive({
      option: {
        grid: {
          top: '4%',
          left: '2%',
          right: '4%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: ["食品型物资", "扶贫型资金", "生活型物资"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '学校',
            type: 'bar',
            barWidth: '40%',
            data: [260, 480, 360],
          },
        ],
      },
    })
    const initeCharts = () => {
      let myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption(state.option)
    }

    onMounted(() => {
      initeCharts()
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style scoped>

</style>
