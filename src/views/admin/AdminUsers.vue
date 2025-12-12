<script setup>
import {ref, onMounted} from "vue";
import {fetchAdminUsers, updateAdminUser} from "@/api/adminUserApi";

const page = ref(1);
const size = 10;
const pageCount = ref(1);

const statusFilter = ref("");
const sortFilter = ref("");
const users = ref([]);

// 유저 목록 불러오기
const loadUsers = async () => {
  try {
    const {data} = await fetchAdminUsers(
        page.value - 1,
        size,
        statusFilter.value,
        sortFilter.value
    );

    const res = data.data;
    users.value = res.content;
    pageCount.value = res.totalPages;

    // select 박스와 싱크 맞추기 위해 value 강제 문자열화
    users.value.forEach(u => {
      u.role = String(u.role);     // ADMIN / USER
      u.status = String(u.status); // Y / N
    });

  } catch (e) {
    console.error("유저 불러오기 실패:", e);
  }
};

onMounted(() => loadUsers());

// 페이지 이동
const movePage = async (p) => {
  page.value = p;
  await loadUsers();
};

const prevPage = async () => {
  if (page.value > 1) {
    page.value--;
    await loadUsers();
  }
};

const nextPage = async () => {
  if (page.value < pageCount.value) {
    page.value++;
    await loadUsers();
  }
};

// 상태/정렬 변경 시 자동 갱신
const changeFilter = async () => {
  page.value = 1;
  await loadUsers();
};

// 관리자 유저 수정 (role/status)
const updateUser = async (user) => {
  try {
    await updateAdminUser(user.userCode, {
      status: user.status,
      role: user.role
    });

    alert("수정이 완료되었습니다.");
    await loadUsers();
  } catch (e) {
    console.error("수정 실패:", e);
    alert("수정 중 오류가 발생했습니다.");
  }
};
</script>

<template>
  <div class="admin-users">
    <h2 class="section-title">회원관리</h2>

    <!-- 필터 -->
    <div class="filter-box">
      <select v-model="statusFilter" @change="changeFilter">
        <option value="">전체 상태</option>
        <option value="Y">활성</option>
        <option value="N">삭제/정지</option>
      </select>

      <select v-model="sortFilter" @change="changeFilter">
        <option value="">기본순</option>
        <option value="createdAt,desc">가입일시 최신순</option>
        <option value="createdAt,asc">가입일시 오래된순</option>
        <option value="startDt,desc">개업일 최신순</option>
        <option value="startDt,asc">개업일 오래된순</option>
        <option value="userId,asc">아이디 오름차순</option>
        <option value="userId,desc">아이디 내림차순</option>
      </select>
    </div>

    <!-- 유저 테이블 -->
    <div class="table-container">
      <table>
        <thead>
        <tr>
          <th>번호</th>
          <th>아이디</th>
          <th>대표자명</th>
          <th>사업자번호</th>
          <th>개업일</th>
          <th>가입일</th>
          <th>Role</th>
          <th>Status</th>
          <th>저장</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="u in users" :key="u.userCode">
          <td>{{ u.userCode }}</td>
          <td>{{ u.userId }}</td>
          <td>{{ u.pname }}</td>
          <td>{{ u.userBusinessNumber }}</td>
          <td>{{ u.startDt }}</td>
          <td>{{ u.createdAt }}</td>

          <!-- ROLE 선택 -->
          <td>
            <select v-model="u.role">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </td>

          <!-- STATUS 선택 -->
          <td>
            <select v-model="u.status">
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </td>

          <!-- 저장 버튼 -->
          <td>
            <button class="save-btn" @click="updateUser(u)">저장</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button class="btn" :disabled="page === 1" @click="prevPage">← 이전</button>

      <button
          v-for="p in pageCount"
          :key="p"
          @click="movePage(p)"
          class="page-number"
          :class="{ active: p === page }"
      >
        {{ p }}
      </button>

      <button class="btn" :disabled="page === pageCount" @click="nextPage">다음 →</button>
    </div>
  </div>
</template>

<style scoped>

.section-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 테이블 스타일 */
.table-container {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #dce9f5;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  padding-bottom: 10px;
  border-bottom: 2px solid #e6eef7;
  color: #555;
}

tbody tr {
  text-align: center;
  height: 48px;
  border-bottom: 1px solid #eef5fc;
}

tbody tr:last-child {
  border-bottom: none;
}

/* 페이지네이션 */
.pagination {
  margin-top: 20px;
  text-align: center;
}

.page-number {
  padding: 6px 10px;
  margin: 0 3px;
  border-radius: 6px;
  background: #edf4ff;
  border: none;
  cursor: pointer;
}

.page-number.active {
  background: #2b84ff;
  color: white;
}

.btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

.btn:disabled {
  color: #bbb;
  cursor: default;
}

.filter-box {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.filter-box select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #dce9f5;
}

/* Hover 시 행 하이라이트 */
tbody tr:hover {
  background: #f3f8ff; /* 은은한 하이라이트 */
  transform: scale(1.005); /* 아주 약간 확대 */
  transition: background 0.2s ease, transform 0.15s ease;
}

/* select와 버튼들 hover 시 더 자연스럽게 */
tbody select:hover {
  border-color: #2b84ff;
}

.save-btn {
  padding: 5px 10px;
  border-radius: 4px;
  background: #2b84ff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s ease, transform 0.15s ease;
}

.save-btn:hover {
  background: #1f6ad6;
  transform: scale(1.05);
}
</style>
