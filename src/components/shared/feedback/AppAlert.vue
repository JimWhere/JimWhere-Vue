<template>
  <el-alert
    class="app-alert"
    :title="title"
    :description="description"
    :type="type"
    :closable="closable"
    @close="handleClose"
  />
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  type: { type: String, default: 'info' },
  closable: { type: Boolean, default: true }
})
const emit = defineEmits(['close'])
function handleClose(){ emit('close') }
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";

.app-alert{
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.06);
  font-family: var(--app-font);
  font-weight: var(--app-font-weight-regular);
  position: relative;
}

/* accent bar on the left to match theme concept */
.app-alert::before{
  content: '';
  position: absolute;
  left: 12px; top: 12px; bottom: 12px;
  width: 6px;
  border-radius: 6px;
  background: var(--color-primary);
}

.app-alert >>> .el-alert__content{ margin-left: 20px }
.app-alert >>> .el-alert__title{ font-weight: var(--app-font-weight-semibold); font-size: 16px; color: var(--color-text) }
.app-alert >>> .el-alert__description{ color: var(--color-text-muted); font-size: 14px }
</style>