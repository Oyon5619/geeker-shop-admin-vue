<script lang="ts" setup>
import store from "@/store";
import type { MenuItem } from "@/types/menuItemn";
import { useRoute } from "vue-router";

const route = useRoute();

const onMenuSelect = (key: number, { label: title, routePath }: MenuItem) => {
  store.dispatch("addTab", { key, title, routePath });
};
</script>

<template>
  <n-layout-sider
    class="shadow-lg"
    collapse-mode="width"
    width="285"
    :collapsed="$store.state.isCollapsed"
  >
    <n-menu
      :default-value="$store.getters.defaultActive?.(route.path)"
      :options="$store.getters.menuOptions"
      :watch-props="['defaultValue', 'defaultExpandedKeys']"
      @update-value="onMenuSelect"
      accordion
    />
  </n-layout-sider>
</template>

<style scoped></style>
