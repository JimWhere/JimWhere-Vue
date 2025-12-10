<template>
  <div class="ui-view">
    <h1>컴포넌트 프리뷰</h1>
    <p>
      기본 컴포넌트
      <code>
        src/components/shared/basic
      </code> 
      폼 컴포넌트
      <code>
        src/components/shared/form
      </code>
      피드백 컴포넌트
      <code>
        src/components/shared/feedback
      </code>
    </p>

    <div class="grid">
      <div v-for="c in comps" :key="c.id" class="card">
        <div class="card-title">{{ c.name }}</div>
        <div class="card-body">
          <template v-if="c.name === 'AppModal'">
            <el-button type="primary" @click="visibleModal = true">모달 열기</el-button>
            <component
              :is="c.comp"
              :visible="visibleModal"
              @update:visible="visibleModal = $event"
              @close="visibleModal = false"
            />
          </template>
          <template v-else-if="c.name === 'AppToast'">
            <el-button type="primary" @click="showToast()">토스트 보기</el-button>
          </template>
          <template v-else>
            <component :is="c.comp" v-bind="exampleProps[c.name] || {}" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
// Individually import the four App components to render as examples
import AppButton from '@/components/shared/basic/AppButton.vue'
import AppInput from '@/components/shared/basic/AppInput.vue'
import AppLabel from '@/components/shared/basic/AppLabel.vue'
import AppText from '@/components/shared/basic/AppText.vue'
// Import form components as examples
import AppCheckbox from '@/components/shared/form/AppCheckbox.vue'
import AppDropdown from '@/components/shared/form/AppDropdown.vue'
import AppPagination from '@/components/shared/form/AppPagination.vue'
import AppSearchInput from '@/components/shared/form/AppSearchInput.vue'
import AppTag from '@/components/shared/form/AppTag.vue'
import AppToggle from '@/components/shared/form/AppToggle.vue'
import AppAlert from '@/components/shared/feedback/AppAlert.vue'
import AppModal from '@/components/shared/feedback/AppModal.vue'
import AppToast from '@/components/shared/feedback/AppToast.vue'

// Render basic + form components as examples
const comps = [
  { id: 0, name: 'AppButton', comp: AppButton },
  { id: 1, name: 'AppInput', comp: AppInput },
  { id: 2, name: 'AppLabel', comp: AppLabel },
  { id: 3, name: 'AppText', comp: AppText },
  { id: 4, name: 'AppCheckbox', comp: AppCheckbox },
  { id: 5, name: 'AppDropdown', comp: AppDropdown },
  { id: 6, name: 'AppPagination', comp: AppPagination },
  { id: 7, name: 'AppSearchInput', comp: AppSearchInput },
  { id: 8, name: 'AppTag', comp: AppTag },
  { id: 9, name: 'AppToggle', comp: AppToggle },
  { id: 10, name: 'AppAlert', comp: AppAlert },
  { id: 11, name: 'AppModal', comp: AppModal },
  { id: 12, name: 'AppToast', comp: AppToast },
]

// Example props for some known components
const exampleProps = {
  AppButton: { variant: 'primary' },
  AppInput: { placeholder: '값' },
  AppLabel: {},
  AppText: {},
  AppCheckbox: {},
  AppDropdown: { options: [{ label: '옵션1', value: 1 }, { label: '옵션2', value: 2 }], label: 'dropdown' },
  AppPagination: { current: 1, total: 10 },
  AppSearchInput: { placeholder: '검색' },
  AppTag: { removable: true },
  AppToggle: {},
  AppAlert: { title: '알림', description: '샘플 알림 메시지', type: 'info' },
  AppModal: { visible: false, title: '샘플 모달' },
  AppToast: { title: '완료', message: '작업이 완료되었습니다', type: 'success', duration: 3000 },
}

// local state to open the modal preview
const visibleModal = ref(false)

function showToast(){
  const p = exampleProps.AppToast || {}
  ElNotification({
    title: p.title || '',
    message: p.message || '',
    type: p.type || 'success',
    duration: p.duration ?? 3000,
    position: 'top-right',
    offset: p.offset ?? 40,
  })
}
</script>

<style scoped>
.ui-view{ padding:20px }
.grid{ display:grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap:18px }
.card{ background: #fff; border-radius:12px; padding:12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06) }
.card-title{ font-weight:700; margin-bottom:8px }
.card-body{ min-height:80px; display:flex; align-items:center; justify-content:center }
</style>
