<script lang="ts" setup>
import AppHeader from "./components/appHeader.vue";
import AppMenu from "./components/appMenu.vue";
import TagList from "./components/tagList.vue";
</script>

<template>
  <n-layout>
    <n-layout-header>
      <AppHeader />
    </n-layout-header>
    <n-layout has-sider>
      <n-layout-sider>
        <AppMenu />
      </n-layout-sider>
      <n-layout-content>
        <TagList />
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped></style>
