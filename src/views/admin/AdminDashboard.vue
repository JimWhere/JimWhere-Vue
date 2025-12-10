<template>
  <div class="dashboard">

    <!-- 위 카드 4개 -->
    <DashboardSummary />

    <!-- 대여 공간 현황 -->
    <SpaceStatus />

  </div>
</template>

<script setup>
import DashboardSummary from "@/components/admin/DashboardSummary.vue"
import SpaceStatus from "@/components/admin/SpaceStatus.vue"
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
</style>
