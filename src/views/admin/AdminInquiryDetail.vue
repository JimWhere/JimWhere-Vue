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


        <template v-if="!editMode">
          <el-button type="danger" @click="deleteNotice">삭제</el-button>
          <el-button type="primary" @click="editMode = true">수정</el-button>
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
  inquiryDetail
} from "@/api/admin.js";

const route = useRoute();
const router = useRouter();

const editMode = ref(false);
const originalTitle = ref("");
const originalContent = ref("");

const title = ref("");
const content = ref("");
const answer = ref("");

const fetchDetail = async () => {
  try {
    const res = await inquiryDetail(route.query.inquiryCode);
    const data = res.data.data;

    title.value = originalTitle.value = data.inquiryTitle;
    content.value = originalContent.value = data.inquiryContent;

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


    editMode.value = false;
    alert("수정 성공!");

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
