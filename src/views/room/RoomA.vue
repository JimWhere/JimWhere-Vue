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
                <div class="box-filled">보관 중</div>
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
            <button type="button" class="calendar-nav prev" @click="prevMonth">‹</button>
            <span>{{ displayedYear }}년 {{ displayedMonth + 1 }}월</span>
            <button type="button" class="calendar-nav next" @click="nextMonth">›</button>
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
                'is-in-range': cell.isInRange,
                'is-reserved': cell.isReserved
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
import { checkOverlap, fetchReservedRanges } from '@/api/reservations'

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

const displayedYear = ref(today.getFullYear())
const displayedMonth = ref(today.getMonth())
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
  const first = new Date(displayedYear.value, displayedMonth.value, 1)
  const last = new Date(displayedYear.value, displayedMonth.value + 1, 0)
  const cells = []
  const offset = first.getDay()

  const start = parseDate(startDate.value)
  const end = parseDate(endDate.value)

  // note: compute isReserved per-cell below (fullDate is defined per iteration)

  for (let i = 0; i < offset; i++) {
    cells.push({
      date: null,
      isToday: false,
      isStart: false,
      isEnd: false,
      isInRange: false,
      isReserved: false,
    })
  }

  for (let d = 1; d <= last.getDate(); d++) {
    const fullDate = new Date(displayedYear.value, displayedMonth.value, d)
    const isToday = isSameDay(fullDate, today)
    const isStart = isSameDay(fullDate, start)
    const isEnd = isSameDay(fullDate, end)
    const isInRange = start && end && fullDate >= start && fullDate <= end
    const dateStr = toInputValue(fullDate)
    const isReserved = (typeof reservedDateSet !== 'undefined') && reservedDateSet.value && reservedDateSet.value.has && reservedDateSet.value.has(dateStr)

    cells.push({
      date: d,
      fullDate,
      isToday,
      isStart,
      isEnd,
      isInRange,
      isReserved,
    })
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      date: null,
      isToday: false,
      isStart: false,
      isEnd: false,
      isInRange: false,
      isReserved: false,
    })
  }

  return cells
})

// 날짜 클릭 처리 및 월 이동 기능 추가
function onClickDate(cell) {

  if (cell?.isReserved) {
    alert('이미 예약된 날짜입니다.')
    return
  }

  if (!cell || !cell.date || !cell.fullDate) return
  const clicked = new Date(cell.fullDate.getFullYear(), cell.fullDate.getMonth(), cell.fullDate.getDate())

  // 항상 클릭한 날짜의 달을 보여주도록 조정
  displayedYear.value = clicked.getFullYear()
  displayedMonth.value = clicked.getMonth()

  const s = parseDate(startDate.value)
  const e = parseDate(endDate.value)

  // 선택 초기화 (둘 다 비어있거나 둘 다 채워져 있을 경우) -> 시작일로 설정
  if (!startDate.value || (startDate.value && endDate.value)) {
    startDate.value = toInputValue(clicked)
    endDate.value = ''
    return
  }

  // 시작일만 있는 경우: 클릭한 날짜가 시작일 이전이면 시작일 갱신, 이후면 종료일로 설정
  if (s && !endDate.value) {
    if (clicked <= s) {
      startDate.value = toInputValue(clicked)
      endDate.value = ''
    } else {
      endDate.value = toInputValue(clicked)
    }
  }
}

function prevMonth() {
  if (displayedMonth.value === 0) {
    displayedYear.value -= 1
    displayedMonth.value = 11
  } else {
    displayedMonth.value -= 1
  }
}

function nextMonth() {
  if (displayedMonth.value === 11) {
    displayedYear.value += 1
    displayedMonth.value = 0
  } else {
    displayedMonth.value += 1
  }
}

// 예약하기 -> 리다이렉트 
const goToReservation = async () => {
  // selectedRoom 정규화
  const sel = selectedRoom.value
  const roomStr = (typeof sel === 'string') ? sel : (sel?.value ?? sel?.label ?? 'A1')

  // roomCode 매핑 (이미 정의된 로직과 동일)
  const mapRoomToCodeLocal = (roomName) => {
    if (!roomName) return 1
    const prefix = roomName[0].toUpperCase()
    const num = Number(roomName.slice(1)) || 1
    if (prefix === 'A') return num
    if (prefix === 'B') return 5 + num
    if (prefix === 'C') return 10 + num
    return num
  }

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
  const timeSuffix = 'T12:00:00' // 서버와 약속된 시간 포맷 사용
  const startAtISO = startDate.value ? `${startDate.value}${timeSuffix}` : ''
  const endAtISO = endDate.value ? `${endDate.value}${timeSuffix}` : ''
  const amount = totalPrice.value

  // 기본 유효성 검사
  if (!startAtISO || !endAtISO) {
    alert('시작일과 종료일을 선택해주세요.')
    return
  }
  if (new Date(startAtISO) >= new Date(endAtISO)) {
    alert('종료일은 시작일보다 이후여야 합니다.')
    return
  }

  try {
    // 1) 사전 겹침 확인 호출 (reservations API helper)
    const overlap = await checkOverlap(Number(roomCode), startAtISO, endAtISO)
    if (overlap) {
      alert('선택하신 기간에 이미 예약이 존재합니다. 다른 날짜를 선택하세요.')
      return
    }
    
    // 3) 결제 페이지로 이동 (쿼리 전달)
    router.push({
      path: '/payments/request',
      query: {
        roomCode: String(roomCode),
        roomTypeCode: String(roomTypeCode), // 숫자 형식이 필요하면 그대로
        startAt: startAtISO,
        endAt: endAtISO,
        amount: String(amount),
        roomTypeName, // 문자열
      }
    })
  } catch (err) {
    console.error('예약 흐름 오류', err)
    // check 호출 실패(파싱/서버 에러)
    if (err.response) {
      if (err.response.status === 409) {
        alert('선택하신 기간에 이미 예약이 있습니다.')
        return
      }
      const msg = err.response.data?.message ?? err.response.data?.error
      alert(msg ?? '예약 처리 중 오류가 발생했습니다.')
      return
    }
    alert('네트워크 오류가 발생했습니다. 다시 시도하세요.')
  }
}

// Box 매핑에서 label에 대응하는 항목을 안전하게 반환
function getBox(label) {
  return boxMap.value[label] ?? boxMap.value[label.toLowerCase()] ?? boxMap.value[label.toUpperCase()] ?? null
}

// 화면에 박스 정보를 보여줘야 하는지 여부 판단
function hasVisibleBox(label) {
  const b = getBox(label)
  console.log('BoxLabel', b)
  if (!b) return false
  const content = b.boxContent
  const count = Number(b.boxCurrentCount ?? 0)
  // 내용 문자열이 비어있거나 null/undefined 이고, 재고도 0이면 '비어있음'으로 간주
  return (content !== null && content !== undefined && String(content).trim() !== '') || count > 0
}

const boxMap = computed(() => {
  const map = {}
  const prefixes = ['a','A','b','B','c','C'] // 필요하면 확장

  boxes.value.forEach(b => {
    const raw = b.boxCode ?? b.boxLabel ?? b.box_id ?? b.label ?? b.boxName
    if (!raw) return
    const s = String(raw).trim()

    // 원본 형태들
    map[s] = b
    map[s.toLowerCase()] = b
    map[s.toUpperCase()] = b

    // 숫자 부분 추출 (예: "B12" -> "12")
    const num = s.replace(/\D/g, '')
    if (num) {
      // 숫자만(예: "12")
      map[num] = b

      // 모든 접두사 조합 생성
      prefixes.forEach(p => {
        map[p + num] = b
      })
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

// roomCode -> selectedRoom
function mapRoomCodeToName(code) {
  if (!code) return null
  const n = Number(code)
  if (n >= 1 && n <= 5) return `A${n}`
  if (n >= 6 && n <= 10) return `B${n - 5}`
  if (n >= 11 && n <= 15) return `C${n - 10}`
  return null
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
  // query로 roomCode가 전달되면 selectedRoom 설정
  const qc = route.query.roomCode
  if (qc) {
    const rn = mapRoomCodeToName(qc)
    if (rn) selectedRoom.value = rn
  }

  fetchBoxesForRoom(selectedRoom.value)
  loadReservedForDisplayedMonth()
})

watch(selectedRoom, (newVal) => {
  fetchBoxesForRoom(newVal)
  loadReservedForDisplayedMonth()
})

watch([displayedYear, displayedMonth], () => {
  loadReservedForDisplayedMonth()
})

watch(() => route.query.roomCode, (newCode) => {
  const rn = mapRoomCodeToName(newCode)
  if (rn) selectedRoom.value = rn
})

const reservedRanges = ref([])
const reservedDateSet = ref(new Set())

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function buildReservedDateSet() {
  const set = new Set()
  reservedRanges.value.forEach(r => {
    const start = new Date(r.startAt)
    const end = new Date(r.endAt)
    // end 포함/미포함 규칙은 서버 약속에 맞춰 조정
    let cur = new Date(start.getFullYear(), start.getMonth(), start.getDate())
    const last = new Date(end.getFullYear(), end.getMonth(), end.getDate())
    while (cur <= last) {
      set.add(toInputValue(cur)) // YYYY-MM-DD 포맷(이미 있는 toInputValue 사용)
      cur = addDays(cur, 1)
    }
  })
  reservedDateSet.value = set
}

// 보이는 달 기준으로 서버 호출 함수 추가
async function loadReservedForDisplayedMonth() {
  const first = new Date(displayedYear.value, displayedMonth.value, 1)
  const last = new Date(displayedYear.value, displayedMonth.value + 1, 0)
  const from = toInputValue(first)
  const to = toInputValue(last)
  const roomCode = mapRoomToCode(selectedRoom.value) // 기존 mapRoomToCode 사용

  try {
    const res = await fetchReservedRanges(roomCode, from, to)
    const data = res.data ?? res
    reservedRanges.value = Array.isArray(data) ? data : (data?.data ?? [])
    buildReservedDateSet()
  } catch (err) {
    console.error('reserved fetch failed', err)
    reservedRanges.value = []
    reservedDateSet.value = new Set()
  }
}




</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";

.page {
  /* padding-left:5%; */
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
  margin-right: 1.5%;
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

.calendar-header { text-align: center; font-weight: var(--app-font-weight-semibold); margin-bottom: 12px; display:flex; align-items:center; justify-content:center; gap:12px }

.calendar-nav { background: transparent; border: none; cursor: pointer; font-size:18px; padding:4px 8px; border-radius:6px }
.calendar-nav:hover { background: rgba(0,0,0,0.04) }

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

.calendar-cell.is-reserved {
  background: #f5f5f7;
  color: #9aa0a6;
  cursor: not-allowed;
}

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

