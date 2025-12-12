<template>
  <div class="inquiry-detail">
    <h2 class="inquiry-detail__title">문의 사항 답변</h2>

    <el-card class="inquiry-detail__card" shadow="never">

      <div class="inquiry-detail__section">
        <label class="inquiry-detail__label">문의 사항 제목</label>
        <div class="writer-info">
          <AppLabel class="no-icon">작성자 : {{ user }}</AppLabel>
          <AppLabel class="no-icon">작성일자 : {{createdAt }}</AppLabel>
        </div>
        <el-input
            v-model="title"
            disabled
            type="textarea"
            class="inquiry-detail__textarea"
        />
      </div>
      <!--            class="inquiry-detail__input"-->

      <div class="inquiry-detail__section">
        <label class="inquiry-detail__label">문의사항 내용</label>
        <el-input
            v-model="content"
            disabled
            type="textarea"
            :rows="10"
            class="inquiry-detail__textarea"
        />
      </div>

      <div class="inquiry-detail__section">
        <label class="inquiry-detail__label">문의사항 답변</label>
        <div class="writer-info">
          <AppLabel class="no-icon">작성자 : {{ admin }}</AppLabel>
          <AppLabel class="no-icon">답변 일자 : {{answeredAt }}</AppLabel>
        </div>
        <el-input
            v-model="answer"
            :disabled="!editMode"
            type="textarea"
            :rows="10"
            class="inquiry-detail__textarea"
        />
      </div>

      <div class="inquiry-detail__btn-wrap">


        <template v-if="!editMode">
          <el-button type="danger" @click="deleteNotice">삭제</el-button>
          <el-button type="primary" @click="editMode = true">답변 달기</el-button>
        </template>


        <template v-else>
          <el-button @click="cancelEdit">취소</el-button>
          <el-button type="primary" @click="saveNotice">저장</el-button>
        </template>

        <el-button @click="goBack">목록으로</el-button>
      </div>

    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  adminInquiryAnswer,
  adminInquiryDelete,
} from "@/api/admin.js";
import {inquiryDetail} from "@/api/inquiry.js";
import AppLabel from "@/components/shared/basic/AppLabel.vue";

const route = useRoute();
const router = useRouter();

const editMode = ref(false);
const originalTitle = ref("");
const originalContent = ref("");
const originalAnswer = ref("");
const inquiry=ref({
  inquiryTitle:"",
  inquiryContent:"",
  inquiryAnswer:"",
  userName:"",
  createdAt:"",
  answerName:"",
  answeredAt:"",
})
const title = ref("");
const content = ref("");
const answer = ref("");
const user = ref("");
const createdAt = ref("");
const admin = ref("");
const answeredAt = ref("");

const fetchDetail = async () => {
  try {
    const res = await inquiryDetail(route.query.inquiryCode);
    const data = res.data.data;

    title.value = originalTitle.value = data.inquiryTitle;
    content.value = originalContent.value = data.inquiryContent;
    answer.value = originalAnswer.value =data.inquiryAnswer;
     user.value=data.userName;
    createdAt.value = data.createdAt ? data.createdAt.split("T")[0] : "";
    admin.value=data.answerName;
    answeredAt.value = data.answeredAt ? data.answeredAt.split("T")[0] : "";

  } catch (err) {
    console.error("문의 상세 조회 실패", err);
  }
};

const cancelEdit = () => {
  title.value = originalTitle.value;
  content.value = originalContent.value;
  editMode.value = false;
};

const saveNotice = async () => {
  try {
    await adminInquiryAnswer(route.query.inquiryCode, {
      answer: answer.value
    });


    alert("수정 성공!");

    await router.push({name: "AdminInquiry"});

  } catch (err) {
    console.error("수정 실패", err);
    alert("수정 실패");
  }
};

const deleteNotice = async () => {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  try {
    await adminInquiryDelete(route.query.inquiryCode);
    alert("삭제 완료!");
    router.push({ name: "AdminInquiry" });

  } catch (err) {
    console.error("삭제 실패", err);
    alert("삭제 실패");
  }
};


const goBack = () => {
  router.push({ name: "AdminInquiry" });
};

onMounted(fetchDetail);
</script>


<style scoped>
.inquiry-detail {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 32px;
  border-radius: 10px;
  box-sizing: border-box;
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

.available-box-wrapper {
  margin-left: auto;
}
.inventory__header :deep(.app-label__icon) {
  display: none;
}
.writer-info {
  display: flex;
  gap: 12px;
  justify-content: flex-end; /* 오른쪽 끝 정렬 */
  margin-bottom: 8px;
}

/* 아이콘 제거 */
:deep(.no-icon .app-label__icon) {
  display: none !important;
}

/* AppLabel 크기 조정 */
:deep(.no-icon.app-label) {
  padding: 4px 10px;
  font-size: 13px;
}
</style>
