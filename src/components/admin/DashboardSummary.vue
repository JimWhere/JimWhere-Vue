<template>
  <div class="summary-grid">

    <div class="card">
      <h3>총 회원 수</h3>
      <div class="value">{{ userStats.total }}명</div><br>
      <span>활성화 : {{userStats.active}}</span><br>
      <span>비활성화 : {{userStats.inactive}}</span>
    </div>

    <div class="card">
      <h3>방 사용 현황</h3>
      <p>A타입 : {{ roomStats.types.A.using }} / {{ roomStats.types.A.total }}</p>
      <p>B타입 : {{ roomStats.types.B.using }} / {{ roomStats.types.B.total }}</p>
      <p>C타입 : {{ roomStats.types.C.using }} / {{ roomStats.types.C.total }}</p>
    </div>

    <div class="card">
      <h3>예약 현황</h3>

      <p v-if="latestReservations.length === 0">최근 예약이 없습니다.</p>

      <p
          v-for="r in latestReservations"
          :key="r.reservationCode"
      >
        {{ r.roomName }} : {{ r.days }} 일
      </p>
    </div>

    <div class="card">
      <h3>문의 현황</h3>
      <p>총 문의 : {{ inquiryStats.total }}건</p>
      <p>처리 완료 : {{ inquiryStats.completed }}건</p>
      <p>미완료 : {{ inquiryStats.pending }}건</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {fetchUserStats, fetchRoomStats, fetchLatestReservations, fetchInquiryStats} from "@/api/adminHomeApi.js";

const userStats = ref({ total: 0, active: 0, inactive: 0 });
const roomStats = ref({
  total: 0,
  using: 0,
  empty: 0,
  types: {
    A: { total: 5, using: 0, empty: 5 },
    B: { total: 5, using: 0, empty: 5 },
    C: { total: 5, using: 0, empty: 5 }
  }
});


const latestReservations = ref([]); // 최신 예약 저장

const inquiryStats = ref({
  total: 0,
  completed: 0,
  pending: 0
});

onMounted(async () => {
  userStats.value = await fetchUserStats();
  roomStats.value = await fetchRoomStats();
  latestReservations.value = await fetchLatestReservations();
  inquiryStats.value = await fetchInquiryStats();
});
</script>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(126, 194, 253, 0.67);
}

.value {
  font-size: 28px;
  font-weight: bold;
}
</style>
