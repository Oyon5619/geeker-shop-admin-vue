<script lang="ts" setup>
import { HOME_PAGE_MENU_ID } from "@/constants/common";
import store from "@/store";
import { watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const onCloseTab = (key: number) => {
  store.dispatch("removeTab", key);
};

watch(
  () => store.state.activeTabKey,
  (value) => {
    const target = store.state.tabList?.find((item) => item.key === value);
    if (!target) {
      return;
    }

    const { routePath } = target;
    router.push({ path: routePath });
  },
);
</script>

<template>
  <n-tabs
    v-model:value="$store.state.activeTabKey"
    type="card"
    size="small"
    tab-style="background: white;"
    :closable="$store.getters.tabClosable"
    @close="onCloseTab"
  >
    <n-tab-pane
      v-for="item in $store.state.tabList"
      :key="item.key"
      :name="item.key"
      :tab="item.title"
      :closable="item.key !== HOME_PAGE_MENU_ID"
    />
  </n-tabs>
</template>
