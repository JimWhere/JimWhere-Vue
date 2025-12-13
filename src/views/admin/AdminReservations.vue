<template>
  <div class="reservations">
    <!-- 타이틀 영역 -->
    <div class="reservations__header">
      <h2>예약 관리</h2>
      <span class="reservations__desc">
        전체 예약 내역을 조회할 수 있습니다.
      </span>
    </div>

    <!-- 카드 + 테이블 -->
    <el-card class="reservations__card" shadow="never">
      <div class="reservations__toolbar">
        <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="~"
            start-placeholder="시작일"
            end-placeholder="종료일"
            format="YYYY.MM.DD"
            value-format="YYYY-MM-DD"
            size="small"
            style="margin-right: 8px"
        />

        <el-select
            v-model="searchType"
            size="small"
            style="width: 120px; margin-right: 8px"
        >
          <el-option label="대표자명" value="ownerName" />
          <el-option label="사업자번호" value="businessNumber" />
        </el-select>

        <el-input
            v-model="keyword"
            class="search-input"
            size="small"
            placeholder="검색어 입력"
            style="width: 200px; margin-right: 8px"
        />

        <el-button type="primary" size="small" @click="handleSearch">
          검색
        </el-button>
        <el-button size="small" @click="handleReset">
          초기화
        </el-button>
      </div>

      <el-table
          :data="filteredRows"
          v-loading="loading"
          border
          stripe
          class="reservations__table"
          header-cell-class-name="reservations__table-header"
          :empty-text="loading ? '불러오는 중...' : '예약 내역이 없습니다.'"
      >

        <el-table-column
            prop="reservationCode"
            label="예약 번호"
            width="120"
            align="center"
        />

        <el-table-column
            prop="ownerName"
            label="대표자명"
            width="140"
            align="center"
        />

        <el-table-column
            prop="businessNumber"
            label="사업자등록번호"
            width="160"
            align="center"
        />

        <el-table-column label="대여 기간" min-width="240" align="center">
          <template #default="{ row }">
            <div class="period">
              <div>{{ formatDate(row.startAt) }}</div>
              <div class="period-separator">~</div>
              <div>{{ formatDate(row.endAt) }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
            prop="roomName"
            label="대여 공간"
            min-width="120"
            align="center"
        >
          <template #default="{ row }">
            {{ row.roomName || '-' }}
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
            {{ formatAmount(row.paymentAmount ?? row.reservationAmount) }} 원
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
import { ref, computed, onMounted, watch } from "vue"
import dayjs from "dayjs"
import AppPagination from "@/components/shared/form/AppPagination.vue"
import { adminReservationAll } from "@/api/admin"

// data
const rows = ref([])
const page = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const loading = ref(false)

// 검색 관련 상태
const keyword = ref("")
const searchType = ref("ownerName") // ownerName | businessNumber
const dateRange = ref([])           // [startDate, endDate]

// 화면에 실제로 보여줄 필터링된 rows
const filteredRows = computed(() => {
  let list = rows.value ?? []

  // 키워드 필터
  if (keyword.value && searchType.value) {
    const key = keyword.value.trim()
    if (key) {
      if (searchType.value === "ownerName") {
        list = list.filter(r => r.ownerName?.includes(key))
      } else if (searchType.value === "businessNumber") {
        list = list.filter(r => r.businessNumber?.includes(key))
      }
    }
  }

  // 기간 필터 (dateRange: ["YYYY-MM-DD", "YYYY-MM-DD"])
  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    list = list.filter(r => {
      if (!r.startAt || !r.endAt) return false
      const startDate = dayjs(r.startAt).format("YYYY-MM-DD")
      const endDate = dayjs(r.endAt).format("YYYY-MM-DD")
      // [선택한 기간]과 예약 기간이 하나라도 겹치면 포함
      return !(end < startDate || endDate < start)
    })
  }

  return list
})

// API 호출
const fetchReservations = async () => {
  loading.value = true
  try {
    const res = await adminReservationAll({
      page: page.value,
      size: pageSize.value
      // 👉 백엔드는 아직 검색 안 쓰니까 page/size만 보냄
    })
    const body = res.data.data

    rows.value = body.content ?? []
    page.value = (body.page ?? 0) + 1
    totalPages.value = body.totalPages ?? 1
  } catch (e) {
    console.error("관리자 예약 목록 조회 실패", e)
  } finally {
    loading.value = false
  }
}

// helpers
const formatDate = (value) => {
  if (!value) return "-"
  return dayjs(value).format("YYYY.MM.DD / HH:mm")
}

const formatAmount = (value) => {
  if (!value) return "0"
  return value.toLocaleString()
}

const paymentStatusCode = (row) => {
  if (row.paymentStatus === "REFUNDED") return "REFUNDED"
  if (row.paymentStatus === "PAID" || row.orderId) return "DONE"
  return "PENDING"
}

const paymentStatusLabel = (row) => {
  if (paymentStatusCode(row) === "DONE") return "결제 완료"
  if (paymentStatusCode(row) === "REFUNDED") return "환불 완료"
  return "결제 대기"
}

const handleSearch = () => {
  page.value = 1
}

const handleReset = () => {
  keyword.value = ""
  searchType.value = "ownerName"
  dateRange.value = []
  page.value = 1
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

/* 제목 영역 */
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

.reservations__toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 12px;
}

.reservations__table {
  width: 100%;
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

/* 결제 상태 */
.pay-status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

/* 페이지네이션 */
.reservations__pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.reservations__toolbar .search-input :deep(.el-input__wrapper) {
  box-shadow: none !important;
}

</style>
