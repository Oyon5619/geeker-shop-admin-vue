<template>
  <n-message-provider>
    <n-dialog-provider>
      <RouterView />
    </n-dialog-provider>
  </n-message-provider>
</template>

<style>
#nprogress .bar {
  background: #f4f4f4 !important;
  height: 5px !important;
}
</style>
