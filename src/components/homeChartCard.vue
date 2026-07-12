<script lang="ts" setup>
import { TIME_TYPE } from "@/constants/dateTime";
import type { GetChartStatisticResp } from "@/types/apiTypes";
import {
  init as initEchart,
  dispose as disposeEchart,
  type EChartsOption,
  type EChartsType,
} from "echarts";
import { onBeforeUnmount, onUpdated, ref } from "vue";
import { useResizeObserver } from "vue-hooks-plus";

let chartDom: Element | null;
const chart = ref<EChartsType>();
const chartRef = ref(null);
const modelValue = defineModel<string>();
const { loading, chartData } = defineProps<{
  loading: boolean;
  chartData?: GetChartStatisticResp;
}>();
const emit = defineEmits(["select"]);

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

const onSelect = (value: string) => {
  emit("select", value);
};

// 初始化图表选项
const initChart = () => {
  chart.value = initEchart(chartDom as HTMLElement);

  const { x: xData = [], y: yData = [] } = chartData ?? {};
  const chartOption: EChartsOption = {
    xAxis: { type: "category", data: xData },
    yAxis: { type: "value" },
    series: [{ data: yData, type: "bar", showBackground: true }],
  };

  chart.value.setOption(chartOption);
};

useResizeObserver(chartRef, () => {
  if (chart.value) {
    chart.value.resize();
  }
});

onUpdated(() => {
  chartDom = document.querySelector("#chart");
  if (!chartDom || loading) {
    return;
  }

  initChart();
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
      <n-radio-group v-model:value="modelValue" @update:value="onSelect">
        <n-radio-button
          v-for="item in TAG_OPTIONS"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </n-radio-group>
    </template>
    <template #default>
      <div v-if="loading">
        <n-spin description="loading...">
          <div class="h-70" />
        </n-spin>
      </div>
      <div v-else id="chart" ref="chartRef" class="h-70" />
    </template>
  </n-card>
</template>
