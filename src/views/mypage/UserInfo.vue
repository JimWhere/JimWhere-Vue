<script setup>
import { ref, onMounted } from "vue";
import { getMyUserInfoApi, updateUserPhoneApi, deleteUserApi } from "@/api/userApi";
import router from "@/router";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const user = ref(null);
const editingPhone = ref(false);
const newPhone = ref("");

onMounted(async () => {
  try {
    const res = await getMyUserInfoApi();
    user.value = res.data.data;
  } catch (e) {
    console.error("내 정보 조회 실패", e);
    alert("로그인이 필요합니다.");
    router.replace("/login");
  }
});

// 전화번호 수정 요청
const updatePhone = async () => {
  if (!newPhone.value) {
    return alert("새 전화번호를 입력해주세요.");
  }

  try {
    await updateUserPhoneApi(newPhone.value);
    alert("전화번호 수정 완료!");

    // 화면에 반영
    user.value.userPhonNumber = newPhone.value;
    editingPhone.value = false;

  } catch (e) {
    console.error("전화번호 수정 실패", e);
    alert("전화번호 수정 실패");
  }
};

// 회원 탈퇴 요청
const withdraw = async () => {
  if (!confirm("정말 탈퇴하시겠습니까? 복구할 수 없습니다.")) return;

  try {
    await deleteUserApi();
    alert("탈퇴되었습니다.");

    // 토큰 제거 후 로그인 페이지로 이동
    authStore.logout();  // 토큰, 사용자 정보, 스토리지 모두 정리 시켜줌
    router.replace("/login");


  } catch (e) {
    console.error("탈퇴 실패", e);
    alert("회원 탈퇴 실패");
  }
};

</script>

<template>
  <div class="user-info-container" v-if="user">
    <section class="info-section">
      <h3 class="section-title">내정보</h3>

      <div class="info-row">
        <span class="label">아이디</span>
        <span class="value">{{ user.userId }}</span>
      </div>

      <div class="info-row phone-row">
        <span class="label">전화번호</span>

        <template v-if="editingPhone">
          <input
              v-model="newPhone"
              class="input"
              placeholder="새 전화번호 입력"
          />

          <button class="btn edit small-btn" @click="updatePhone">저장</button>
          <button class="btn danger small-btn" @click="editingPhone = false">취소</button>
        </template>

        <template v-else>
          <span class="value phone-value">{{ user.userPhonNumber }}</span>
          <button class="btn edit small-btn" @click="editingPhone = true">수정</button>
        </template>
      </div>
    </section>

    <section class="info-section">
      <h3 class="section-title">사업자정보</h3>

      <div class="info-row">
        <span class="label">사업자번호</span>
        <span class="value">{{ user.userBusinessNumber }}</span>
      </div>

      <div class="info-row">
        <span class="label">대표자명</span>
        <span class="value">{{ user.pname }}</span>
      </div>

      <div class="info-row">
        <span class="label">개업일자</span>
        <span class="value">{{ user.startDt }}</span>
      </div>
    </section>

    <div class="button-area">
      <button class="btn danger" @click="withdraw">탈퇴</button>
    </div>
  </div>

  <div v-else>
    로딩중...
  </div>
</template>

<style scoped>
.user-info-container {
  width: 100%;
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  align-items: center;     /* 가로 중앙 */
  justify-content: center; /* 세로 중앙 */
}

/* 섹션 타이틀 */
.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #5ba0ff;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}

/* 정보 줄 */
.info-row {
  width: 400px; /* 추가 */
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 20px;
}

.label {
  width: 120px;
  text-align: right;
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.value {
  width: 200px;
  background: #f3f6f9;
  padding: 8px 12px;
  border-radius: 8px;
  text-align: left;
  font-size: 15px;
  color: #444;
}

/* 버튼 영역 */
.button-area {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  width: 350px;
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

/* 전화번호 줄 전용 정렬 */
.phone-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 전화번호 input 박스 너비 조절 */
.phone-value {
  width: 180px;
}

/* 작은 버튼 스타일 */
.small-btn {
  padding: 6px 12px;
  font-size: 13px;
  height: 36px;
  display: flex;
  align-items: center;
}


/* 탈퇴 버튼 */
.btn.danger {
  background-color: #ff6b6b;
  color: white;
}

/* 수정 버튼 */
.btn.edit {
  background-color: #86c8ff;
  color: white;
}
</style>
