<template>
  <div class="summary-grid">

    <div class="card">
      <h3>총 회원 수</h3>
      <div class="value">120명</div>
    </div>

    <div class="card">
      <h3>재고 현황</h3>
      <p>아이템1: 100개</p>
      <p>아이템2: 200개</p>
      <p>아이템3: 300개</p>
    </div>

    <div class="card">
      <h3>예약 현황</h3>
      <p>B2 : 예약완료</p>
      <p>C1 : 예약완료</p>
      <p>C3 : 예약완료</p>
    </div>

    <div class="card">
      <h3>문의 현황</h3>
      <p>user1 : 문의1</p>
      <p>user2 : 문의2</p>
      <p>user3 : 문의3</p>
    </div>

  </div>
</template>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}

.value {
  font-size: 28px;
  font-weight: bold;
}
</style>
