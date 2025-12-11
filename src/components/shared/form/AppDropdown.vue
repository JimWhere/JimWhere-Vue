<template>
  <el-select
    class="app-dropdown"
    v-model="internalValue"
    :placeholder="label"
    @change="onChange"
    :popper-class="popperClass"
    clearable
  >
    <el-option
      v-for="opt in options"
      :key="opt.value"
      :label="opt.label"
      :value="opt.value"
    />
  </el-select>
</template>

<script setup>
import { computed, ref } from 'vue'
const props = defineProps({
  options: { type: Array, default: () => [] },
  label: { type: String, default: 'dropdown' },
  modelValue: { type: [String, Number], default: undefined }
})
const emit = defineEmits(['update:modelValue', 'change'])

const localValue = ref(undefined)
const internalValue = computed({
  get() { return props.modelValue !== undefined ? props.modelValue : localValue.value },
  set(v) {
    if (props.modelValue !== undefined) emit('update:modelValue', v)
    else localValue.value = v
  }
})

const popperClass = 'app-dropdown-popper'

function onChange(val){
  const opt = props.options.find(o => o.value === val) || null
  emit('change', opt)
}
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";

.app-dropdown{ display:inline-block; min-width:260px }

/* Style the select input to look like the pill dropdown in the design */
.app-dropdown :deep(.el-input__inner){
  background: var(--color-primary-200) !important;
  border-radius: 40px !important;
  border: none !important;
  padding: 14px 24px !important;
  font-size: 28px !important;
  color: #fff !important;
  box-shadow: 0 10px 22px rgba(0,0,0,0.12) !important;
  height: auto !important;
}

/* placeholder color */
.app-dropdown :deep(.el-input__inner)::placeholder{ color: rgba(255,255,255,0.9) }

/* caret / suffix color */
.app-dropdown :deep(.el-input__suffix){ color: rgba(0,0,0,0.8) }

/* popper (dropdown panel) styling */
.app-dropdown-popper{
  border-radius: 10px !important;
  box-shadow: 0 8px 18px rgba(0,0,0,0.08) !important;
}
.app-dropdown-popper :deep(.el-select-dropdown__item){
  padding: 10px 14px !important;
}
.app-dropdown-popper :deep(.el-select-dropdown__item):hover{
  background: rgba(0,0,0,0.02) !important;
}

/* font */
.app-dropdown :deep(.el-input__inner), .app-dropdown :deep(.el-input__inner) *{ font-family: var(--app-font); font-weight: var(--app-font-weight-semibold) }
</style>
