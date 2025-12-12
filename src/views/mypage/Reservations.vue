<template>
  <div class="reservations">
    <!-- 타이틀 영역 (Inquiry와 동일 구조) -->
    <div class="reservations__header">
      <h2>예약내역</h2>
      <span class="reservations__desc">
        고객님의 예약 기록을 확인할 수 있습니다.
      </span>
    </div>

    <!-- 카드 + 테이블 -->
    <el-card class="reservations__card" shadow="never">
      <el-table
          :data="rows"
          v-loading="loading"
          border
          stripe
          header-cell-class-name="reservations__table-header"
          class="reservations__table"
          :empty-text="loading ? '불러오는 중...' : '예약 내역이 없습니다.'"
      >
        <el-table-column
            prop="reservationCode"
            label="예약 번호"
            width="120"
            align="center"
        />

        <el-table-column
            label="대여 기간"
            min-width="240"
            align="center"
        >
          <template #default="{ row }">
            <div class="period">
              <div>{{ formatDateTime(row.startAt) }}</div>
              <div class="period-separator">~</div>
              <div>{{ formatDateTime(row.endAt) }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
            prop="roomCode"
            label="대여 공간"
            min-width="120"
            align="center"
        >
          <template #default="{ row }">
            Room {{ row.roomCode }}
          </template>
        </el-table-column>

        <el-table-column
            label="결제 상태"
            width="120"
            align="center"
        >
          <template #default="{ row }">
            <span :class="['pay-status', 'pay-status--' + paymentStatusCode(row)]">
              {{ paymentStatusLabel(row) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
            label="결제 금액"
            width="140"
            align="center"
        >
          <template #default="{ row }">
            {{ formatAmount(row.reservationAmount) }} 원
          </template>
        </el-table-column>
      </el-table>

      <!-- 페이지네이션 -->
      <div class="reservations__pagination" v-if="totalPages > 1">
        <AppPagination
            v-model:current="page"
            :total="totalPages"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import dayjs from "dayjs"

import AppPagination from "@/components/shared/form/AppPagination.vue"
import { userReservationList } from "@/api/myPage.js"

// data
const rows = ref([])
const page = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const loading = ref(false)

// API 호출
const fetchReservations = async () => {
  loading.value = true

  try {
    const res = await userReservationList({
      page: page.value,
      size: pageSize.value
    })

    const body = res.data
    if (!body.success) return

    const data = body.data
    rows.value = data.content ?? []
    page.value = (data.page ?? 0) + 1
    totalPages.value = data.totalPages ?? 1
  } catch (error) {
    console.error("예약 내역 조회 실패", error)
  } finally {
    loading.value = false
  }
}

// helpers
const formatDateTime = (value) => {
  if (!value) return "-"
  return dayjs(value).format("YYYY.MM.DD / HH:mm")
}

const formatAmount = (value) => {
  if (!value) return "0"
  return value.toLocaleString()
}

const paymentStatusCode = (row) => {
  return row.orderId ? "DONE" : "PENDING"
}

const paymentStatusLabel = (row) => {
  return row.orderId ? "결제 완료" : "결제 대기"
}


onMounted(fetchReservations)
watch(page, fetchReservations)
</script>

<style scoped>
.reservations {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 32px;
  border-radius: 10px;
  box-sizing: border-box;
}

.reservations__header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #5ba0ff;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}

.reservations__header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.reservations__desc {
  margin-left: 12px;
  font-size: 12px;
  color: #999;
}

/* 카드 */
.reservations__card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
}

/* 테이블 */
.reservations__table {
  width: 100%;
}

.reservations__table-header {
  background: #f7fbff !important;
  color: #333;
  font-weight: 600;
  text-align: center;
}

.table-cell {
  font-size: 14px;
}

/* 기간 표시 */
.period {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.period-separator {
  font-size: 12px;
  color: #999;
}

/* 결제 상태 뱃지 */
.pay-status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.pay-status--DONE {
  background: #e3f2fd;
  color: #1976d2;
}

.pay-status--PENDING {
  background: #fff3e0;
  color: #ef6c00;
}

/* 페이지네이션 (Inquiry와 동일) */
.reservations__pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

/* 빈 데이터 중앙 정렬(선택) */
.el-table__empty-block {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-table__empty-text {
  text-align: center;
}
</style>
