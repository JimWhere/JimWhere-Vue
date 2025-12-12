<template>
  <section class="howto-container">
    <h2 class="title">이용 방법</h2>

    <div class="step-wrapper">
      <div v-for="step in steps" :key="step.number" class="step-card">

        <div class="icon-circle">
          <span class="icon">{{ step.icon }}</span>
        </div>

        <div class="step-number">
          {{ step.number }}
        </div>

        <div class="step-title">
          {{ step.title }}
        </div>

        <div class="step-desc" v-html="step.desc"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    number: "01",
    title: "회원가입",
    desc: "사업자 인증 필수",
    icon: "👤"
  },
  {
    number: "02",
    title: "예약",
    desc: "사용하실 방 타입 / 날짜 선택 후 예약",
    icon: "📅"
  },
  {
    number: "03",
    title: "보관",
    desc: "지정된 섹션·박스 단위로 <br> 보관 및 재고 작성",
    icon: "📦"
  },
  {
    number: "04",
    title: "24시간 출입",
    desc: "출입 시 출입 양식 작성 <br>/ 임시 출입코드 수령",
    icon: "🚪"
  },
];
</script>

<style scoped>
.howto-container {
  width: 100%;
  padding: 40px 20px;
  background: linear-gradient(to bottom, #ffffff, #e6f5ff);
  border-radius: 12px;
}

.title {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 30px;
}

.step-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.step-card {
  flex: 1;
  min-width: 200px;
  max-width: 250px;
  background: #bde0ff;
  border-radius: 50%;
  padding: 35px 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.icon-circle {
  width: 60px;
  height: 60px;
  background: #ffffffaa;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  font-size: 28px;
}

.step-number {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
}

.step-title {
  font-size: 16px;
  font-weight: 700;
}

.step-desc {
  font-size: 12px;
  color: #333;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .step-wrapper {
    justify-content: center;
  }
  .step-card {
    margin-bottom: 15px;
  }
}
</style>
