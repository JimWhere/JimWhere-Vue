<template>
  <el-switch class="app-toggle" v-model="internalValue" />
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

</style>
