<script lang="ts" setup>
interface SimplePaginationProps {
  count?: number;
  perSize?: number;
  total?: number;
  // https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/justify-content
  justify?: string;
  // https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/align-items
  align?: string;
}

const page = defineModel<number>("page");
const {
  count,
  perSize,
  total,
  justify = "center",
  align = "center",
} = defineProps<SimplePaginationProps>();
const emit = defineEmits(["pagination"]);

const onUpdatePage = (page: number) => {
  emit("pagination", page);
};
</script>

<template>
  <n-flex :justify="justify" :align="align">
    <n-pagination
      v-model:page="page"
      :page-count="count"
      :page-size="perSize"
      @update:page="onUpdatePage"
      simple
    />
    <p>共有 {{ total }} 条数据</p>
  </n-flex>
</template>
