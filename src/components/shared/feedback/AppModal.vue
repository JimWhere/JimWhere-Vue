<template>
  <el-dialog :model-value="visible" :title="title" @close="handleClose" custom-class="app-modal">
    <div class="app-modal__body"><slot /></div>
    <template #footer>
      <div class="app-modal__footer">
<!--        <el-button @click="handleClose">취소</el-button>-->
<!--        <el-button type="primary" @click="$emit('confirm')">확인</el-button>-->
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { watch } from 'vue'
const props = defineProps({ visible: { type: Boolean, default: false }, title: { type: String, default: '' } })
const emit = defineEmits(['update:visible','confirm','close'])
function handleClose(){ emit('update:visible', false); emit('close') }

// ensure v-model:visible support
watch(() => props.visible, (v)=>{})
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";
@import "@/assets/shared/styles/font.css";

.app-modal{
  border-radius: 12px;
  overflow: hidden;
  font-family: var(--app-font);
}
.app-modal .el-dialog__body{ background: #fff; padding: 20px }
.app-modal__footer{ display:flex; gap:12px; justify-content:flex-end; padding: 12px 20px; }
</style>
