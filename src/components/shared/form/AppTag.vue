<template>
  <el-tag class="app-tag" :closable="removable" @close="handleClose">
    <slot>Tag</slot>
  </el-tag>
</template>

<script setup>
const props = defineProps({ removable: { type: Boolean, default: true } })
const emit = defineEmits(["close"])
function handleClose() { emit('close') }
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";

.app-tag{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 14px;
  background: var(--color-primary) !important;
  color: #fff !important;
  border-radius: 12px;
  font-family: var(--app-font);
  font-weight: var(--app-font-weight-semibold);
  font-size: 16px;
}

/* make close icon white as well */
.app-tag >>> .el-tag__close{
  color: #fff !important;
}
</style>
