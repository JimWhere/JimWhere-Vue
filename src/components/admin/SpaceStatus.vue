<template>
  <div class="space-section">

    <div class="header">
      <h3 class="title">대여공간 현황</h3>

      <div class="legend">
        <span class="legend-item available"></span> 사용 가능
        <span class="legend-item used"></span> 사용 중
      </div>
    </div>

    <div class="space-grid">
      <div
          v-for="room in rooms"
          :key="room.roomCode"
          class="box"
          :class="{
          used: room.userCode !== null,
          available: room.userCode === null,
        }"
      >
        {{ room.roomName }}
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchRoomList } from "@/api/adminHomeApi.js";

const rooms = ref([]);

onMounted(async () => {
  rooms.value = await fetchRoomList();
});
</script>

<style scoped>
.space-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.title {
  font-weight: bold;
}

.legend {
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: #555;
  align-items: center;
}

.legend-item {
  width: 14px;
  height: 14px;
  display: inline-block;
  border-radius: 4px;
  margin-right: 5px;
}

.available {
  background: #bcd8ff;
}

.used {
  background: #ff9b9b;
}

.space-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.box {
  border-radius: 8px;
  height: 80px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box.available {
  background: #c9dbff;
}

.box.used {
  background: #ff9b9b;
}
</style>
