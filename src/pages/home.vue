<script lang="ts" setup>
import { useDataStatistic } from "@/hooks/useDataStatistic";
import { onMounted } from "vue";
import { TAG_COLOR_MAP } from "@/utils/tagColorMap";
import { CountTo } from "vue3-count-to";
import HomeUnitNav from "@/components/homeUnitNav.vue";
import HomeChartCard from "@/components/homeChartCard.vue";
import DataStatusCard from "@/components/dataStatusCard.vue";
import { NUMBER_ROLLING_DURATION } from "@/constants/common";

const {
  timeType,
  unitPanelData,
  chartData,
  unitStatusData,
  isUnitMainLoading,
  isChartLoading,
  getUnitMainStatistic,
  getUnitStatusStatistic,
  onSelectTimeType,
} = useDataStatistic();

onMounted(() => {
  // 获取首页主要模块的统计数据
  getUnitMainStatistic();
  getUnitStatusStatistic();
});
</script>

<template>
  <n-space class="min-h-full" vertical>
    <n-grid v-if="isUnitMainLoading" :cols="4" :x-gap="12">
      <n-gi v-for="i in 4" :key="i">
        <n-card
          class="shadow"
          :segmented="{ content: true, footer: 'soft' }"
          hoverable
        >
          <template #header>
            <n-skeleton />
          </template>
          <template #default>
            <n-skeleton text :repeat="2" />
          </template>
          <template #footer>
            <n-skeleton text />
          </template>
        </n-card>
      </n-gi>
    </n-grid>
    <n-grid v-else :cols="4" :x-gap="12">
      <n-gi v-for="item in unitPanelData" :key="item.title">
        <n-card
          class="shadow-md"
          :segmented="{ content: true, footer: 'soft' }"
          hoverable
        >
          <template #header>
            <p class="font-thin">{{ item.title }}</p>
          </template>
          <template #header-extra>
            <n-tag
              :type="TAG_COLOR_MAP[item.unitColor] || 'info'"
              :bordered="false"
              >{{ item.unit }}</n-tag
            >
          </template>
          <template #default>
            <p class="text-5xl font-bold text-gray-500">
              <CountTo
                :start-val="0"
                :end-val="item.value"
                :duration="NUMBER_ROLLING_DURATION"
              />
            </p>
          </template>
          <template #footer>
            <n-flex class="font-bold text-gray-500">
              <p>{{ item.subTitle }}</p>
              <p class="ml-auto">{{ item.subValue }}</p>
            </n-flex>
          </template>
        </n-card>
      </n-gi>
    </n-grid>
    <HomeUnitNav />
    <n-grid :cols="2" :x-gap="12">
      <n-gi>
        <HomeChartCard
          v-model="timeType"
          :loading="isChartLoading"
          :chart-data="chartData"
          @select="onSelectTimeType"
        />
      </n-gi>
      <n-gi>
        <n-space vertical>
          <DataStatusCard
            title="店铺及商品提示"
            sub-title="店铺及商品提示"
            :items="unitStatusData?.goods"
          />
          <DataStatusCard
            title="交易提示"
            sub-title="需要立即处理的交易订单"
            :items="unitStatusData?.order"
          />
        </n-space>
      </n-gi>
    </n-grid>
  </n-space>
</template>
