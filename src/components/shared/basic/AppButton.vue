<template>
  <el-button class="app-btn" :type="variant" :size="elSize" :disabled="disabled" @click="$emit('click', $event)">
    <slot>버튼</slot>
  </el-button>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | danger
  size: { type: String, default: 'md' }, // sm | md | lg
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['click'])

const elSize = computed(() => (props.size === 'sm' ? 'small' : props.size === 'lg' ? 'large' : 'medium'))
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";
/* Keep visual adjustments minimal — theme handles colors */

.app-btn{
  transition: transform .08s ease, box-shadow .12s ease, filter .08s ease;
  box-shadow: 0 6px 12px rgba(0,0,0,0.06);
  font-family: var(--app-font);
  font-weight: var(--app-font-weight-semibold); 
}
.app-btn:hover{
  transform: translateY(-2px);
  filter: brightness(1.02);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
}
.app-btn:active{
  transform: translateY(0);
  box-shadow: 0 6px 12px rgba(0,0,0,0.06);
}
.app-btn[disabled]{
  opacity: .6; cursor: not-allowed; box-shadow: none; transform: none;
}

</style>
