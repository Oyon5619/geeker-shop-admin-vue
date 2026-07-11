<script lang="ts" setup>
import AppHeader from "./components/appHeader.vue";
import AppMenu from "./components/appMenu.vue";
import TabList from "./components/tabList.vue";
</script>

<template>
  <n-layout class="h-full">
    <n-layout-header class="fixed z-100">
      <AppHeader />
    </n-layout-header>
    <n-layout class="pt-14 h-full" has-sider>
      <AppMenu />
      <n-layout-content>
        <n-flex class="h-full p-4 bg-gray-100 overflow-hidden" vertical>
          <TabList />
          <RouterView v-slot="{ Component }">
            <div class="main-container">
              <Transition name="fade">
                <KeepAlive max="10">
                  <component :is="Component"></component>
                </KeepAlive>
              </Transition>
            </div>
          </RouterView>
        </n-flex>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped>
@reference "@/styles/index.css";

.main-container {
  @apply flex-1 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-white shadow-lg bg-white;
}

/** 下面这些类选择器配合Transition组件用 */
.fade-enter-from {
  opacity: 0;
  -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0, 0);
}

.fade-enter-to {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

.fade-leave-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
  -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100%, 0, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.35s;
}

.fade-enter-active {
  transition-delay: 0.35s;
}
</style>
