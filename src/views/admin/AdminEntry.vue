<script setup>
import { computed, ref } from 'vue'

import AppDropdown from '@/components/shared/form/AppDropdown.vue'
import AppPagination from '@/components/shared/form/AppPagination.vue'

/* 검색 필드 드롭다운 옵션 */
const searchFieldOptions = [
  { label: '전체', value: 'ALL' },
  { label: '방문자 ID', value: 'USER_ID' },
  { label: '방문 내용', value: 'MEMO' },
  { label: '방', value: 'ROOM' },
  { label: '방문 유형', value: 'TYPE' }
]

const searchField = ref('ALL')
const searchText = ref('')

/* 더미 데이터 – 나중에 API 연동 시 교체 */
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
    userId: 'user02',
    roomCode: 'B1',
    memo: '개인 물품 출고'
  },
  {
    id: 3,
    entryDatetime: '2025.11.29 / 09:20',
    requestDatetime: '2025.11.29 / 09:00',
    visitType: '자율',
    userId: 'userID',
    roomCode: 'A3',
    memo: '테스트 비고'
  }
])

/* 페이지네이션 */
const pageSize = 10
const currentPage = ref(1)

/* 검색 필터링 */
const filteredRows = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  if (!q || searchField.value === 'ALL') return rows.value

  return rows.value.filter((row) => {
    switch (searchField.value) {
      case 'USER_ID':
        return row.userId?.toLowerCase().includes(q)
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

/* 페이지 계산 */
const pageCount = computed(() => {
  const total = filteredRows.value.length
  return total === 0 ? 1 : Math.ceil(total / pageSize)
})

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredRows.value.slice(start, end)
})

/* 검색 입력 시 1페이지로 이동 */
const handleSearch = () => {
  currentPage.value = 1
}

/* 페이지 변경 */
const handleChangePage = (nextPage) => {
  currentPage.value = nextPage
}
</script>

<template>
  <div class="admin-entry">
    <h2 class="section-title">출입 관리</h2>

    <div class="entry-card">
      <div class="entry-card__header">
        <div class="entry-card__search">
          <!-- 검색 타입 드롭다운 -->
          <AppDropdown
              v-model="searchField"
              :options="searchFieldOptions"
          />

          <!-- 검색 인풋 -->
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

      <!-- 테이블 -->
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
          <el-table-column prop="userId" label="유저 ID" width="140" align="center" />
          <el-table-column prop="roomCode" label="방" width="80" align="center" />
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

/* 헤더 */
.entry-card__header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

/* 🔥 검색 영역: 너비를 퍼센트 말고 자동 + 오른쪽 붙이기 */
.entry-card__search {
  margin-left: auto;              /* 오른쪽으로 밀기 */
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 🔥 드롭다운은 고정폭 */
.entry-card__search .app-dropdown {
  width: 140px;                   /* 원하면 120~160 사이로 조절 */
  flex: 0 0 auto;
}

/* 🔥 검색 인풋도 고정폭 */
.entry-search-input {
  width: 260px;                   /* 원하면 220~320 사이로 조절 */
  flex: 0 0 auto;
}

/* el-input wrapper가 100% 채우도록 */
.entry-search-input .el-input__wrapper {
  width: 100%;
}

/* prefix ‘검색’ 텍스트 — 폰트 크기 조정 */
.search-placeholder {
  font-size: 16px;                 /* 🔥 기존 32px → 16px */
  color: var(--color-primary-500);
  padding-left: 4px;               /* 🔥 좌측 패딩도 조금 줄임 */
  font-family: var(--app-font);
  font-weight: var(--app-font-weight-semibold);
  display: flex;
  align-items: center;             /* 🔥 수직정렬 자연스럽게 */
}

/* 테이블 */
.entry-card__table-wrapper {
  margin-top: 8px;
}

.entry-table__header {
  background-color: #f7f9fc !important;
  font-weight: 600;
}

/* 페이지네이션 */
.entry-card__pagination {
  margin-top: 12px;
}

/* 페이지 전체에서는 가로 스크롤 안 나게 */
.admin-entry {
  padding: 24px 32px;
  box-sizing: border-box;
  overflow-x: hidden;        /* 🔥 추가 */
}

/* 테이블이 살짝 넘치더라도 카드 안에서만 가로 스크롤 */
.entry-card__table-wrapper {
  margin-top: 8px;
  overflow-x: auto;          /* 🔥 추가 */
}
</style>