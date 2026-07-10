<script lang="ts">
export default {
  methods: {
    backToHome() {
      this.$router.push("/");
    },
    removeFromTab() {
      const { fullPath } = this.$route;
      const { dispatch } = this.$store;

      dispatch("removeTabByRoutePath", fullPath);
    },
  },
  created() {
    this.removeFromTab();
  },
};
</script>

<template>
  <n-result
    class="p-10"
    status="404"
    title="404 页面未找到"
    description="生活总归带点荒谬"
  >
    <template #footer>
      <n-button type="primary" @click="backToHome">回到首页</n-button>
    </template>
  </n-result>
</template>

<style scoped></style>
