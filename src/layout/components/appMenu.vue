<script lang="ts" setup>
import { useMenuManager } from "@/hooks/useMenuManager";
import { onMounted } from "vue";

const { menuOptions, defaultActive, onMenuSelect } = useMenuManager();
</script>

<template>
  <n-layout-sider
    class="shadow-lg"
    collapse-mode="width"
    :collapsed="$store.state.isCollapsed"
  >
    <n-menu
      :options="menuOptions"
      :default-value="defaultActive"
      :watch-props="['defaultValue', 'defaultExpandedKeys']"
      @update-value="onMenuSelect"
      accordion
    />
  </n-layout-sider>
</template>

<style scoped></style>
