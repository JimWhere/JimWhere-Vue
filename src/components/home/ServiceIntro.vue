<template>
  <section class="service-intro">

    <h2 class="title">서비스 소개</h2>
    <p class="subtitle">개인사업자를 위한 스마트 공간대여 & 재고관리 서비스</p>

    <div class="feature-boxes">
      <div class="feature">24시간 이용</div>
      <div class="feature">체계적 구역관리</div>
      <div class="feature">단독 개인공간</div>
      <div class="feature">출입 인증 시스템</div>
      <div class="feature">재고 파악</div>
    </div>

    <div class="description">
      JIMWHERE(짐웨어)는 개인 사업자 전용 스마트 공간대여 서비스로,
      사업자가 보유한 상품, 재고, 장비, 물품을 안전하게 보관할 수 있는<br />
      전용 창고 공간으로
      단순한 창고 임대가 아니라,<br />
      <strong>입·출고 관리 + 재고 현황 + 출입 인증</strong>까지 통합된 올인원 시스템을 제공합니다.
    </div>

  </section>
</template>

<script setup>
</script>

<style scoped>
.service-intro {
  width: 100%;
  padding: 60px 20px;
  text-align: center;
  border-radius: 12px;
  margin: 40px auto;
  max-width: 1100px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 15px;
  color: #555;
  margin-bottom: 30px;
}

.feature-boxes {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 30px;
}

.feature {
  background: #ffffff;
  padding: 40px 24px;
  border-radius: 14px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.08);
  font-size: 15px;
  font-weight: 600;
  min-width: 120px;
}

.description {
  color: #333;
  line-height: 1.6;
  font-size: 14px;
}
</style>
