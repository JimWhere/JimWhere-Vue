<template>
  <el-checkbox class="app-checkbox" v-model="internalValue">
    <slot />
  </el-checkbox>
</template>

<script setup>
import { computed, ref } from 'vue'
const props = defineProps({ modelValue: { type: Boolean, default: undefined } })
const emit = defineEmits(['update:modelValue'])

// local fallback when parent doesn't provide v-model
const localValue = ref(false)
const internalValue = computed({
  get() { return props.modelValue !== undefined ? props.modelValue : localValue.value },
  set(v) {
    if (props.modelValue !== undefined) emit('update:modelValue', v)
    else localValue.value = v
  }
})
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";

/* Use only theme.css for visual styles. Keep minimal layout/spacing hooks. */
.app-checkbox{
  display:inline-flex;
  align-items:center;
  gap:10px;
  font-family:var(--app-font);
  font-weight:var(--app-font-weight-semibold);
}

/* small spacing for the built-in Element Plus label */
.app-checkbox .el-checkbox__label{ margin-left:8px }
</style>
