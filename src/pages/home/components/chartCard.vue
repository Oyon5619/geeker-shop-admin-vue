<script lang="ts" setup>
import { getChartStatisticApi } from "@/api/statisticApi";
import { TIME_TYPE } from "@/constants/dateTime";
import {
  init as initEchart,
  dispose as disposeEchart,
  type EChartsOption,
  type EChartsType,
} from "echarts";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useResizeObserver } from "vue-hooks-plus";

let chartDom: Element | null;
const chart = ref<EChartsType>();
const chartRef = ref(null);
const timeType = ref<string>(TIME_TYPE.HOUR);

const TAG_OPTIONS = [
  {
    label: "近24小时",
    value: TIME_TYPE.HOUR,
  },
  {
    label: "近1周",
    value: TIME_TYPE.WEEK,
  },
  {
    label: "近1个月",
    value: TIME_TYPE.MONTH,
  },
];

// 初始化图表选项
const initChart = async (chartDom: HTMLElement) => {
  chart.value = initEchart(chartDom);

  chart.value.showLoading();
  const { data: chartData } = await getChartStatisticApi(timeType.value);

  const { x: xData = [], y: yData = [] } = chartData ?? {};
  const chartOption: EChartsOption = {
    grid: { top: 10, left: 10, right: 10, bottom: 10 },
    xAxis: { type: "category", data: xData },
    yAxis: { type: "value" },
    series: [{ data: yData, type: "bar", showBackground: true }],
  };

  chart.value.setOption(chartOption);
  chart.value.hideLoading();
};

const onSelect = (value: string) => {
  timeType.value = value;
  initChart(chartDom as HTMLElement);
};

useResizeObserver(chartRef, () => {
  if (chart.value) {
    chart.value.resize();
  }
});

onMounted(() => {
  chartDom = document.querySelector("#chart");
  if (!chartDom) {
    return;
  }

  initChart(chartDom as HTMLElement);
});

onBeforeUnmount(() => {
  if (!chartDom) {
    return;
  }

  disposeEchart(chartDom as HTMLElement);
});
</script>

<template>
  <n-card title="订单统计" class="shadow-md" segmented hoverable>
    <template #header-extra>
      <n-radio-group v-model:value="timeType" @update:value="onSelect">
        <n-radio-button
          v-for="item in TAG_OPTIONS"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </n-radio-group>
    </template>
    <template #default>
      <div id="chart" ref="chartRef" class="h-70" />
    </template>
  </n-card>
</template>
