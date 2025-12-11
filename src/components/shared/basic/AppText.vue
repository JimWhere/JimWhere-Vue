<template>
  <span class="app-text">텍스트</span>
</template>

<script setup>
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";

.app-text{
  color: rgba(0,0,0,0.87);
  font-weight: 600;
  font-size: 20px;
  font-family: inherit;
  font-family: var(--app-font); 
  font-weight: var(--app-font-weight-semibold);
}
</style>
