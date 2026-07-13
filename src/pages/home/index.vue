<script lang="ts" setup>
import UnitMain from "./components/unitMain.vue";
import Authority from "@/components/authority.vue";
import UnitNav from "./components/unitNav.vue";
import ChartCard from "./components/chartCard.vue";
import UnitStatusPanel from "./components/unitStatusPanel.vue";
</script>

<template>
  <n-space class="min-h-full" vertical>
    <Authority :permission="['getStatistics1,GET']">
      <UnitMain />
    </Authority>
    <UnitNav />
    <n-grid :cols="2" :x-gap="12">
      <n-gi>
        <Authority :permission="['getStatistics3,GET']">
          <ChartCard />
        </Authority>
      </n-gi>
      <n-gi>
        <Authority :permission="['getStatistics2,GET']">
          <UnitStatusPanel />
        </Authority>
      </n-gi>
    </n-grid>
  </n-space>
</template>
