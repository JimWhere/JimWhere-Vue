<template>
  <div class="room-detail">
    <h2>Room {{ roomId }} 상세</h2>
    <p>여기에 해당 방의 예약/상세 정보를 표시합니다.</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const roomId = route.params.roomId
</script>

<style scoped>
.room-detail{ padding:20px }
</style>
