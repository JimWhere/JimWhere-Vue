<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const qrToken = computed(() => route.query.qrToken || '')
</script>

<template>
  <div style="padding:24px">
    <h2>QR 토큰</h2>

    <div v-if="qrToken" style="margin-top:12px; word-break:break-all; padding:12px; border:1px solid #ddd; border-radius:8px">
      {{ qrToken }}
    </div>

    <div v-else style="margin-top:12px; color:#888">
      전달된 토큰이 없습니다.
    </div>

    <button style="margin-top:16px" @click="router.back()">뒤로</button>
  </div>
</template>
