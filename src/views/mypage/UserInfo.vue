<script setup>
import { ref } from "vue";

const user = ref({
  userId: "user01",
  phone: "010-1234-1234",
  businessNumber: "211 - 10 -11223",
  corpName: "짐짐돌돌",
  ceoName: "김돌리",
  bizType: "도소매",
});
</script>

<template>
  <div class="user-info-container">
    <!-- 내 정보 -->
    <section class="info-section">
      <h3 class="section-title">내정보</h3>

      <div class="info-row">
        <span class="label">아이디</span>
        <span class="value">{{ user.userId }}</span>
      </div>

      <div class="info-row">
        <span class="label">전화번호</span>
        <span class="value">{{ user.phone }}</span>
      </div>
    </section>

    <!-- 사업자 정보 -->
    <section class="info-section">
      <h3 class="section-title">사업자정보</h3>

      <div class="info-row">
        <span class="label">사업자번호</span>
        <span class="value">{{ user.businessNumber }}</span>
      </div>

      <div class="info-row">
        <span class="label">법인명</span>
        <span class="value">{{ user.corpName }}</span>
      </div>

      <div class="info-row">
        <span class="label">대표자</span>
        <span class="value">{{ user.ceoName }}</span>
      </div>

      <div class="info-row">
        <span class="label">업태</span>
        <span class="value">{{ user.bizType }}</span>
      </div>
    </section>

    <!-- 버튼 영역 -->
    <div class="button-area">
      <button class="btn danger">탈퇴</button>
      <button class="btn edit">수정</button>
    </div>
  </div>
</template>

<style scoped>
.user-info-container {
  width: 100%;
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  align-items: center;     /* 가로 중앙 */
  justify-content: center; /* 세로 중앙 */
}

/* 섹션 타이틀 */
.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #5ba0ff;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}

/* 정보 줄 */
.info-row {
  width: 400px; /* 추가 */
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 20px;
}

.label {
  width: 120px;
  text-align: right;
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.value {
  width: 200px;
  background: #f3f6f9;
  padding: 8px 12px;
  border-radius: 8px;
  text-align: left;
  font-size: 15px;
  color: #444;
}

/* 버튼 영역 */
.button-area {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  width: 350px;
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

/* 탈퇴 버튼 */
.btn.danger {
  background-color: #ff6b6b;
  color: white;
}

/* 수정 버튼 */
.btn.edit {
  background-color: #86c8ff;
  color: white;
}
</style>
