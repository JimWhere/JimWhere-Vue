<script setup>
import { computed, ref } from 'vue'

import AppDropdown from '@/components/shared/form/AppDropdown.vue'
import AppPagination from '@/components/shared/form/AppPagination.vue'

/* 개인 페이지용 검색 옵션 → USER_ID 제거됨 */
const searchFieldOptions = [
  { label: '검색 조건', value: 'ALL' },
  { label: '방문 내용', value: 'MEMO' },
  { label: '방', value: 'ROOM' },
  { label: '방문 유형', value: 'TYPE' }
]

/* 선택된 검색 필드 & 검색어 */
const searchField = ref('ALL')
const searchText = ref('')

/* 더미 데이터 (API 연동 시 교체) */
const rows = ref([
  {
    id: 1,
    entryDatetime: '2025.11.28 / 16:40',
    requestDatetime: '2025.11.28 / 16:30',
    visitType: '입고',
    userId: 'user01',
    roomCode: 'A3',
    memo: '박스 3개 입고'
  },
  {
    id: 2,
    entryDatetime: '2025.11.28 / 17:10',
    requestDatetime: '2025.11.28 / 17:00',
    visitType: '출고',
    userId: 'user01',
    roomCode: 'A3',
    memo: '개인 물품 출고'
  },
  {
    id: 3,
    entryDatetime: '2025.11.29 / 09:20',
    requestDatetime: '2025.11.29 / 09:00',
    visitType: '자율',
    userId: 'user01',
    roomCode: 'B1',
    memo: '테스트 비고'
  }
])

/* 페이지네이션 */
const pageSize = 10
const currentPage = ref(1)

/* 검색 필터 */
const filteredRows = computed(() => {
  const q = searchText.value.trim().toLowerCase()

  if (!q || searchField.value === 'ALL') return rows.value

  return rows.value.filter((row) => {
    switch (searchField.value) {
      case 'MEMO':
        return row.memo?.toLowerCase().includes(q)
      case 'ROOM':
        return row.roomCode?.toLowerCase().includes(q)
      case 'TYPE':
        return row.visitType?.toLowerCase().includes(q)
      default:
        return true
    }
  })
})

/* 페이지 개수 */
const pageCount = computed(() => {
  const total = filteredRows.value.length
  return total === 0 ? 1 : Math.ceil(total / pageSize)
})

/* 페이지 아이템 */
const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredRows.value.slice(start, end)
})

/* 검색 입력 시 페이지 초기화 */
const handleSearch = () => {
  currentPage.value = 1
}

/* 페이지 이동 */
const handleChangePage = (nextPage) => {
  currentPage.value = nextPage
}
</script>

<template>
  <div class="admin-entry">
    <h2 class="section-title">내 출입 기록</h2>

    <div class="entry-card">
      <div class="entry-card__header">
        <div class="entry-card__search">
          <!-- 검색 항목 선택 -->
          <AppDropdown
              v-model="searchField"
              :options="searchFieldOptions"
          />

          <!-- 검색 입력 -->
          <el-input
              v-model="searchText"
              class="entry-search-input"
              @input="handleSearch"
          >
            <template #prefix>
              <span class="search-placeholder">검색</span>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 테이블 리스트 -->
      <div class="entry-card__table-wrapper">
        <el-table
            :data="pagedRows"
            border
            header-cell-class-name="entry-table__header"
            style="width: 100%"
        >
          <el-table-column prop="id" label="출입번호" width="100" align="center" />
          <el-table-column prop="entryDatetime" label="출입일시" min-width="180" align="center" />
          <el-table-column prop="requestDatetime" label="신청일시" min-width="180" align="center" />
          <el-table-column prop="visitType" label="방문유형" width="120" align="center" />
          <el-table-column prop="roomCode" label="방" width="120" align="center" />
          <el-table-column prop="memo" label="비고" min-width="200" />
        </el-table>
      </div>

      <div class="entry-card__pagination">
        <AppPagination
            :current="currentPage"
            :total="pageCount"
            @update:current="handleChangePage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";

/* 페이지 공통 */
.admin-entry {
  padding: 24px 32px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.section-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 카드 박스 */
.entry-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #dce9f5;
}

/* 검색바 영역 */
.entry-card__header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.entry-card__search {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 드롭다운 고정폭 */
.entry-card__search .app-dropdown {
  width: 140px;
  flex: 0 0 auto;
}

/* 검색 인풋 */
.entry-search-input {
  width: 260px;
  flex: 0 0 auto;
}

.entry-search-input .el-input__wrapper {
  width: 100%;
}

/* prefix 텍스트 */
.search-placeholder {
  font-size: 16px;
  color: var(--color-primary-500);
  padding-left: 4px;
  font-family: var(--app-font);
  font-weight: var(--app-font-weight-semibold);
  display: flex;
  align-items: center;
}

/* 테이블 */
.entry-card__table-wrapper {
  margin-top: 8px;
  overflow-x: auto;
}

.entry-table__header {
  background-color: #f7f9fc !important;
  font-weight: 600;
}

/* 페이지네이션 */
.entry-card__pagination {
  margin-top: 12px;
}
</style>
