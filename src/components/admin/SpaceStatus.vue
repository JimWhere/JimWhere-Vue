<template>
  <div class="space-section">

    <h3 class="title">대여공간 현황</h3>

    <div class="space-grid">
      <div class="box large">A1</div>
      <div class="box large">B1</div>
      <div class="box medium red">B2</div>

      <div class="box small red">C1</div>
      <div class="box small red">C2</div>
      <div class="box small red">C3</div>
      <div class="box small red">C4</div>
    </div>

  </div>
</template>

<style scoped>
.space-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}

.title {
  margin-bottom: 15px;
  font-weight: bold;
}

.space-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.box {
  background: #c9dbff;
  border-radius: 10px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box.large { grid-column: span 2; height: 120px; }
.box.medium { grid-column: span 2; height: 80px; }
.box.small { height: 60px; }

.red { background: #ff9b9b; }
</style>
