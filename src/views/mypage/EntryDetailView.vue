<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import AppButton from '@/components/shared/basic/AppButton.vue'

const router = useRouter()
const route = useRoute()

/* 라우트에서 출입 ID 가져오는 예시 (실제 로직에 맞게 수정 가능) */
const entryIdFromRoute = route.params.entryId ?? 1

/* 더미 상세 데이터 – 나중에 API 연동 시 교체 */
const entry = ref({
  id: entryIdFromRoute,
  entryDatetime: '2025.11.28 / 16:40',
  /* 방문 예정일: 년월일만 */
  plannedDate: '2025.11.28',
  requestDatetime: '2025.11.28 / 16:30',
  visitType: '입고',
  roomCode: 'A3',
  userName: '홍길동',
  userId: 'user01',
  memo: '박스 3개 입고했습니다. 파손 여부 확인 완료.',
  qrImageUrl: ''
})

/* 재고 변동 확인 버튼 */
const goToStockHistory = () => {
  router.push({
    name: 'StockHistory', // 실제 라우트 이름으로 교체
    query: {
      entryId: String(entry.value.id)
    }
  })
}

/* 이전으로 버튼 */
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="entry-detail-page">
    <h2 class="section-title">출입 상세</h2>

    <div class="entry-detail-card">
      <!-- 상단: 출입 ID + 유저 정보 + 재고변동 버튼 -->
      <header class="entry-detail-header">
        <div>
          <div class="entry-detail-id">
            출입 ID {{ entry.id }}
          </div>
          <div class="entry-detail-meta">
            <span class="entry-detail-user">
              {{ entry.userName }} ({{ entry.userId }})
            </span>
          </div>
        </div>

        <AppButton type="primary" @click="goToStockHistory">
          재고 변동 확인하기
        </AppButton>
      </header>

      <!-- 본문: 좌/우 영역 -->
      <section class="entry-detail-body">
        <!-- 좌측: 텍스트 정보 -->
        <div class="entry-detail-info">
          <div class="info-row">
            <span class="info-label">출입일시</span>
            <span class="info-value">{{ entry.entryDatetime }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">방문 예정일</span>
            <span class="info-value">{{ entry.plannedDate }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">신청일시</span>
            <span class="info-value">{{ entry.requestDatetime }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">방문유형</span>
            <span class="info-value">{{ entry.visitType }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">방</span>
            <span class="info-value">{{ entry.roomCode }}</span>
          </div>
        </div>

        <!-- 우측: QR 이미지 영역 -->
        <div class="entry-detail-qr">
          <p class="qr-title">출입용 QR</p>

          <div v-if="entry.qrImageUrl" class="qr-image-wrapper">
            <img :src="entry.qrImageUrl" alt="출입용 QR" class="qr-image" />
          </div>
          <div v-else class="qr-placeholder">
            <span>QR 코드 준비중</span>
          </div>

          <p class="qr-help-text">
            QR 코드를 리더기에 스캔하여 출입을 승인합니다.
          </p>
        </div>
      </section>

      <!-- 비고 / 메모 -->
      <section class="entry-detail-memo">
        <h3 class="memo-title">비고</h3>
        <p class="memo-content">
          {{ entry.memo || '입력된 비고 내용이 없습니다.' }}
        </p>
      </section>

      <!-- 하단 오른쪽: 이전으로 -->
      <footer class="entry-detail-footer">
        <AppButton type="ghost" @click="goBack">
          이전으로
        </AppButton>
      </footer>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";

.entry-detail-page {
  padding: 24px 32px;
  box-sizing: border-box;
}

.section-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 메인 카드 */
.entry-detail-card {
  background: #ffffff;
  padding: 22px 24px;
  border-radius: 10px;
  border: 1px solid #dce9f5;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* 헤더 */
.entry-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.entry-detail-id {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.entry-detail-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.entry-detail-user {
  color: #555;
}

/* 본문 레이아웃 */
.entry-detail-body {
  display: flex;
  gap: 24px;
}

/* 좌측 정보 */
.entry-detail-info {
  flex: 1 1 55%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-label {
  width: 90px;
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
}

/* 우측 QR 영역 */
.entry-detail-qr {
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.qr-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.qr-image-wrapper {
  padding: 10px;
  border-radius: 12px;
  border: 1px dashed #d4d4d8;
  background: #fafafa;
}

.qr-image {
  display: block;
  width: 140px;
  height: 140px;
  object-fit: contain;
}

/* QR 플레이스홀더 */
.qr-placeholder {
  width: 140px;
  height: 140px;
  border-radius: 12px;
  border: 1px dashed #d4d4d8;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 13px;
}

.qr-help-text {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

/* 비고 */
.entry-detail-memo {
  border-top: 1px solid #edf2f7;
  padding-top: 12px;
}

.memo-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 6px;
}

.memo-content {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* 하단 푸터: 이전으로 버튼 오른쪽 정렬 */
.entry-detail-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}
</style>

