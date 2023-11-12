<template>
  <div class="echarts-box">
    <div id="myEcharts" :style="{ width: this.width, height: this.height }"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {onMounted, onUnmounted} from "vue";

export default {
  name: "App",
  props: ["width", "height"],
  setup() {
    let myEcharts = echarts;

    onMounted(() => {
      initChart();
    });

    onUnmounted(() => {
      myEcharts.dispose;
    });

    function initChart() {
      let chart = myEcharts.init(document.getElementById("myEcharts"), "purple-passion");
      chart.setOption({
        title: {
          text: "物资总量变化(单位：万件)",
          left: "center",
        },
        xAxis: {
          type: "category",
          data: [
            "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
          ]
        },
        tooltip: {
          trigger: "axis"
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [
              252, 321, 390, 362, 321, 282, 263, 240, 192, 262, 312, 372
            ],
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "top",
                  formatter: "{c}"
                }
              }
            }
          }
        ]
      });
      window.onresize = function () {
        chart.resize();
      };
    }

    return {
      initChart
    };
  }
};
</script>

<style scoped>

</style>
