<!--
<template>

    <main class="page">
      <section class="room-card">
        <h2 class="room-title">{{ roomType }}방 내부 구조</h2>
        <div class="room-layout">

          <div class="room-inner" :style="roomGridStyle">

            <div
                class="bed"
                v-for="bed in beds"
                :key="bed.label"
                :class="{ 'bed-after-aisle': bed.isAfterAisle }"
            >
              {{ bed.label }}
            </div>


            <div class="entrance">입구</div>
          </div>
        </div>
      </section>


      <section class="booking-card">
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

        <button class="reserve-button" @click="handleReserve">
          예약하기
        </button>
      </section>
    </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from "@/components/shared/header/Header.vue";

const nightlyPrice = 20000
const roomType = 'B'

const columnCount = ref(2)
const bedsPerColumn = ref(4)

const roomGridStyle = computed(() => ({
  '&#45;&#45;cols': columnCount.value,
  '&#45;&#45;rows': bedsPerColumn.value,
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
        label: `${roomType}${num}`,
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

const handleReserve = () => {
  if (!nights.value) {
    alert('시작일과 종료일을 다시 선택해 주세요.')
    return
  }
  alert(
      `${startDate.value} ~ ${endDate.value} / ${nights.value}박\n결제 금액: ${formattedTotal.value}원`
  )
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #e7f4ff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
  sans-serif;
}



.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px 40px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.room-card,
.booking-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.room-card {
  flex: 3;
}

.booking-card {
  flex: 2;
}


.room-title {
  text-align: center;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 700;
}

.room-layout {
  display: flex;
  justify-content: center;
}

.room-inner {
  position: relative;
  width: 100%;
  max-width: 420px;
  height: 280px;
  border-radius: 8px;
  border: 3px solid #000000;
  padding: 24px 24px 60px;
  background: #f9fbff;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: repeat(var(&#45;&#45;cols), 1fr);
  grid-template-rows: repeat(var(&#45;&#45;rows), 1fr);
  gap: 8px;
  align-content: flex-start;
}

.bed {
  background: #c4cffc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}


.bed-after-aisle {
  margin-left: 16px;
}

.entrance {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  padding: 6px 18px;
  border: 2px solid #000;
  border-radius: 4px;
  background: #ffffff;
  font-size: 14px;
  font-weight: 600;
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

.date-field label {
  font-weight: 600;
}

.date-field input[type='date'] {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ccd3e0;
  font-size: 14px;
}


.calendar {
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid #dde4f0;
  background: #fdfdff;
  padding: 16px;
}

.calendar-header {
  text-align: center;
  font-weight: 600;
  margin-bottom: 12px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.calendar-day-name {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
}

.calendar-cell {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: 6px;
  cursor: pointer;
}

.calendar-cell.is-empty {
  background: transparent;
  cursor: default;
}


.calendar-cell.is-in-range {
  background: #d4e5ff;
}

.calendar-cell.is-start,
.calendar-cell.is-end {
  background: #78b3ff;
  color: #ffffff;
  font-weight: 700;
}

.calendar-cell.is-today {
  border: 1px solid #4b7bec;
  box-shadow: 0 0 0 2px rgba(75, 123, 236, 0.2);
}


.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
}

.price-row .price {
  font-size: 18px;
}

.reserve-button {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  background: #78b3ff;
  color: #ffffff;
  transition: transform 0.05s ease, box-shadow 0.05s ease;
}

.reserve-button:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}


@media (max-width: 900px) {
  .page {
    flex-direction: column;
  }
}
</style>
-->
