<script lang="ts" setup>
import { useDataStatistic } from "@/hooks/useDataStatistic";
import { onMounted } from "vue";
import { TAG_COLOR_MAP } from "@/utils/tagColorMap";
import { CountTo } from "vue3-count-to";
import HomeUnitNav from "@/components/homeUnitNav.vue";

const { unitPanelData, isUnitMainLoading, getUnitMainStatistic } =
  useDataStatistic();

onMounted(() => {
  getUnitMainStatistic();
});
</script>

<template>
  <n-space class="min-h-full p-4" vertical>
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
              <CountTo :start-val="0" :end-val="item.value" :duration="3000" />
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
  </n-space>
</template>
