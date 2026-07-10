<script lang="ts" setup>
import AppHeader from "./components/appHeader.vue";
import AppMenu from "./components/appMenu.vue";
import TagList from "./components/tagList.vue";
</script>

<template>
  <n-layout class="h-full">
    <n-layout-header class="fixed z-100">
      <AppHeader />
    </n-layout-header>
    <n-layout class="pt-14 h-full" has-sider>
      <AppMenu />
      <n-layout-content>
        <TagList />
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped></style>
