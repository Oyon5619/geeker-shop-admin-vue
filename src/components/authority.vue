<script lang="ts" setup>
import store from "@/store";

const { permission } = defineProps<{ permission: string[] }>();
const roleNames = store.state.ruleNames;
</script>

<template>
  <slot v-if="roleNames.some((role) => permission.includes(role))"></slot>
</template>
