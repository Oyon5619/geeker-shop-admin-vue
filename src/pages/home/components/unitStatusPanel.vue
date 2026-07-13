<script lang="ts" setup>
import DataStatusCard from "./dataStatusCard.vue";
import { useDataStatistic } from "@/hooks/useDataStatistic";
import { onMounted } from "vue";

const { isUnitStatusLoading, unitStatusData, getUnitStatusStatistic } =
  useDataStatistic();

onMounted(() => {
  getUnitStatusStatistic();
});
</script>

<template>
  <n-space vertical>
    <DataStatusCard
      title="店铺及商品提示"
      sub-title="店铺及商品提示"
      :loading="isUnitStatusLoading"
      :items="unitStatusData?.goods"
    />
    <DataStatusCard
      title="交易提示"
      sub-title="需要立即处理的交易订单"
      :loading="isUnitStatusLoading"
      :items="unitStatusData?.order"
    />
  </n-space>
</template>
