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
          @click="openRoom(room)"
      >

        {{ room.roomName }}
      </div>
    </div>

  </div>


  <AppModal
      v-model:visible="modalVisible"
      title="방 상세 정보"
  >
    <h3>{{ selectedRoom?.roomName }}</h3>

    <p><b>사용자:</b> {{ selectedRoom?.userName || '-' }}</p>

    <hr />

    <h4>박스 목록</h4>
    <ul>
      <li v-for="box in boxList" :key="box.boxCode">
        {{ box.boxName }}
        <br />
        컨텐트: {{ box.boxContent || '없음' }}
        <br />
        재고: {{ box.boxCurrentCount ?? 0 }}
      </li>
    </ul>
  </AppModal>

</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchRoomList ,getRoomDetail ,getBoxesByRoom } from "@/api/adminHomeApi";
import AppModal from "@/components/shared/feedback/AppModal.vue";

const rooms = ref([]);
const modalVisible = ref(false);
const selectedRoom = ref(null);
const boxList = ref([]);

onMounted(async () => {
  rooms.value = await fetchRoomList();
});

const openRoom = async (room) => {
  if (!room.userCode) return;

  selectedRoom.value = await getRoomDetail(room.roomCode);
  boxList.value = await getBoxesByRoom(room.roomCode);

  modalVisible.value = true;
};
</script>

<style scoped>
.space-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
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
  cursor: default;
  opacity: 0.6;
}

.box.used {
  background: #ff9b9b;
  cursor: pointer;
}

</style>
