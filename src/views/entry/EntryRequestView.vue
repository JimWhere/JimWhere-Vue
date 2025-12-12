<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import AppInput from '@/components/shared/basic/AppInput.vue'
import AppDropdown from '@/components/shared/form/AppDropdown.vue'
import AppButton from '@/components/shared/basic/AppButton.vue'

const router = useRouter()

const movementTypeOptions = [
  { label: '입고', value: 'IN' },
  { label: '출고', value: 'OUT' }
]

/* 상단 공통 값들 */
const form = ref({
  entryType: '',    /* 출입 유형 */
  roomId: '',       /* 방 선택 */
  memo: '',         /* 비고 */
  entryDate: new Date()  /* 달력에서 선택한 날짜 */
})

/* 단일 물품 입력 폼 */
const itemForm = ref({
  itemName: '',
  boxId: '',
  stockDelta: '',   /* 양수만 */
  movementType: 'IN'  /* 입고/출고 구분 기본값: IN(입고) */
})

/* 추가된 물품 목록 */
const items = ref([])

/* 드롭다운 옵션들 */
const entryTypeOptions = [
  { label: '자율', value: 'FREE' },
  { label: '입출고', value: 'IN_OUT' },
  { label: '기타', value: 'ETC' }
]

const roomOptions = []          /* TODO: 방 목록 API 연동 예정 */
const boxOptions = []           /* TODO: 박스 목록 API 연동 예정 */

/* 재고 조정: 숫자만 남기기 */
const handleItemStockInput = (value) => {
  const digits = String(value ?? '').replace(/\D/g, '')
  itemForm.value.stockDelta = digits
}

/* 물품 추가 */
const addItem = () => {
  const name = itemForm.value.itemName.trim()
  if (!name) return

  const qtyStr = itemForm.value.stockDelta
  const quantity = qtyStr ? Number(qtyStr) : 0

  const boxOption = boxOptions.find(o => o.value === itemForm.value.boxId)
  const movementOption = movementTypeOptions.find(
      o => o.value === itemForm.value.movementType
  )

  items.value.push({
    id: Date.now() + Math.random(),
    itemName: name,
    boxId: itemForm.value.boxId || null,
    boxLabel: boxOption?.label || '박스 미지정',
    stockDelta: quantity,
    movementType: itemForm.value.movementType,
    movementLabel: movementOption?.label || '입고'
  })

  /* 폼 초기화 */
  itemForm.value.itemName = ''
  itemForm.value.boxId = ''
  itemForm.value.stockDelta = ''
  itemForm.value.movementType = 'IN'
}

/* 물품 삭제 */
const removeItem = (id) => {
  items.value = items.value.filter(item => item.id !== id)
}

/* 취소 버튼: 이전 화면으로 */
const handleCancel = () => {
  router.back()
}

/* 제출 */
const handleSubmit = () => {
  const payload = {
    ...form.value,
    items: items.value
  }
  /* TODO: 나중에 백엔드 엔드포인트 연결 */
  console.log('submit entry request', payload)
}

/* 오늘 날짜 텍스트 (디버깅/표시용) */
const formattedEntryDate = computed(() => {
  const d = form.value.entryDate
  if (!(d instanceof Date)) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})
</script>

<template>
  <div class="entry-page">
    <header class="entry-header">
      <h1 class="entry-title">출입 신청</h1>
    </header>

    <main class="entry-main">
      <!-- 왼쪽: 신청 폼 -->
      <section class="entry-card entry-card--form">
        <!-- 출입 유형 -->
        <div class="form-row">
          <label class="form-label">출입 유형</label>
          <AppDropdown
              v-model="form.entryType"
              :options="entryTypeOptions"
              placeholder="출입 유형 선택"
          />
        </div>

        <!-- 방 선택 -->
        <div class="form-row">
          <label class="form-label">방 선택</label>
          <AppDropdown
              v-model="form.roomId"
              :options="roomOptions"
              placeholder="방 선택"
          />
        </div>

        <!-- 물품 정보 섹션 -->
        <!-- 물품 정보 섹션 -->
        <div class="item-section">
          <div class="item-section__header">
            <span class="item-section__title">물품 정보</span>
            <span class="item-section__subtitle">
              여러 종류의 물품을 추가할 수 있어요.
            </span>
          </div>

          <!-- 2줄 레이아웃 폼 -->
          <div class="item-form-grid">
            <!-- 1줄 전체: 물품 이름 -->
            <div class="item-form-field item-form-field--name">
              <div class="form-label-small">물품 이름</div>
              <AppInput
                  v-model="itemForm.itemName"
                  placeholder="물품 이름을 입력하세요"
              />
            </div>

            <!-- 2줄 왼쪽: 박스 선택 -->
            <div class="item-form-field item-form-field--box">
              <div class="form-label-small">박스 선택</div>
              <AppDropdown
                  v-model="itemForm.boxId"
                  :options="boxOptions"
                  placeholder="박스 선택"
              />
            </div>

            <!-- 2줄 중간(좁게): 입출고 -->
            <div class="item-form-field item-form-field--movement">
              <div class="form-label-small">입출고</div>
              <AppDropdown
                  v-model="itemForm.movementType"
                  :options="movementTypeOptions"
                  placeholder="입출고"
              />
            </div>

            <!-- 2줄 오른쪽(넓게): 재고 조정 -->
            <div class="item-form-field item-form-field--stock">
              <div class="form-label-small">재고 조정</div>
              <AppInput
                  :model-value="itemForm.stockDelta"
                  placeholder="조정할 수량 (예: 10)"
                  type="number"
                  min="0"
                  @update:model-value="handleItemStockInput"
              />
            </div>

            <!-- 2줄 맨 끝: 버튼 -->
            <div class="item-form-field item-form-field--add">
              <AppButton variant="primary" @click="addItem">
                물품 추가
              </AppButton>
            </div>
          </div>

          <!-- 현재 등록된 물품 리스트 -->
          <div class="item-list">
            <div
                v-if="items.length"
                v-for="item in items"
                :key="item.id"
                class="item-row"
            >
              <div class="item-row__info">
                <div class="item-row__name">
                  {{ item.itemName }}
                </div>
                <div class="item-row__meta">
                  <span>박스: {{ item.boxLabel }}</span>
                  <span>구분: {{ item.movementLabel }}</span>
                  <span>수량: {{ item.stockDelta }}</span>
                </div>
              </div>
              <button
                  type="button"
                  class="item-delete"
                  @click="removeItem(item.id)"
                  aria-label="삭제"
              >
                ×
              </button>
            </div>

            <div v-else class="item-empty">
              등록된 물품이 없습니다. 위에서 물품을 추가해 주세요.
            </div>
          </div>
        </div>

        <!-- 비고 -->
        <div class="form-row">
          <label class="form-label">비고</label>
          <AppInput
              v-model="form.memo"
              type="textarea"
              :rows="3"
              placeholder="누가 어떤 작업을 하는지 등 메모를 작성해 주세요."
          />
        </div>
      </section>

      <!-- 오른쪽: 날짜 선택 (항상 열린 달력) -->
      <section class="entry-card entry-card--date">
        <h2 class="section-title">날짜 선택</h2>
        <p class="date-caption">
          <span v-if="formattedEntryDate">선택된 날짜: {{ formattedEntryDate }}</span>
        </p>

        <!-- 항상 펼쳐져 있는 달력 -->
        <el-calendar
            v-model="form.entryDate"
            class="entry-calendar"
        />
      </section>
    </main>

    <!-- 하단 버튼 -->
    <footer class="entry-footer">
      <div class="entry-footer__actions">
        <AppButton type="button" @click="handleCancel">
          취소
        </AppButton>
        <AppButton variant="primary" @click="handleSubmit">
          출입 신청
        </AppButton>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ========== 페이지 전체 레이아웃 ========== */
.entry-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 32px;
}

.entry-header {}

.entry-title {
  font-size: 24px;
  font-weight: 700;
}

.entry-main {
  display: grid;
  grid-template-columns: 2fr 1.5fr;
  gap: 24px;
}

/* 카드 공통 */
.entry-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

/* ========== 기본 폼 라인 ========== */
.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;

  /* 🔥 여기서 왼쪽 정렬 고정 */
  align-items: flex-start !important;
  text-align: left !important;
}

.form-label {
  font-size: 14px;
  font-weight: 600;

  /* 라벨도 무조건 왼쪽 */
  text-align: left !important;
  display: block;
  margin-left: 2px;
}

/* ========== 물품 섹션 전체 ========== */
.item-section {
  margin: 20px 0 24px;
  padding: 16px;
  background: #f8fbff;
  border-radius: 12px;
}

.item-section__header {
  margin-bottom: 8px;
}

.item-section__title {
  font-size: 15px;
  font-weight: 700;
}

.item-section__subtitle {
  font-size: 12px;
  color: #7b8a9a;
}

/* ========== 물품 입력 2줄 레이아웃 ========== */
.item-form-grid {
  display: grid;

  /* name 1줄 전체, 2줄 4분할 */
  grid-template-columns: 2fr 1.4fr 0.8fr 1.4fr auto;
  grid-template-areas:
    "name name name name name"
    "box  box  movement stock add";

  column-gap: 24px;
  row-gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.item-form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-label-small {
  font-size: 12px;
  font-weight: 600;
  color: #52616f;
}

/* grid-area 매핑 */
.item-form-field--name { grid-area: name; }
.item-form-field--box { grid-area: box; }
.item-form-field--movement {
  grid-area: movement;
  min-width: 0; /* 내부 요소 폭이 셀을 밀지 못하도록 */
}
.item-form-field--stock { grid-area: stock; }
.item-form-field--add {
  grid-area: add;
  justify-self: end;
}

/* ========== 인풋 & 셀렉트 공통 높이 조정 ========== */
.item-form-field--box :deep(.el-select),
.item-form-field--movement :deep(.el-select),
.item-form-field--stock :deep(input),
.item-form-field--name :deep(input) {
  height: 36px !important;
  min-height: 36px !important;
}

/* ========== ‘입출고’ 드롭다운 슬림화 핵심 ========== */
.item-form-field--movement :deep(.el-select),
.item-form-field--movement :deep(.el-select__wrapper) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box;
}

/* 박스 선택 */
.item-form-field--box :deep(.el-select) {
  width: 100% !important;
}

/* 재고 조정 */
.item-form-field--stock :deep(input) {
  width: 100%;
}

/* 버튼 정렬 */
.item-form-field--add > * {
  margin-top: 4px;
}

/* ========== 물품 리스트 ========== */
.item-list {
  border-top: 1px solid #e2edf7;
  padding-top: 10px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.15s;
}

.item-row + .item-row { margin-top: 4px; }
.item-row:hover { background: #f0f6ff; }

.item-row__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-row__name {
  font-size: 14px;
  font-weight: 600;
}

.item-row__meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7a88;
}

.item-empty {
  font-size: 12px;
  color: #95a4b5;
}

.item-delete {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
}

/* ========== 달력 카드 ========== */
.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.date-caption {
  font-size: 12px;
  color: #6b7a88;
  margin-bottom: 8px;
}

.entry-calendar {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2edf7;
}

/* ========== 하단 버튼 ========== */
.entry-footer {
  display: flex;
  justify-content: flex-end;
}

.entry-footer__actions {
  display: flex;
  gap: 12px;
}

.form-row :deep(textarea.el-textarea__inner) {
  height: 120px !important;
  min-height: 120px !important;
  max-height: 120px !important;
  resize: none !important;
}
</style>