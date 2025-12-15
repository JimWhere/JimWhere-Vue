<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'
import logo from '@/assets/shared/logo/logo.png'
import approvedImg from '@/assets/shared/overlay/approved.png'
import deniedImg from '@/assets/shared/overlay/denied.png'
import {verifyToken} from "@/api/entry.js";

/* 로컬 캐시 키 */
const JM_TICKET_KEY = 'jm_entryTicket'

/* 상태 */
const videoRef = ref(null)
const cameraAvailable = ref(true)
const scanState = ref('idle')        /* idle | processing */
const doorState = ref('closed')      /* closed | open */
const openRemainingSeconds = ref(0)
const manualToken = ref('')
const errorMessage = ref('')

const showApprovedOverlay = ref(false)
const showDeniedOverlay = ref(false)

let codeReader = null
let doorTimerId = null

/* 도어 오픈 신호 TRUE/FALSE */
const doorOpenSignal = computed(() => doorState.value === 'open')

/* 남은 시간 텍스트 */
const doorStatusText = computed(() => {
  if (doorState.value === 'open') {
    return `개방 (${openRemainingSeconds.value}s)`
  }
  return '닫힘'
})

/* 캐시 로드 */
function loadTicket() {
  try {
    const raw = localStorage.getItem(JM_TICKET_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed.token || !parsed.validUntil) return null
    return parsed
  } catch {
    return null
  }
}

/* 캐시 저장 */
function saveTicket(token) {
  const now = Date.now()
  const validUntil = now + 30 * 60 * 1000 /* 30분 */
  const payload = {
    token,
    verifiedAt: now,
    validUntil,
  }
  localStorage.setItem(JM_TICKET_KEY, JSON.stringify(payload))
}

/* 도어 30초 개방 */
function openDoorFor30s() {
  doorState.value = 'open'
  openRemainingSeconds.value = 30
  if (doorTimerId) {
    clearInterval(doorTimerId)
    doorTimerId = null
  }
  doorTimerId = setInterval(() => {
    openRemainingSeconds.value -= 1
    if (openRemainingSeconds.value <= 0) {
      doorState.value = 'closed'
      openRemainingSeconds.value = 0
      clearInterval(doorTimerId)
      doorTimerId = null
    }
  }, 1000)
}

function showApproved() {
  showApprovedOverlay.value = true
  setTimeout(() => showApprovedOverlay.value = false, 1500)
}

function showDenied() {
  showDeniedOverlay.value = true
  setTimeout(() => showDeniedOverlay.value = false, 1500)
}

/* 토큰 처리 공통 함수 (QR + 수기 입력 둘 다 여기로) */
async function handleToken(token) {
  const trimmed = token.trim()
  if (!trimmed || scanState.value === 'processing') return

  errorMessage.value = ''

  const now = Date.now()
  const saved = loadTicket()

  /* 30분 캐시 유효 + 같은 토큰이면 서버 다시 안두드리고 통과 */
  if (saved && saved.token === trimmed && now < saved.validUntil) {
    openDoorFor30s()     // 문 30초 개방
    showApproved()       // PNG 오버레이
    return
  }

  /* 서버 검증 시작 */
  scanState.value = 'processing'

  try {
    const ok = await verifyTokenWithServer(trimmed)

    if (ok) {
      saveTicket(trimmed)   // 30분 캐시 갱신
      openDoorFor30s()      // 문 30초 개방
      showApproved()
    } else {
      errorMessage.value = '유효하지 않은 출입 코드입니다.'
      showDenied()
    }

  } catch (e) {
    console.error(e)
    errorMessage.value = '서버와 통신에 실패했습니다.'
    showDenied()
  } finally {
    scanState.value = 'idle'
  }
}

/* 수기 입력 버튼 클릭 */
function onSubmitManual() {
  handleToken(manualToken.value)
}

/* 실제 서버 통신 부분 (엔드포인트만 맞게 수정해서 쓰면 됨) */
async function verifyTokenWithServer(token) {
  try {
    const res = await verifyToken(token) // axios response
    return res?.data?.success === true && res?.data?.data?.status === 'AUTHORIZED'
  } catch (e) {
    // 4xx/5xx면 axios가 throw 함
    console.error('verify failed:', e?.response?.status, e?.response?.data || e)
    return false
  }
}


/* ZXing 카메라 초기화 */
async function initCamera() {
  // 1) 권한 & 기기 체크 먼저
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    cameraAvailable.value = false
    errorMessage.value =
        '이 브라우저에서는 카메라를 사용할 수 없습니다. 아래에서 출입 코드를 직접 입력해 주세요.'
    return
  }

  try {
    // 권한 테스트용 스트림
    const testStream = await navigator.mediaDevices.getUserMedia({ video: true })
    // ZXing이 다시 열 거라 바로 정리
    testStream.getTracks().forEach(t => t.stop())
  } catch (e) {
    console.error('카메라 권한 없음 또는 오류', e)
    cameraAvailable.value = false
    errorMessage.value =
        '카메라 권한이 없거나 기기를 찾을 수 없습니다. 아래에서 출입 코드를 직접 입력해 주세요.'
    return
  }

  // 2) 여기까지 왔다는 건 권한 OK → 이제 ZXing 초기화
  try {
    codeReader = new BrowserMultiFormatReader()
    const videoInputDevices = await codeReader.listVideoInputDevices()

    if (!videoInputDevices || videoInputDevices.length === 0) {
      throw new Error('No camera device found')
    }

    const selectedDeviceId = videoInputDevices[0].deviceId

    codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.value, (result, err) => {
      if (result) {
        handleToken(result.getText())
      }
      if (err && !(err instanceof NotFoundException)) {
        console.debug('ZXing error:', err)
      }
    })

    cameraAvailable.value = true
  } catch (e) {
    console.error('ZXing 초기화 실패', e)
    cameraAvailable.value = false
    errorMessage.value =
        '카메라를 사용할 수 없습니다. 아래에서 출입 코드를 직접 입력해 주세요.'
  }
}

/* 카메라 정리 */
function stopCamera() {
  try {
    if (codeReader) {
      codeReader.reset()
      codeReader = null
    }
    const video = videoRef.value
    if (video && video.srcObject) {
      const stream = video.srcObject
      if (stream && typeof stream.getTracks === 'function') {
        stream.getTracks().forEach((t) => t.stop())
      }
      video.srcObject = null
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  /* 만료된 캐시 제거 */
  const saved = loadTicket()
  if (saved && Date.now() >= saved.validUntil) {
    localStorage.removeItem(JM_TICKET_KEY)
  }

  initCamera()
})

onBeforeUnmount(() => {
  stopCamera()
  if (doorTimerId) {
    clearInterval(doorTimerId)
  }
})
</script>

<template>
  <div class="entry-qr-page">
    <!-- 상단 도어 상태 표시 -->
    <header class="entry-header">
      <div
          class="door-status"
          :class="doorOpenSignal ? 'door-status--open' : 'door-status--closed'"
      >
        <div class="door-status__row">
          출입문 상태(개폐 센서 연동 예정, 현재는 MCU 신호와 동일) :
          <strong>{{ doorStatusText }}</strong>
        </div>

        <div class="door-status__row">
          MCU 신호 전달용(서보 모터, 솔레노이드 락 등) :
          <strong>{{ doorOpenSignal ? 'TRUE' : 'FALSE' }}</strong>
        </div>
      </div>
    </header>

    <!-- 메인 카드 -->
    <main class="entry-card">
      <div class="entry-logo-wrap">
        <img class="entry-logo" :src="logo" alt="JimWhere" />
      </div>
      <h1 class="entry-title">JimWhere-붓싼점 출입 QR 인증</h1>

      <!-- 카메라 영역 -->
      <section v-if="cameraAvailable" class="camera-section">
        <div class="camera-wrapper">
          <video ref="videoRef" class="camera-video" autoplay playsinline></video>

          <!-- 승인(O) -->
          <img
              v-if="showApprovedOverlay"
              :src="approvedImg"
              alt="승인 완료"
              class="overlay-icon approved"
          />

          <!-- 실패(X) -->
          <img
              v-if="showDeniedOverlay"
              :src="deniedImg"
              alt="인증 실패"
              class="overlay-icon denied"
          />
          <div class="camera-overlay">
            <span class="camera-guide">QR 코드를 영역 안에 맞춰 주세요</span>
          </div>
        </div>
        <p class="helper-text">
          카메라에 QR을 비추면 자동으로 출입 코드가 인식됩니다.
        </p>
      </section>

      <!-- 카메라 사용 불가 시 안내 -->
      <section v-else class="fallback-notice">
        <p class="fallback-text">
          카메라를 사용할 수 없음.<br />
          아래 입력란에 받은 출입 코드를 직접 입력해 주세요.
        </p>
      </section>

      <!-- 비상용 / 폴백: 출입 코드 수기 입력 -->
      <section v-if="!cameraAvailable" class="manual-section">
        <label class="manual-label" for="manual-token">출입 코드 수기 입력</label>
        <input
            id="manual-token"
            v-model="manualToken"
            class="manual-input"
            type="text"
            placeholder="QR 대신 받은 출입 코드를 입력하세요"
            @keyup.enter="onSubmitManual"
        />
        <button class="manual-button" type="button" @click="onSubmitManual" :disabled="scanState === 'processing'">
          {{ scanState === 'processing' ? '확인 중...' : '코드 확인' }}
        </button>
      </section>

      <!-- 에러 메시지 -->
      <p v-if="errorMessage" class="error-text">
        {{ errorMessage }}
      </p>
    </main>
  </div>
</template>

<style scoped>
.entry-qr-page {
  min-height: 100vh;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f3f5fb; /* 필요하면 프로젝트 공통 배경으로 교체 */
}

.entry-header {
  display: flex;
  justify-content: center;
}

.door-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  line-height: 1.2;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.door-status__row strong {
  margin-left: 4px;
}

.door-status--open {
  border: 1px solid #22c55e;
  color: #16a34a;
}

.door-status--closed {
  border: 1px solid #f97373;
  color: #dc2626;
}

.door-status__label strong,
.door-status__signal strong {
  margin-left: 4px;
}

.entry-card {
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 16px 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.entry-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 4px;
}

.camera-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.camera-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-overlay {
  position: absolute;
  inset: 0;
  border: 2px dashed rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
  pointer-events: none;
}

.camera-guide {
  font-size: 12px;
  color: #e5e7eb;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.overlay-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 512px;
  height: auto;
  pointer-events: none;
}

.overlay-icon.approved {
  filter: drop-shadow(0 0 12px rgba(34, 197, 94, 0.8));
}

.overlay-icon.denied {
  filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.8));
}

.helper-text {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  }

.fallback-notice {
  text-align: center;
}

.fallback-text {
  font-size: 13px;
  color: #4b5563;
}

.manual-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.manual-label {
  font-size: 13px;
  font-weight: 500;
}

.manual-input {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 8px 10px;
  font-size: 14px;
  outline: none;
}

.manual-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.25);
}

.manual-button {
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: #3b82f6;
  color: #ffffff;
}

.manual-button:disabled {
  opacity: 0.6;
  cursor: default;
}

.error-text {
  margin-top: 4px;
  font-size: 12px;
  color: #dc2626;
  text-align: center;
}

.entry-logo-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: -30px;
}

.entry-logo {
  width: 90px;
  height: auto;
  opacity: 0.9;
}

</style>