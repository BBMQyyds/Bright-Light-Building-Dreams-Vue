<template>
    <div class="echart" id="mychart" :style="myChartStyle"></div>
</template>
<script>
    import * as echarts from "echarts";

    export default {
        data() {
            return {
                myChart: {},
                pieData: [
                    {
                        value: 27,
                        name: "教育"
                    },
                    {
                        value: 14,
                        name: "人力"
                    },
                    {
                        value: 22,
                        name: "日常"
                    },
                    {
                        value: 22,
                        name: "伙食"
                    },
                    {
                        value: 15,
                        name: "维护"
                    }
                ],
                pieName: [],
                myChartStyle: { width: "100%", height: "800px" } //图表样式
            };
        },
        mounted() {
            this.initDate(); //数据初始化
            this.initEcharts();
        },
        methods: {
            initDate() {
                for (let i = 0; i < this.pieData.length; i++) {
                    // this.xData[i] = i;
                    // this.yData =this.xData[i]*this.xData[i];
                    this.pieName[i] = this.pieData[i].name;
                }
            },
            initEcharts() {
                // 饼图
                const option = {
                    legend: {
                        // 图例
                        data: this.pieName,
                        right: "35%",
                        top: "25%",
                        orient: "vertical"
                    },
                    title: {
                        // 设置饼图标题，位置设为顶部居中
                        text: "资金支出查看",
                        top: "25%",
                        left: "center"
                    },
                    series: [
                        {
                            type: "pie",
                            label: {
                                show: true,
                                formatter: "{b} : {c} ({d}%)" // b代表名称，c代表对应值，d代表百分比
                            },
                            radius: "30%", //饼图半径
                            data: this.pieData
                        }
                    ]
                };
                console.log(this.seriesData);
                const optionFree = {
                    xAxis: {},
                    yAxis: {},
                    series: [
                        {
                            data: this.seriesData,
                            type: "line",
                            smooth: true
                        }
                    ]
                };
                this.myChart = echarts.init(document.getElementById("mychart"));
                this.myChart.setOption(option);
                //随着屏幕大小调节图表
                window.addEventListener("resize", () => {
                    this.myChart.resize();
                });
            }
        }
    };
</script>
<style scoped>

</style>
