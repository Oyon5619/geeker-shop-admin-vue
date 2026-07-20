<template>
  <n-modal-provider>
    <n-message-provider>
      <n-dialog-provider>
        <RouterView />
      </n-dialog-provider>
    </n-message-provider>
  </n-modal-provider>
</template>

<style>
#nprogress .bar {
  background: #f4f4f4 !important;
  height: 5px !important;
}

::-webkit-scrollbar {
  width: 4px;
  height: 6px;
}
::-webkit-scrollbar-corner {
  display: block;
}
::-webkit-scrollbar-thumb,
::-webkit-scrollbar-track {
  border-left-color: transparent;
  border-right-color: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 2rem;
  background-color: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
