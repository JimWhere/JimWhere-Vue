<template>
  <div class="auth-container">
    <h2 class="title">로그인</h2>

    <div class="auth-box">
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

      <button class="btn secondary" @click="goRegister">회원가입</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const id = ref("")
const password = ref("")
const router = useRouter()

const login = () => {
  if (!id.value || !password.value) {
    alert("아이디와 비밀번호를 모두 입력해주세요.")
    return
  }

  alert(`로그인 시도됨\n아이디: ${id.value}\n비밀번호: ${password.value}`)
}


const goRegister = () => {
  router.push("/register")
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

.btn.secondary {
  background: #d6eaff;
  color: #333;
}
</style>
