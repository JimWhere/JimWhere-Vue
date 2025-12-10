<template>
  <div class="auth-container">
    <h2 class="title">회원가입</h2>

    <div class="auth-box">
      <input v-model="form.userId" placeholder="아이디를 입력해주세요" class="input" />

      <input type="password" v-model="form.password" placeholder="비밀번호를 입력해주세요" class="input" />

      <div class="row">
        <input v-model="form.phone" placeholder="전화번호를 입력해주세요" class="input" />
        <button class="btn small">중복 확인</button>
      </div>

      <div class="row">
        <input v-model="form.business" placeholder="사업자번호를 입력해주세요" class="input" />
        <button class="btn small">진위 여부</button>
      </div>

      <input v-model="form.pname" placeholder="대표자명을 입력해주세요" class="input" />

      <div class="row">
        <input v-model="form.address" placeholder="주소 검색" class="input" />
        <button class="btn small">검색</button>
      </div>

      <input v-model="form.detail" placeholder="상세주소" class="input" />

      <button class="btn primary" @click="register">가입</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"

const form = reactive({
  userId: "",
  password: "",
  phone: "",
  business: "",
  pname: "",
  address: "",
  detail: "",
})

const register = () => {
  alert(`
회원가입 입력값
------------------
아이디: ${form.userId}
비밀번호: ${form.password}
전화번호: ${form.phone}
사업자번호: ${form.business}
대표자명: ${form.pname}
주소: ${form.address}
상세주소: ${form.detail}
  `)
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

.row {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn.small {
  background: #d8eefd;
  width: 110px;
}

.btn.primary {
  background: #87c9ff;
  color: white;
}
</style>
