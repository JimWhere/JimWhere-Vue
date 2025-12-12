<template>
  <footer class="footer">
    <div class="footer-content">

      <div class="brand">JIMWHERE</div>

      <div class="links">
        <span @click="go('/notice')">공지사항</span>
        <span @click="go('/inquiry')">문의하기</span>
        <span @click="go('/terms')">이용약관</span>
        <span @click="go('/privacy')">개인정보처리방침</span>
      </div>

      <div class="copy">© 2025 JIMWHERE. All rights reserved.</div>

    </div>
  </footer>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const go = (path) => router.push(path);
</script>

<style scoped>
.footer {
  width: 100%;
  background: linear-gradient(180deg, #f4f9ff 0%, #e8f2ff 100%);
  padding: 40px 20px;
  margin-top: 60px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.footer-content {
  max-width: 1080px;
  margin: 0 auto;
  text-align: center;
}

.brand {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #4A72FF;
}

.links {
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.links span {
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.links span:hover {
  text-decoration: underline;
}

.copy {
  font-size: 12px;
  color: #777;
}
</style>
