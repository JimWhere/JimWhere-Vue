<template>
  <div class="page-bg pay-page">
    <div class="pay-card rounded">
      <h2 class="title">예약 및 결제 확인</h2>

      <!-- 예약 정보 -->
    <table class="info-table">
      <tbody>
        <tr>
          <th>방 타입</th>
          <td>{{ roomTypeName || '-' }}</td>
        </tr>
        <tr>
          <th>대여 기간</th>
          <td>{{ formattedStart }} ~ {{ formattedEnd }}</td>
        </tr>
        <tr>
          <th>대여 금액</th>
          <td>{{ formattedAmount }} 원</td>
        </tr>
      </tbody>
    </table>

      <div class="warning-box">
        <p class="warning-title">주의 사항</p>
        <p class="warning-text">
          음식물 관련 물품은 출입할 수 없습니다.<br />
          대여일 이후 물품이 남아 있을 시 폐기 처분 됩니다.
        </p>
      </div>

      <button
          class="btn-main"
          :disabled="loading"
          @click="handleReserveAndPay"
      >
        {{ loading ? '예약 및 결제 처리 중...' : '예약 확정 후 결제하기' }}
      </button>

      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

      <!-- 디버깅용 -->
      <pre v-if="debugText" class="debug-text">{{ debugText }}</pre>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import dayjs from "dayjs"
import axios from "axios"

// API 설정
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8081"

// 라우터
const route = useRoute()
const router = useRouter()

// 상태값
const loading = ref(false)
const errorMessage = ref("")
const debugText = ref("")

// 쿼리로 넘어온 데이터
const roomCode = Number(route.query.roomCode)
const roomTypeCode = Number(route.query.roomTypeCode)
const startAt = route.query.startAt || ""
const endAt = route.query.endAt || ""
const amount = Number(route.query.amount)
const roomTypeName = route.query.roomTypeName || "A"

// 화면 표시용 포맷
const formattedStart = computed(() =>
    startAt ? dayjs(startAt).format("YYYY.MM.DD") : "-"
)
const formattedEnd = computed(() =>
    endAt ? dayjs(endAt).format("YYYY.MM.DD") : "-"
)
const formattedAmount = computed(() =>
    amount ? amount.toLocaleString() : "0"
)

// 예약 + 결제 처리
const handleReserveAndPay = async () => {
  errorMessage.value = ""
  debugText.value = ""

  const token = localStorage.getItem("accessToken")
  if (!token) {
    errorMessage.value = "로그인이 필요합니다. 다시 로그인 후 이용해주세요."
    await router.push("/login")
    return
  }

  // 필수 값 체크
  if (!roomCode || !roomTypeCode || !startAt || !endAt || !amount) {
    errorMessage.value = "예약 정보가 올바르지 않습니다. 다시 시도해주세요."
    debugText.value = JSON.stringify(
        { roomCode, roomTypeCode, startAt, endAt, amount },
        null,
        2
    )
    return
  }

  try {
    loading.value = true

    // 1) 예약 생성
    const reservationRes = await axios.post(
        `${API_BASE}/api/v1/user/reservations`,
        {
          roomCode,
          roomTypeCode,
          startAt,
          endAt,
          reservationAmount: amount
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
    )

    const reservationBody = reservationRes.data
    if (!reservationBody.success) {
      errorMessage.value =
          reservationBody.message || "예약 생성에 실패했습니다."
      debugText.value = JSON.stringify(reservationBody, null, 2)
      return
    }

    const reservationCode = reservationBody.data.reservationCode

    // 2) 결제 INIT 요청
    const initRes = await axios.post(
        `${API_BASE}/api/v1/user/payments/init`,
        { reservationCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
    )

    const initBody = initRes.data
    if (!initBody.success) {
      errorMessage.value = initBody.message || "결제 준비에 실패했습니다."
      debugText.value = JSON.stringify(initBody, null, 2)
      return
    }

    const data = initBody.data

    // 3) Toss 결제창 호출
    if (!window.TossPayments) {
      errorMessage.value = "결제 모듈을 불러오지 못했습니다."
      return
    }

    const tossPayments = window.TossPayments(data.clientKey)

    tossPayments.requestPayment("CARD", {
      amount: data.amount,
      orderId: data.orderId,
      orderName: data.orderName,
      successUrl: data.successUrl,
      failUrl: data.failUrl
    })
  } catch (e) {
    console.error("예약/결제 시작 중 오류:", e)
    errorMessage.value = "예약/결제 시작 중 오류가 발생했습니다."

    if (e.response) {
      debugText.value = JSON.stringify(e.response.data, null, 2)
    } else {
      debugText.value = String(e)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.pay-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pay-card {
  width: 520px;
  background: #fff;
  padding: 40px 32px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
}
.title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}
.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.info-table th,
.info-table td {
  border: 1px solid #e5eaf5;
  padding: 10px 14px;
}
.info-table th {
  width: 120px;
  text-align: left;
  background: #f7fbff;
}
.info-table td {
  text-align: center;
}
.warning-box {
  margin: 10px 0 20px;
  border-radius: 8px;
  background: #fff5f5;
  border: 1px solid #ffb3b3;
  padding: 16px;
  text-align: center;
}
.warning-title {
  color: #e53935;
  font-weight: 700;
  margin-bottom: 6px;
}
.warning-text {
  color: #d32f2f;
  font-size: 13px;
}
.btn-main {
  margin-top: 10px;
  width: 100%;
  padding: 10px 0;
  border-radius: 8px;
  border: none;
  background: #4c84ff;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.btn-main:disabled {
  opacity: 0.7;
  cursor: default;
}
.error-msg {
  margin-top: 10px;
  color: #e53935;
  font-size: 13px;
  text-align: center;
}
.debug-text {
  margin-top: 16px;
  text-align: left;
  font-size: 11px;
  max-height: 220px;
  overflow: auto;
  background: #f9fbff;
  padding: 8px;
  border-radius: 8px;
}
</style>
