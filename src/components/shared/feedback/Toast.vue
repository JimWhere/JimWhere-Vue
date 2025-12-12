<template>
  <el-notification
    class="app-toast"
    :title="title"
    :message="message"
    :type="type"
    :duration="duration"
    position="top-right"
    :offset="offset"
  />
</template>

<script setup>
const props = defineProps({ title: { type: String, default: '' }, message: { type: String, default: '' }, type: { type: String, default: 'success' }, duration: { type: Number, default: 3000 }, offset: { type: Number, default: 40 } })
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";

.app-toast{ font-family: var(--app-font); }
.app-toast :deep() .el-notification__title{ font-weight: var(--app-font-weight-semibold); }
.app-toast :deep() .el-notification__content{ color: var(--color-text-muted) }
</style>
