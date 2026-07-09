<script lang="ts" setup>
import { useMenuManager } from "@/hooks/useMenuManager";
import { onMounted } from "vue";

const { menuOptions, initMenuOptions, onMenuSelect } = useMenuManager();

onMounted(() => {
  initMenuOptions();
});
</script>

<template>
  <n-layout-sider
    class="shadow-md"
    collapse-mode="width"
    :collapse-width="64"
    :width="300"
    show-trigger
    bordered
  >
    <n-menu :options="menuOptions" @update:value="onMenuSelect" />
  </n-layout-sider>
</template>

<style scoped></style>
