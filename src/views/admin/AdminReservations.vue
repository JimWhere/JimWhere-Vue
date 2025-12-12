<template>
  <div class="admin-reservations">
    <!-- 상단 제목 -->
    <h2 class="section-title">예약 관리</h2>

    <!-- 테이블 박스 -->
    <div class="table-container">
      <table>
        <thead>
        <tr>
          <th>예약번호</th>
          <th>대표자명</th>
          <th>사업자등록번호</th>
          <th>대여 기간</th>
          <th>대여 공간</th>
          <th>결제 상태</th>
          <th>결제 금액</th>
        </tr>
        </thead>

        <tbody>
        <!-- 데이터 없을 때 -->
        <tr v-if="reservations.length === 0">
          <td colspan="7">예약 내역이 없습니다.</td>
        </tr>

        <!-- 데이터 있을 때 -->
        <tr
            v-for="item in reservations"
            :key="item.reservationCode"
        >
          <td>{{ item.reservationCode }}</td>
          <td>{{ item.ownerName }}</td>
          <td>{{ item.businessNumber }}</td>
          <td>
            {{ formatDate(item.startAt) }} ~
            {{ formatDate(item.endAt) }}
          </td>
          <td>{{ item.roomName ?? '-' }}</td>
          <td>{{ paymentStatusLabel(item) }}</td>
          <td>{{ formatAmount(item.paymentAmount ?? item.reservationAmount) }} 원</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination" v-if="pageCount > 0">
      <button class="btn" :disabled="page === 1" @click="prevPage">← 이전</button>

      <button
          v-for="p in pageCount"
          :key="p"
          @click="movePage(p)"
          class="page-number"
          :class="{ active: p === page }"
      >
        {{ p }}
      </button>

      <button class="btn" :disabled="page === pageCount" @click="nextPage">
        다음 →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { adminReservationAll } from '@/api/admin'

interface AdminReservationRow {
  reservationCode: number
  ownerName: string
  businessNumber: string
  startAt: string
  endAt: string
  reservationAmount: number
  roomName?: string
  paymentStatus?: string
  paymentAmount?: number
  orderId?: string | null
}

const reservations = ref<AdminReservationRow[]>([])

const page = ref(1)
const pageCount = ref(1)
const pageSize = 10

const formatDate = (value: string) => {
  if (!value) return '-'
  return dayjs(value).format('YYYY.MM.DD / HH:mm')
}

const formatAmount = (value?: number) => {
  if (!value) return '0'
  return value.toLocaleString()
}

// 결제 상태 텍스트
const paymentStatusLabel = (row: AdminReservationRow) => {
  const status = row.paymentStatus
      ? row.paymentStatus
      : row.orderId
          ? 'PAID'
          : 'PENDING'

  if (status === 'PAID') return '결제 완료'
  if (status === 'REFUNDED') return '환불 완료'
  return '결제 대기'
}

const fetchReservations = async (pageNum = 1) => {
  try {
    const res = await adminReservationAll({
      page: pageNum,
      size: pageSize,
    })

    const body = res.data.data        // ApiResponse.success(data) 구조
    console.log('admin reservations body: ', body)

    reservations.value = body.content ?? []
    page.value = body.page ?? body.pageNumber ?? 1
    pageCount.value = body.totalPages ?? 1
  } catch (e) {
    console.error('관리자 예약 목록 조회 실패', e)
  }
}

const movePage = (p: number) => {
  if (p === page.value) return
  fetchReservations(p)
}

const prevPage = () => {
  if (page.value > 1) {
    fetchReservations(page.value - 1)
  }
}

const nextPage = () => {
  if (page.value < pageCount.value) {
    fetchReservations(page.value + 1)
  }
}

onMounted(() => {
  fetchReservations(1)
})
</script>

<style scoped>
.section-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 테이블 스타일 */
.table-container {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #dce9f5;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  padding-bottom: 10px;
  border-bottom: 2px solid #e6eef7;
  color: #555;
}

tbody tr {
  text-align: center;
  height: 48px;
  border-bottom: 1px solid #eef5fc;
}

tbody tr:last-child {
  border-bottom: none;
}

/* 페이지네이션 */
.pagination {
  margin-top: 20px;
  text-align: center;
}

.page-number {
  padding: 6px 10px;
  margin: 0 3px;
  border-radius: 6px;
  background: #edf4ff;
  border: none;
  cursor: pointer;
}

.page-number.active {
  background: #2b84ff;
  color: white;
}

.btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

.btn:disabled {
  color: #bbb;
  cursor: default;
}
</style>
