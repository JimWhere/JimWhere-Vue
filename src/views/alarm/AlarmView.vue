<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import AppDropdown from '@/components/shared/form/AppDropdown.vue'
import AppPagination from '@/components/shared/form/AppPagination.vue'

const router = useRouter()

/* =====================
 * 알람 타입 (BE enum 기준)
 * ===================== */
const typeOptions = [
  { label: '전체', value: 'ALL' },
  { label: '문의 답변', value: 'INQUIRY_ANSWER' },
  { label: '출입 / 재고 이벤트', value: 'ENTRY_EVENT' },
  { label: '입주일 도래', value: 'MOVE_IN_DUE' },
  { label: '만기 3일 전', value: 'EXPIRATION_D3' }
]

const typeLabelMap = {
  INQUIRY_ANSWER: '문의 답변',
  ENTRY_EVENT: '출입 / 재고',
  MOVE_IN_DUE: '입주일 도래',
  EXPIRATION_D3: '만기 3일 전'
}

/* =====================
 * 상태
 * ===================== */
const selectedType = ref('ALL')
const showUnreadOnly = ref(false)

/* =====================
 * 더미 데이터
 * ===================== */
const alarms = ref([
  {
    id: 1,
    type: 'INQUIRY_ANSWER',
    title: '문의하신 내용에 답변이 등록되었습니다.',
    message: '보관함 이용 관련 문의에 대한 답변이 등록되었습니다.',
    createdAt: '2025.12.13 10:20',
    isRead: 'N'
  },
  {
    id: 2,
    type: 'ENTRY_EVENT',
    title: '출입 이벤트가 발생했습니다.',
    message: '출입 ID 42번에 대한 입고 처리가 완료되었습니다.',
    createdAt: '2025.12.13 09:45',
    isRead: 'N'
  },
  {
    id: 3,
    type: 'MOVE_IN_DUE',
    title: '입주일이 도래했습니다.',
    message: '오늘은 예약하신 보관함 입주일입니다.',
    createdAt: '2025.12.12 08:00',
    isRead: 'Y'
  },
  {
    id: 4,
    type: 'EXPIRATION_D3',
    title: '보관 만기 3일 전입니다.',
    message: '보관 기간 만료까지 3일 남았습니다. 연장 여부를 확인해주세요.',
    createdAt: '2025.12.11 14:10',
    isRead: 'N'
  }
])

/* =====================
 * pagination
 * ===================== */
const pageSize = 10
const currentPage = ref(1)

const filteredAlarms = computed(() => {
  let list = alarms.value

  if (selectedType.value !== 'ALL') {
    list = list.filter(a => a.type === selectedType.value)
  }

  if (showUnreadOnly.value) {
    list = list.filter(a => a.isRead === 'N')
  }

  return list
})

const pageCount = computed(() =>
    Math.max(1, Math.ceil(filteredAlarms.value.length / pageSize))
)

const pagedAlarms = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredAlarms.value.slice(start, start + pageSize)
})

/* =====================
 * UX용 더미 액션
 * ===================== */
function markRead(alarmId) {
  const target = alarms.value.find(a => a.id === alarmId)
  if (target) target.isRead = 'Y'
}

function deleteOne(alarmId) {
  alarms.value = alarms.value.filter(a => a.id !== alarmId)
  if (currentPage.value > pageCount.value) currentPage.value = pageCount.value
}

function markReadAll() {
  alarms.value.forEach(a => (a.isRead = 'Y'))
}

function deleteAll() {
  alarms.value = []
  currentPage.value = 1
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="alarm-page">
    <div class="page-top">
      <h2 class="section-title">알림</h2>

      <!-- 오른쪽 위: 이전으로 -->
      <button class="btn ghost" @click="goBack">이전으로</button>
    </div>

    <div class="alarm-card">
      <!-- 상단 필터/버튼 라인 -->
      <div class="alarm-toolbar">
        <!-- 왼쪽: 미확인만 (한 줄) -->
        <label class="unread-line">
          <input type="checkbox" v-model="showUnreadOnly" />
          미확인만
        </label>

        <!-- 오른쪽: 타입 드롭다운 + 전체 읽음/삭제 -->
        <div class="right-tools">
          <AppDropdown v-model="selectedType" :options="typeOptions" />

          <button class="btn" @click="markReadAll">전체 읽음</button>
          <button class="btn danger" @click="deleteAll">전체 삭제</button>
        </div>
      </div>

      <!-- 테이블 -->
      <el-table
          :data="pagedAlarms"
          border
          header-cell-class-name="alarm-table__header"
          style="width: 100%"
      >
        <el-table-column label="상태" width="90" align="center">
          <template #default="{ row }">
            <span class="pill" :class="row.isRead === 'Y' ? 'read' : 'unread'">
              {{ row.isRead === 'Y' ? '확인' : '미확인' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="종류" width="160" align="center">
          <template #default="{ row }">
            {{ typeLabelMap[row.type] }}
          </template>
        </el-table-column>

        <el-table-column label="알림 내용" min-width="420">
          <template #default="{ row }">
            <div class="alarm-main">
              <div class="title">{{ row.title }}</div>
              <div class="message">{{ row.message }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="시간" width="180" align="center" />

        <!-- 각 줄: 읽음/삭제 -->
        <el-table-column label="동작" width="190" align="center">
          <template #default="{ row }">
            <div class="row-actions">
              <button
                  class="btn ghost small"
                  :disabled="row.isRead === 'Y'"
                  @click="markRead(row.id)"
              >
                읽음
              </button>

              <button
                  class="btn danger ghost small"
                  @click="deleteOne(row.id)"
              >
                삭제
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="alarm-footer">
        <AppPagination
            :current="currentPage"
            :total="pageCount"
            @update:current="v => currentPage = v"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.alarm-page {
  padding: 24px 32px;
  box-sizing: border-box;
}

.page-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.alarm-card {
  background: #fff;
  border: 1px solid #dce9f5;
  border-radius: 10px;
  padding: 16px;
}

.alarm-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.unread-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  user-select: none;
}

.right-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 버튼 */
.btn {
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #dce9f5;
  background: #f7fbff;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}

.btn.ghost {
  background: #fff;
}

.btn.danger {
  border-color: rgba(239, 68, 68, 0.25);
}

.btn.danger:not(.ghost) {
  background: rgba(239, 68, 68, 0.08);
}

.btn.danger.ghost {
  background: #fff;
}

.btn.small {
  height: 30px;
  padding: 0 10px;
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 상태 pill */
.pill {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.pill.unread {
  background: rgba(91,184,230,0.15);
  color: #2c78a4;
  font-weight: 700;
}

.pill.read {
  background: #f2f4f8;
  color: #6b7280;
}

/* 알림 내용 */
.alarm-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-weight: 600;
  font-size: 14px;
}

.message {
  font-size: 13px;
  color: #6b7280;
}

/* row actions */
.row-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* table header */
.alarm-table__header {
  background-color: #f7f9fc !important;
  font-weight: 600;
}

.alarm-footer {
  margin-top: 12px;
}
</style>