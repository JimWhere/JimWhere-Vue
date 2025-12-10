<template>
  <div class="layout-root">
    <div class="bg-gradient" />

    <div class="header-wrap">
      <slot name="header" />
    </div>

    <div class="page-wrap">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.layout-root {
  position: relative;
  min-height: 100vh;
  padding: 0 10px;
}

.bg-gradient {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid) 60%, var(--bg-gradient-end) 100%);
}

.header-wrap {
  position: relative;
  z-index: 2; /* 헤더 최상단 */
}

.page-wrap {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-wrap > *:first-child {
  margin-top: 18px;
}
</style>