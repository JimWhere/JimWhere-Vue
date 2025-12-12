<template>
  <section class="storage-notice-wrapper">

    <!-- 보관 제한 항목 -->
    <div class="notice-card">
      <h2 class="title">보관 제한 항목</h2>

      <div class="content red-text">
        동, 식물을 비롯한 각종생물<br>
        음식물 , 식품류<br>
        마약 총기 등 불법 물품<br>
        폭발위험있는 물품이나 인화성 물질<br>
        현금 유가 증권 및 고가의 현금화 물품
      </div>
      <br>
    </div>

    <!-- 주의 사항 -->
    <div class="notice-card mt">
      <h2 class="title">주의 사항</h2>

      <div class="content">
        창고 방문시 출입양식을 작성하시고 임시코드를 발급 받아오셔야 출입이 가능합니다.<br>
        대여 기간 이후 잔여 물품들은 폐기 됩니다.<br>
        대리인이 출입하려면 직접 임시코드를 전해줘야 합니다.
      </div>
      <br>
    </div>

  </section>
</template>

<style scoped>
.storage-notice-wrapper {
  width: 100%;
  padding: 40px 0;
  background: linear-gradient(180deg, #e6f3ff 0%, #ffffff 40%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

/* 공통 박스 스타일 */
.notice-card {
  width: 85%;
  max-width: 800px;
  background: #ffffff;
  padding: 30px 25px;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  text-align: center;
}

.mt { margin-top: 20px; }

.title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
}

.content {
  font-size: 16px;
  line-height: 1.7;
  font-weight: 500;
}

.red-text {
  color: #d60000;
  font-weight: 700;
}
</style>
<script setup lang="ts">
</script>