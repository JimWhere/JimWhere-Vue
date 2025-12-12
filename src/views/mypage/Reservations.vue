<template>
  <div class="mypage-reservations">
    <!-- 타이틀 -->
    <div class="header-row">
      <AppText>예약 내역</AppText>
    </div>

    <!-- 테이블 -->
    <el-table
        :data="rows"
        border
        stripe
        class="reservation-table"
        header-cell-class-name="table-header-cell"
        cell-class-name="table-cell"
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
          align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.reservationAmount) }} 원
        </template>
      </el-table-column>
    </el-table>

    <!-- 페이지네이션 -->
    <div class="pagination-row" v-if="totalPages > 1">
      <AppPagination
          v-model:current="page"
          :total="totalPages"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'

import AppText from '@/components/shared/basic/AppText.vue'
import AppPagination from '@/components/shared/form/AppPagination.vue'
import { userReservationList } from '@/api/myPage.js'

interface UserReservationRow {
  reservationCode: number
  roomCode: number
  startAt: string
  endAt: string
  reservationAmount: number
  orderId: string | null
  createdAt: string
}

const rows = ref<UserReservationRow[]>([])
const page = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const loading = ref(false)

// ✅ 공통 API 모듈 사용
const fetchReservations = async () => {
  loading.value = true
  try {
    const res = await userReservationList({
      page: page.value,
      size: pageSize.value,
    })

    const body = res.data
    if (!body.success) return

    const data = body.data
    rows.value = data.content ?? []
    page.value = (data.page ?? 0) + 1
    totalPages.value = data.totalPages ?? 1
  } catch (e) {
    console.error('예약 내역 조회 실패', e)
  } finally {
    loading.value = false
  }
}

const formatDateTime = (value: string) => {
  if (!value) return '-'
  return dayjs(value).format('YYYY.MM.DD / HH:mm')
}

const formatAmount = (value: number) => {
  if (!value) return '0'
  return value.toLocaleString()
}

// orderId 존재 여부로 결제 상태 표시
const paymentStatusCode = (row: UserReservationRow) => {
  return row.orderId ? 'DONE' : 'PENDING'
}
const paymentStatusLabel = (row: UserReservationRow) => {
  return row.orderId ? '결제 완료' : '결제 대기'
}

onMounted(fetchReservations)
watch(page, fetchReservations)
</script>

<style scoped>
.mypage-reservations {
  padding: 20px 10px;
  height: 100%;
  box-sizing: border-box;
}

.header-row {
  margin-bottom: 16px;
}

.reservation-table {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

/* 헤더 스타일 */
.table-header-cell {
  background: #f7fbff !important;
  color: #333;
  font-weight: 600;
  text-align: center;
}

/* 셀 공통 */
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


.pay-status {
  display: inline-block;
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

.pagination-row {
  margin-top: 16px;
}
</style>
