<template>
  <div class="notice-detail">
    <h2 class="notice-detail__title">공지사항 관리</h2>

    <el-card class="notice-detail__card" shadow="never">

      <!-- 공지사항 제목 -->
      <div class="notice-detail__section">
        <label class="notice-detail__label">공지사항 제목</label>
        <el-input
            v-model="title"
            class="notice-detail__input"
        />
      </div>

      <!-- 공지사항 내용 -->
      <div class="notice-detail__section">
        <label class="notice-detail__label">공지사항 내용</label>
        <el-input
            v-model="content"
            type="textarea"
            :rows="10"
            class="notice-detail__textarea"
        />
      </div>

      <div class="notice-detail__btn-wrap">

          <el-button @click="goBack">취소</el-button>
          <el-button type="primary" @click="saveNotice">저장</el-button>
      </div>

    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {adminNoticeCreate} from "@/api/admin.js";




const route = useRoute();
const router = useRouter();

const editMode = ref(false);

const originalTitle = ref("");
const originalContent = ref("");

const title = ref("");
const content = ref("");

const notice=ref({
  noticeTitle:"",
  noticeContent:"",
})

const saveNotice = async () => {
  try {
    await adminNoticeCreate( {
      noticeTitle: title.value,
      noticeContent: content.value,
    });
    await router.push({name: "AdminNotice"});
    location.reload();

    editMode.value = false;
    alert("생성 성공!");

  } catch (err) {
    console.error("생성 실패", err);
    alert("생성 실패");
  }
};


const goBack =  async () => {
  await router.push({ name: "AdminNotice" });
  location.reload();
};

onMounted();
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
