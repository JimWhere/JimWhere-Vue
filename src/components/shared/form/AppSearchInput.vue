<template>
  <el-input
    class="app-search"
    v-model="internalValue"
    placeholder=""
    clearable
  >
    <template #prefix>
      <span class="search-placeholder">{{ placeholder }}</span>
    </template>
    <template #suffix>
      <el-button class="search-btn" type="text" @click="onSearch">
        <i class="el-icon-search"></i>
      </el-button>
    </template>
  </el-input>
</template>

<script setup>
import { computed, ref } from 'vue'
const props = defineProps({ modelValue: { type: String, default: undefined }, placeholder: { type: String, default: '검색' } })
const emit = defineEmits(['update:modelValue', 'search'])

const localValue = ref('')
const internalValue = computed({
  get() { return props.modelValue !== undefined ? props.modelValue : localValue.value },
  set(v) {
    if (props.modelValue !== undefined) emit('update:modelValue', v)
    else localValue.value = v
  }
})

function onSearch(){ emit('search', internalValue.value) }
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";

.app-search{ display:inline-block; min-width:420px }

/* make the input look like the pill design */
.app-search >>> .el-input__inner{
  background: #fff !important;
  border-radius: 40px !important;
  border: none !important;
  padding: 14px 18px !important;
  height: auto !important;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06) !important;
}

/* large placeholder area on the left */
.search-placeholder{
  font-size: 32px;
  color: var(--color-primary-500);
  padding-left: 6px;
  font-family: var(--app-font);
  font-weight: var(--app-font-weight-semibold);
}

/* suffix button style */
/* .app-search >>> .el-input__suffix .search-btn{ padding:0; margin-right:6px; color:var(--color-primary-500) } */
.app-search >>> .el-icon-search{ font-size:14px }

/* inner input text styling */
.app-search >>> .el-input__inner, .app-search >>> .el-input__inner *{ font-family: var(--app-font); }

/* responsive */
@media (max-width:720px){ .app-search{ min-width:260px } .search-placeholder{ font-size:20px } }
</style>
