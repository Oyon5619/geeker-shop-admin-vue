<script lang="ts" setup>
import { NUMBER_ROLLING_DURATION } from "@/constants/common";
import type { StatusInfo } from "@/types/apiTypes";
import { CountTo } from "vue3-count-to";

const {
  loading,
  title,
  subTitle,
  items = [],
} = defineProps<{
  loading: boolean;
  title: string;
  subTitle: string;
  items?: StatusInfo[];
}>();
</script>

<template>
  <n-card :title="title" class="shadow-md" segmented hoverable>
    <template #header-extra>
      <n-tag type="warning">{{ subTitle }}</n-tag>
    </template>
    <template #default>
      <n-grid v-if="loading" :cols="4" :x-gap="14" class="py-2 px-1">
        <n-gi v-for="i in 4" :key="i">
          <n-flex
            justify="center"
            align="center"
            class="bg-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md duration-300"
            vertical
          >
            <n-skeleton :repeat="4" />
          </n-flex>
        </n-gi>
      </n-grid>
      <n-grid v-else :cols="items.length" :x-gap="14" class="py-2 px-1">
        <n-gi v-for="item in items" :key="item.label">
          <n-flex
            justify="center"
            align="center"
            class="bg-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md duration-300"
            vertical
          >
            <p class="text-2xl font-bold text-gray-600">
              <CountTo
                :start-val="0"
                :end-val="item.value"
                :duration="NUMBER_ROLLING_DURATION"
              />
            </p>
            <p class="text-lg text-gray-400">{{ item.label }}</p>
          </n-flex>
        </n-gi>
      </n-grid>
    </template>
  </n-card>
</template>
