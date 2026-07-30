<script lang="ts" setup>
import { RefreshSharp } from "@vicons/ionicons5";
import { useDebounceFn } from "vue-hooks-plus";

const { addText = "新增", refreshText = "刷新数据" } = defineProps([
  "addText",
  "refreshText",
]);
const emit = defineEmits(["add", "refresh"]);

const onAdd = () => {
  emit("add");
};

const { run: onRefresh } = useDebounceFn(
  () => {
    emit("refresh");
  },
  { wait: 300 },
);
</script>

<template>
  <n-flex>
    <n-button type="primary" size="small" @click="onAdd">{{
      addText
    }}</n-button>
    <n-button size="small" @click="onRefresh">
      <template #icon>
        <n-icon size="20" :component="RefreshSharp" />
      </template>
      <template #default>{{ refreshText }}</template>
    </n-button>
  </n-flex>
</template>
