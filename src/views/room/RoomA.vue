<template>
    <main class="page">
      <section class="room-card">
        <h2 class="room-title">{{ selectedRoom }} 방 배치</h2>
        <div class="room-layout">

          <div class="room-inner" :style="roomGridStyle">

            <div
              class="bed"
              v-for="bed in beds"
              :key="bed.label"
              :class="{
                'bed-after-aisle': bed.isAfterAisle,
                occupied: (boxMap[bed.label] && (Number(boxMap[bed.label].boxCurrentCount) || 0) > 0),
                empty: !boxMap[bed.label] || (Number(boxMap[bed.label].boxCurrentCount) || 0) === 0
              }"
            >
              <div class="bed-label">{{ bed.label }}</div>

              <template v-if="hasVisibleBox(bed.label)">
                <div class="box-content">{{ getBox(bed.label).boxContent || '-' }}</div>
                <div class="box-count">{{ getBox(bed.label).boxCurrentCount ?? 0 }} 개</div>
              </template>
              <template v-else>
                <div class="box-empty">보관 가능</div>
              </template>
            </div>

            <div class="entrance">입구</div>
          </div>
        </div>
      </section>


      <section class="booking-card">
        <div class="room-select">
          <label>방 이름</label>
          <AppDropdown v-model="selectedRoom" :options="roomOptions" />
        </div>
        <div class="date-inputs">
          <div class="date-field">
            <label>시작일</label>
            <input type="date" v-model="startDate" />
          </div>
          <div class="date-field">
            <label>종료일</label>
            <input type="date" v-model="endDate" />
          </div>
        </div>

        <div class="calendar">
          <div class="calendar-header">
            <span>{{ currentYear }}년 {{ currentMonth + 1 }}월</span>
          </div>
          <div class="calendar-grid">
            <div class="calendar-day-name" v-for="d in dayNames" :key="d">
              {{ d }}
            </div>

            <div
                v-for="(cell, index) in calendarCells"
                :key="index"
                class="calendar-cell"
                :class="{
                'is-today': cell.isToday,
                'is-empty': !cell.date,
                'is-start': cell.isStart,
                'is-end': cell.isEnd,
                'is-in-range': cell.isInRange
              }"
                @click="onClickDate(cell)"
            >
              <span v-if="cell.date">{{ cell.date }}</span>
            </div>
          </div>
        </div>

        <div class="price-row">
          <span>결제 금액</span>
          <span class="price"><strong>{{ formattedTotal }}</strong> 원</span>
        </div>

        <button class="reserve-button" @click="goToReservation">
          예약하기
        </button>
      </section>
    </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { listBoxesByRoom } from '@/api/box';
import { watch } from 'vue'
import router from "@/router/index.js";
import AppDropdown from '@/components/shared/form/AppDropdown.vue';

const route = useRoute();
const boxes = ref([]);

// dropdown options for selecting a specific room
const roomOptions = [
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'A3', label: 'A3' },
  { value: 'A4', label: 'A4' },
  { value: 'A5', label: 'A5' }
]
const selectedRoom = ref(roomOptions[0].value)

const nightlyPrice = 10000
const boxType = 'a'

const columnCount = ref(4)
const bedsPerColumn = ref(4)

const roomGridStyle = computed(() => ({
  '--cols': columnCount.value,
  '--rows': bedsPerColumn.value,
}))


const beds = computed(() => {
  const result = []
  const cols = columnCount.value
  const rows = bedsPerColumn.value
  const middleColIndex = Math.floor(cols / 2)

  let num = 1
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result.push({
        label: `${boxType}${num}`,
        isAfterAisle: c === middleColIndex,
      })
      num++
    }
  }
  return result
})

const today = new Date()
const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

const toInputValue = (d) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const startDate = ref(toInputValue(today))
const endDate = ref(toInputValue(tomorrow))

const nights = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  const s = new Date(startDate.value)
  const e = new Date(endDate.value)
  const diff = e.getTime() - s.getTime()
  if (diff <= 0) return 0
  return Math.round(diff / (1000 * 60 * 60 * 24))
})

const totalPrice = computed(() => nights.value * nightlyPrice)
const formattedTotal = computed(() =>
    totalPrice.value.toLocaleString('ko-KR')
)

const currentYear = today.getFullYear()
const currentMonth = today.getMonth()
const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const parseDate = (str) => {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const isSameDay = (d1, d2) =>
    d1 &&
    d2 &&
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()

const calendarCells = computed(() => {
  const first = new Date(currentYear, currentMonth, 1)
  const last = new Date(currentYear, currentMonth + 1, 0)
  const cells = []
  const offset = first.getDay()

  const start = parseDate(startDate.value)
  const end = parseDate(endDate.value)

  for (let i = 0; i < offset; i++) {
    cells.push({
      date: null,
      isToday: false,
      isStart: false,
      isEnd: false,
      isInRange: false,
    })
  }

  for (let d = 1; d <= last.getDate(); d++) {
    const fullDate = new Date(currentYear, currentMonth, d)
    const isToday = isSameDay(fullDate, today)
    const isStart = isSameDay(fullDate, start)
    const isEnd = isSameDay(fullDate, end)
    const isInRange = start && end && fullDate >= start && fullDate <= end

    cells.push({
      date: d,
      fullDate,
      isToday,
      isStart,
      isEnd,
      isInRange,
    })
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      date: null,
      isToday: false,
      isStart: false,
      isEnd: false,
      isInRange: false,
    })
  }

  return cells
})


const onClickDate = (cell) => {
  if (!cell.date || !cell.fullDate) return

  const clicked = cell.fullDate
  const s = parseDate(startDate.value)
  const e = parseDate(endDate.value)

  if (!s || (s && e)) {
    startDate.value = toInputValue(clicked)
    endDate.value = ''
    return
  }

  if (clicked < s) {
    endDate.value = toInputValue(s)
    startDate.value = toInputValue(clicked)
  } else if (isSameDay(clicked, s)) {
    endDate.value = ''
  } else {
    endDate.value = toInputValue(clicked)
  }
}

// 예약하기 -> 리다이렉트 
const goToReservation = () => {
  // selectedRoom 정규화 (v-model이 object일 경우 대비)
  const sel = selectedRoom.value
  const roomStr = (typeof sel === 'string') ? sel : (sel?.value ?? sel?.label ?? 'A1')

  // roomCode 매핑 (예: A1..A5 -> 1..5, B1..B5 -> 6..10, C1..C5 -> 11..15)
  function mapRoomToCodeLocal(roomName) {
    if (!roomName) return 1
    const prefix = roomName[0].toUpperCase()
    const num = Number(roomName.slice(1)) || 1
    if (prefix === 'A') return num
    if (prefix === 'B') return 5 + num
    if (prefix === 'C') return 10 + num
    return num
  }

  // roomTypeCode 매핑 (백엔드 규칙에 맞게 수정하세요)
  function mapRoomTypeToCode(roomNameOrType) {
    // 예: A/B/C -> 1/2/3  (필요하면 'S','M','L' 규칙으로 변경)
    const ch = (typeof roomNameOrType === 'string' ? roomNameOrType[0] : String(roomNameOrType)).toUpperCase()
    if (ch === 'A') return 1
    if (ch === 'B') return 2
    if (ch === 'C') return 3
    return 1
  }

  const roomCode = mapRoomToCodeLocal(roomStr)
  const roomTypeCode = mapRoomTypeToCode(roomStr) // 숫자
  const roomTypeName = roomStr[0].toUpperCase() // 예: 'A' 또는 필요하면 다른 값 사용

  // startDate/endDate에 시간 붙이기 (예: '2025-12-20' -> '2025-12-20T12:00:00')
  // 원하는 시간이 있으면 변경하세요.
  const timeSuffix = 'T12:00:00'
  const startAtISO = startDate.value ? `${startDate.value}${timeSuffix}` : ''
  const endAtISO = endDate.value ? `${endDate.value}${timeSuffix}` : ''

  const amount = totalPrice.value

  // 디버그 로그 확인
  console.log({ roomStr, roomCode, roomTypeCode, roomTypeName, startAtISO, endAtISO, amount })

  router.push({
    path: '/payments/request',
    query: {
      roomCode: String(roomCode),
      roomTypeCode: String(roomTypeCode), // 숫자 형식이 필요하면 그대로
      startAt: startAtISO,
      endAt: endAtISO,
      amount: String(amount),
      roomTypeName, // 문자열
    },
  })
}

// Box 매핑에서 label에 대응하는 항목을 안전하게 반환
function getBox(label) {
  return boxMap.value[label] ?? boxMap.value[label.toLowerCase()] ?? boxMap.value[label.toUpperCase()] ?? null
}

// 화면에 박스 정보를 보여줘야 하는지 여부 판단
function hasVisibleBox(label) {
  const b = getBox(label)
  if (!b) return false
  const content = b.boxContent
  const count = Number(b.boxCurrentCount ?? 0)
  // 내용 문자열이 비어있거나 null/undefined 이고, 재고도 0이면 '비어있음'으로 간주
  return (content !== null && content !== undefined && String(content).trim() !== '') || count > 0
}

const boxMap = computed(() => {
  const map = {}
  boxes.value.forEach(b => {
    const raw = b.boxCode ?? b.boxLabel ?? b.box_id ?? b.label ?? b.boxName
    if (!raw) return
    const s = String(raw)

    // map raw forms
    map[s] = b
    map[s.toLowerCase()] = b
    map[s.toUpperCase()] = b

    // numeric part (e.g., API returns '1' but bed label is 'a1')
    const num = s.replace(/\D/g, '')
    if (num) {
      map[num] = b
      map['a' + num] = b
      map['A' + num] = b
    }
  })
  return map
})

// selectedRoom -> roomCode 변환
function mapRoomToCode(roomName) {
  if (!roomName) return 1
  const prefix = roomName[0].toUpperCase()
  const num = Number(roomName.slice(1)) || 1
  if (prefix === 'A') return num
}

// fetch 함수 
async function fetchBoxesForRoom(roomName) {
  const roomCode = mapRoomToCode(roomName)
  try {
    const apiRes = await listBoxesByRoom(roomCode)
    const data = apiRes.data ?? apiRes

    console.log('api response : ' + data);

    boxes.value = Array.isArray(data) ? data : (data?.data ?? [])
  } catch (e) {
    console.error('박스 목록 조회 실패')
    boxes.value = []
  }
}

// 초기 호출과 watch 연결
onMounted(() => {
  fetchBoxesForRoom(selectedRoom.value)
})

watch(selectedRoom, (newVal) => {
  fetchBoxesForRoom(newVal)
})

</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";

.page {
  padding-left:5%;
  display: flex;
  flex-direction: row;
  font-family: var(--app-font);
  font-weight: var(--app-font-weight-regular);
  /* align-items: center; */
}

.room-card {
  width: 100%;
  height: 100%;
  background: var(--color-surface, #ffffff);
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  padding: 5%;
  margin-right: 10%;
}
.booking-card {
  background: var(--color-surface, #ffffff);
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.room-title {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: var(--app-font-weight-semibold);
}

.room-layout {
  display: flex;
  justify-content: center;
  /* margin-bottom: 60px; */
}

.room-inner {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 8px;
  border: 3px solid var(--color-border, #000000);
  padding: 24px 24px 60px;
  background: var(--color-bg-muted, #f9fbff);
  box-sizing: border-box;

  display: grid;
  grid-template-columns: repeat(var(--cols, 4), 1fr);
  grid-template-rows: repeat(var(--rows, 4), 1fr);
  gap: 20px;
  align-content: stretch; /* fill the available height so rows are equal */
  align-items: stretch;  /* ensure children stretch to fill rows */
  justify-items: stretch;
}

.bed {
  background: var(--color-primary-200, #c4cffc);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  /* make each bed fill its grid cell */
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  color: var(--color-on-primary, inherit);
  position:relative;
  padding:8px;
  flex-direction:column;
}

.bed-after-aisle {
  margin-left: 0;
}

.entrance {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  padding: 6px 18px;
  border: 2px solid var(--color-border, #000);
  border-radius: 4px;
  background: var(--color-surface, #ffffff);
  font-size: 14px;
  font-weight: var(--app-font-weight-semibold);
}

.date-inputs {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.date-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
}

.date-field label { font-weight: var(--app-font-weight-semibold); }

.date-field input[type='date'] {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border-muted, #ccd3e0);
  font-size: 14px;
}

.calendar {
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid var(--color-border-muted, #dde4f0);
  background: var(--color-surface, #fdfdff);
  padding: 16px;
}

.calendar-header { text-align: center; font-weight: var(--app-font-weight-semibold); margin-bottom: 12px }

.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px }

.calendar-day-name { text-align: center; font-size: 12px; font-weight: var(--app-font-weight-semibold) }

.calendar-cell {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: 6px;
  cursor: pointer;
}

.calendar-cell.is-empty { background: transparent; cursor: default }
.calendar-cell.is-in-range { background: var(--color-primary-100, #d4e5ff) }
.calendar-cell.is-start, .calendar-cell.is-end { background: var(--color-primary, #78b3ff); color: var(--color-on-primary, #ffffff); font-weight: var(--app-font-weight-semibold) }
.calendar-cell.is-today { border: 1px solid var(--color-primary-500, #4b7bec); box-shadow: 0 0 0 2px rgba(75, 123, 236, 0.2) }

.price-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 14px }
.price-row .price { font-size: 18px }

.reserve-button {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  font-weight: var(--app-font-weight-semibold);
  font-size: 16px;
  cursor: pointer;
  background: var(--color-primary, #78b3ff);
  color: var(--color-on-primary, #ffffff);
  transition: transform 0.05s ease, box-shadow 0.05s ease;
}
.reserve-button:hover { box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); transform: translateY(-1px) }

.room-select{ margin:12px 0 8px }

.bed-specs p{ margin:8px 0; font-size:14px }

/* bed inner labels and status styles */
.bed{ position:relative; padding:8px; display:flex; flex-direction:column; justify-content:center; align-items:center }
.bed-label{ font-size:12px; font-weight:700; margin-bottom:6px }
.box-content{ font-size:11px; margin-top:4px; opacity:.95 }
.box-count{ font-size:13px; font-weight:700; margin-top:6px }
.box-empty{ font-size:12px; color:var(--color-gray-500); }

/* 상태에 따른 색상 */
.bed.occupied{ background: linear-gradient(180deg, #ffdfe0 0%, #ffbdbf 100%); color:#5b1b1b }
.bed.empty{ background: linear-gradient(180deg, var(--color-primary-200,#c4cffc) 0%, #a9c8ff 100%); color:#07213a }

/* 낮은 재고(예: count <= 1) 강조 */
.bed.low-stock{ box-shadow: 0 0 0 3px rgba(255,165,0,0.12); border: 1px solid rgba(255,165,0,0.18) }

/* make inner text readable on small boxes */
.bed .bed-label, .bed .box-content, .bed .box-count{ text-align:center; word-break:break-word }

@media (max-width: 900px) { .page { flex-direction: column } }
</style>

