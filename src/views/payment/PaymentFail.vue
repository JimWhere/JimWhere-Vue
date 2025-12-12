<template>
  <div class="page-bg fail-page">
    <div class="fail-card rounded">
      <h2>결제가 실패했습니다.</h2>
      <p class="text-muted">
        다시 시도해 주세요.<br />
        문제가 계속되면 관리자에게 문의해 주세요.
      </p>

      <p v-if="code" class="code">code: {{ code }}</p>
      <p v-if="message" class="code">message: {{ message }}</p>

      <button class="btn-main" @click="goHome">메인 페이지</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const code = route.query.code as string | undefined
const message = route.query.message as string | undefined

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.fail-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fail-card {
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
.code {
  margin-top: 8px;
  font-size: 12px;
}
</style>
