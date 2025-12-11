<template>
  <el-pagination
    class="app-pagination"
    v-model:current-page="internalCurrent"
    :page-count="totalPages"
    layout="prev, pager, next"
    background
    @current-change="onChange"
  />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
const props = defineProps({ current: { type: Number, default: undefined }, total: { type: Number, default: 10 } })
const emit = defineEmits(['update:current'])

// treat props.total as number of pages (to match existing component)
const totalPages = computed(() => props.total)

// internal fallback state that also reflects prop when provided
const localCurrent = ref(props.current ?? 1)
// sync when parent updates the prop (keeps visual in sync for controlled usage)
watch(() => props.current, (v) => { if (v !== undefined) localCurrent.value = v })

const internalCurrent = computed({
  get() { return localCurrent.value },
  set(v) {
    localCurrent.value = v
    emit('update:current', v)
  }
})

function onChange(page){
  // update internal state and emit — ensures visual active state updates even if parent doesn't control the prop
  internalCurrent.value = page
}
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";

.app-pagination{ display:flex; justify-content:center; align-items:center; font-family:var(--app-font); font-weight:var(--app-font-weight-semibold) }
/* style the pager buttons to match theme */
.app-pagination >>> .el-pager li a,
.app-pagination >>> .el-pager li span{ font-size:16px; padding:6px 10px }
.app-pagination >>> .el-pager li.active a{ background:var(--color-primary-200); border-radius:8px; color:var(--color-primary-800) }
.app-pagination >>> .el-icon{ color:var(--color-primary-800) }
</style>
