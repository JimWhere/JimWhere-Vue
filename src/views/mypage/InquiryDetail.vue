<template>
  <div class="inquiry-detail">
    <h2 class="inquiry-detail__title">문의 사항 상세</h2>

    <el-card class="inquiry-detail__card" shadow="never">

      <div class="inquiry-detail__section">
        <label class="inquiry-detail__label">문의 사항 제목</label>
        <el-input
            v-model="title"
            :disabled="!editMode"
            class="inquiry-detail__input"
        />
      </div>


      <div class="inquiry-detail__section">
        <label class="inquiry-detail__label">문의사항 내용</label>
        <el-input
            v-model="content"
            :disabled="!editMode"
            type="textarea"
            :rows="10"
            class="inquiry-detail__textarea"
        />
      </div>

      <div class="inquiry-detail__section">
        <label class="inquiry-detail__label">문의사항 답변</label>
        <el-input
            v-model="answer"
            :disabled="!editMode"
            type="textarea"
            :rows="10"
            class="inquiry-detail__textarea"
        />
      </div>

      <div class="inquiry-detail__btn-wrap">

        <el-button @click="goBack">목록으로</el-button>
      </div>

    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {inquiryDetail} from "@/api/inquiry.js";

const route = useRoute();
const router = useRouter();

const editMode = ref(false);
const originalTitle = ref("");
const originalContent = ref("");
const originalAnswer = ref("");

const title = ref("");
const content = ref("");
const answer = ref("");

const fetchDetail = async () => {
  try {
    const res = await inquiryDetail(route.query.inquiryCode);
    const data = res.data.data;

    title.value = originalTitle.value = data.inquiryTitle;
    content.value = originalContent.value = data.inquiryContent;
    answer.value = originalAnswer.value = data.inquiryAnswer;

  } catch (err) {
    console.error("문의 상세 조회 실패", err);
  }
};


const goBack = () => {
  router.push({ name: "Inquiry" });
};

onMounted(fetchDetail);
</script>


<style scoped>
.inquiry-detail {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 30px 40px;
}

.inquiry-detail__title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #5ba0ff;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}

.inquiry-detail__card {
  padding: 24px;
  border-radius: 16px;
}

.inquiry-detail__section {
  margin-bottom: 20px;
}

.inquiry-detail__label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 6px;
}

.inquiry-detail__input,
.inquiry-detail__textarea {
  background: #f4f7fc;
  border-radius: 8px;
}

.inquiry-detail__btn-wrap {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
