
<template>
  <div class="inquiry-wrap">

    <div class="title-area">
      <h2>문의사항 작성</h2>
      <el-button type="primary" class="save-btn" @click="submitInquiry">
        저장
      </el-button>
    </div>


    <div class="form-area">


      <div class="form-row">
        <label class="form-label">문의사항 제목</label>
        <el-input
            v-model="title"
            placeholder="제목을 입력해주세요."
            class="input-title"
        />
      </div>

      <div class="form-row">
        <label class="form-label">문의사항 내용</label>
        <el-input
            type="textarea"
            v-model="content"
            :rows="10"
            placeholder="문의 내용을 입력해주세요."
            class="input-content"
        />
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { inquiryCreate } from '@/api/myPage.js'


const router = useRouter()
const title = ref('')
const content = ref('')
const sr=ref({
  inquiryTitle:"",
  inquiryContent:"",
})

const submitInquiry = async () => {
  if (!title.value.trim()) {
    alert("제목을 입력해주세요.")
    return
  }
  if (!content.value.trim()) {
    alert("내용을 입력해주세요.")
    return
  }

  try {
    sr.value.inquiryTitle=title.value;
    sr.value.inquiryContent=content.value;
    await inquiryCreate(
        sr.value
    )
    alert("문의가 등록되었습니다.")
    router.push({ name: 'Home' })
  } catch (e) {
    console.error(e)
    alert("문의 등록 중 오류가 발생했습니다.")
  }
}
</script>

<style scoped>

.inquiry-wrap {
  padding: 24px 32px;
  background: #ffffff;
  border-radius: 12px;
}


.title-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title-area h2 {
  font-size: 20px;
  font-weight: 600;
  color: #5ba0ff;
  margin: 0;
}


.save-btn {
  background-color: #5ba0ff;
  border-color: #5ba0ff;
  font-weight: 600;
}

.form-area {
  background: #f4f9ff;
  padding: 24px;
  border-radius: 12px;
}


.form-row {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 8px;
}


.input-title,
.input-content {
  background: #eef4ff;
  border-radius: 8px;
}


:deep(.el-textarea__inner) {
  background: #eef4ff !important;
  border-radius: 8px !important;
}
</style>
