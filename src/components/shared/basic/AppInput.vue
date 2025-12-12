<template>
  <el-input class="app-input" v-model="internalValue" placeholder="값">
    <template #prefix>
      <slot name="prefix" />
    </template>
  </el-input>
</template>

<script setup>
import { ref } from 'vue'
// Local uncontrolled state so typing persists inside the component
const internalValue = ref('')
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";
/* theme provides colors/spacing */

.app-input{
  width:100%;
  display:block;
  /* outer themed border */
  border: 1px solid var(--color-primary-500);
  border-radius: 8px;
  padding: 6px; /* space around inner input */
  box-sizing: border-box;
  background: transparent;
  font-family: var(--app-font); 
  font-weight: var(--app-font-weight-semibold);
}

/* Hide inner el-input border and background so only outer border shows */
.app-input :deep(.el-input__inner) {
  width:100%;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  height: auto;
}

.app-input :deep(.el-input__inner:focus) {
  outline: none !important;
  box-shadow: none !important;
}

/* make placeholder slightly dimmer to match theme */
.app-input :deep(.el-input__inner)::placeholder{ color: rgba(0,0,0,0.35) }

</style>
