<script lang="ts" setup>
import { useLogin } from "@/hooks/useLogin";
import { useDialog } from "@/utils/popup";

const { logout, logouting } = useLogin();

const onLogout = () => {
  useDialog({
    type: "warning",
    content: "你确定要退出登录吗",
    onOk: logout,
  });
};
</script>

<template>
  <div class="p-3">
    后台首页
    {{ $store.state.adminInfo.username }}
    <n-button @click="onLogout" :loading="logouting">登出</n-button>
  </div>
</template>
