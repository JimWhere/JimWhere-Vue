<template>
  <label class="app-label">
    <span class="app-label__icon" aria-hidden="true">✓</span>
    <span class="app-label__text"><slot>Label</slot></span>
  </label>
</template>

<script setup>
// intentionally empty
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";

.app-label{
  display:inline-flex;
  align-items:center;
  gap:12px;
  padding:10px 20px;
  background: var(--color-primary);
  color: #fff; /* unify with button text color */
  border-radius: calc(var(--border-radius) + 4px);
  font-size: 20px;
  box-shadow: none;
  font-family: var(--app-font);
  font-weight: var(--app-font-weight-semibold);
}
.app-label__icon{ font-size:20px; line-height:1; color: inherit }
.app-label__text{ font-weight:600; color: inherit }
</style>
