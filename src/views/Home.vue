<script setup lang="ts">
import RoomCardList from "@/views/mainPage/RoomCardList.vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 결제 테스트용 이동 함수
const testPay = () => {
  router.push({
    path: "/payments/request",
    query: {
      roomCode: 1,
      roomTypeCode: 2,
      startAt: "2025-12-20T12:00:00",
      endAt: "2025-12-21T12:00:00",
      amount: 10000,
      roomTypeName: "S",
    },
  });
};
</script>

<template>
  <div class="home">
    <RoomCardList />

    <!-- 테스트용 버튼 -->
    <button class="test-btn" @click="testPay">
      결제 테스트 실행
    </button>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #ffffff;
}

.test-btn {
  margin: 16px auto;
  display: block;
  padding: 10px 16px;
  font-size: 14px;
  background: #4c84ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.test-btn:hover {
  background: #3a6fe0;
}
</style>