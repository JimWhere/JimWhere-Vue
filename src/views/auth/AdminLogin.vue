<template>
  <div class="auth-container">
    <h2 class="title">관리자 로그인</h2>

    <div class="auth-box" @keyup.enter="login">
      <input
          v-model="id"
          placeholder="아이디를 입력해주세요"
          class="input"
      />

      <input
          type="password"
          v-model="password"
          placeholder="비밀번호를 입력해주세요"
          class="input"
      />

      <button class="btn primary" @click="login">로그인</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter, useRoute } from "vue-router"   // 🔥 useRoute 추가
import { useAuthStore } from "@/stores/authStore"

const id = ref("")
const password = ref("")
const router = useRouter()
const route = useRoute()                            // 🔥 현재 라우트
const authStore = useAuthStore()

const login = async () => {
  if (!id.value || !password.value) {
    alert("아이디와 비밀번호를 모두 입력해주세요.")
    return
  }

  const res = await authStore.login({
    userEmail: id.value,
    password: password.value,
  })

  if (!res?.success) {
    alert(res?.message || "로그인 실패")
    return
  }

  /* 관리자 여부 체크 */
  if (!authStore.user || authStore.user.role !== "ADMIN") {
    alert("관리자만 로그인할 수 있습니다.")
    authStore.logout?.()
    return
  }

  /* ✅ redirect 처리 */
  const redirect = route.query.redirect
  alert("관리자 로그인 성공!")

  router.push(
      redirect
          ? String(redirect)   // ex) /entry/qr
          : "/admin"
  )
}
</script>

<style scoped>
.auth-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  margin: 20px 0;
  font-size: 20px;
  font-weight: bold;
}

.auth-box {
  width: 400px;
  padding: 30px;
  background: linear-gradient(180deg, #e0f3ff, #ffffff);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}

.input {
  padding: 10px 12px;
  border: 1px solid #bcd8e8;
  border-radius: 6px;
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn.primary {
  background: #87c9ff;
  color: #fff;
}
</style>

