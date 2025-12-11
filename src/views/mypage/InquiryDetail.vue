<template>
  <div class="notice-detail">
    <h2 class="notice-detail__title">문의 사항 </h2>

    <el-card class="notice-detail__card" shadow="never">

      <div class="notice-detail__section">
        <label class="notice-detail__label">문의 사항 제목</label>
        <el-input
            v-model="title"
            :disabled="!editMode"
            class="notice-detail__input"
        />
      </div>


      <div class="notice-detail__section">
        <label class="notice-detail__label">문의사항 내용</label>
        <el-input
            v-model="content"
            :disabled="!editMode"
            type="textarea"
            :rows="10"
            class="notice-detail__textarea"
        />
      </div>

      <div class="notice-detail__section">
        <label class="notice-detail__label">문의사항 답변</label>
        <el-input
            v-model="answer"
            :disabled="!editMode"
            type="textarea"
            :rows="10"
            class="notice-detail__textarea"
        />
      </div>

      <div class="notice-detail__btn-wrap">

        <el-button @click="goBack">목록으로</el-button>
      </div>

    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  inquiryDetail
} from "@/api/admin.js";

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
.notice-detail {
  background: #fff;
  padding: 24px 32px;
  border-radius: 12px;
}

.notice-detail__title {
  font-size: 20px;
  font-weight: 600;
  color: #5a9dfb;
  margin-bottom: 16px;
}

.notice-detail__card {
  padding: 24px;
  border-radius: 16px;
}

.notice-detail__section {
  margin-bottom: 20px;
}

.notice-detail__label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 6px;
}

.notice-detail__input,
.notice-detail__textarea {
  background: #f4f7fc;
  border-radius: 8px;
}

.notice-detail__btn-wrap {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
