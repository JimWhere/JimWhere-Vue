<template>
  <div class="page-bg success-page">
    <div class="success-card rounded">
      <h2>결제가 성공적으로 이루어졌습니다!</h2>
      <p class="text-muted">이용해 주셔서 감사합니다.</p>

      <button class="btn-main" @click="goHome">메인 페이지</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { confirmPaymentApi } from "@/api/paymentApi";

const route = useRoute()
const router = useRouter()
const debugText = ref('')

async function confirmPayment() {
  const paymentKey = route.query.paymentKey as string
  const orderId = route.query.orderId as string
  const amount = Number(route.query.amount)

  if (!paymentKey || !orderId || !amount) {
    debugText.value = '필수 쿼리 파라미터가 없습니다.'
    return
  }

  const token = localStorage.getItem('accessToken')
  if (!token) {
    debugText.value = '토큰이 없습니다. 다시 로그인해주세요.'
    return
  }

  try {
    const res = await confirmPaymentApi(token, paymentKey, orderId, amount)
    debugText.value = JSON.stringify(res.data, null, 2)
  } catch (e: any) {
    console.error(e)
    if (e.response) {
      debugText.value = JSON.stringify(e.response.data, null, 2)
    } else {
      debugText.value = String(e)
    }
  }
}

function goHome() {
  router.push('/')
}

onMounted(() => {
  confirmPayment()
})
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.success-card {
  width: 420px;
  background: #fff;
  padding: 40px 32px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  text-align: center;
}
.btn-main {
  margin-top: 24px;
  width: 100%;
  padding: 10px 0;
  border-radius: var(--border-radius);
  border: none;
  background: var(--color-primary);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.btn-main:hover {
  background: var(--color-primary-600);
}
</style>
