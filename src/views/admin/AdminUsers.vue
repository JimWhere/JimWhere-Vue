<template>
  <div class="admin-users">

    <!-- 상단 제목 -->
    <h2 class="section-title">회원관리</h2>

    <!-- 테이블 박스 -->
    <div class="table-container">
      <table>
        <thead>
        <tr>
          <th>회원번호</th>
          <th>아이디</th>
          <th>상호명</th>
          <th>사업자등록번호</th>
          <th>가입일시</th>
          <th>수정일시</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.storeName }}</td>
          <td>{{ user.bizNum }}</td>
          <td>{{ user.createdAt }}</td>
          <td>{{ user.updatedAt }}</td>
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

      <button class="btn" :disabled="page === pageCount" @click="nextPage">
        다음 →
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";

const page = ref(1);
const pageCount = 10;

// 임시 데이터
const users = ref([
  { id: 1, username: "userID", storeName: "JimWhere", bizNum: "123-45-67890", createdAt: "2025/11/10", updatedAt: "2025/11/10" },
  { id: 2, username: "userID", storeName: "JimWhere", bizNum: "123-45-67890", createdAt: "2025/11/10", updatedAt: "2025/11/10" },
  { id: 3, username: "userID", storeName: "JimWhere", bizNum: "123-45-67890", createdAt: "2025/11/10", updatedAt: "2025/11/10" },
  { id: 4, username: "userID", storeName: "JimWhere", bizNum: "123-45-67890", createdAt: "2025/11/10", updatedAt: "2025/11/10" },
  { id: 5, username: "userID", storeName: "JimWhere", bizNum: "123-45-67890", createdAt: "2025/11/10", updatedAt: "2025/11/10" },
  { id: 6, username: "userID", storeName: "JimWhere", bizNum: "123-45-67890", createdAt: "2025/11/10", updatedAt: "2025/11/10" },
  { id: 7, username: "userID", storeName: "JimWhere", bizNum: "123-45-67890", createdAt: "2025/11/10", updatedAt: "2025/11/10" },
  { id: 8, username: "userID", storeName: "JimWhere", bizNum: "123-45-67890", createdAt: "2025/11/10", updatedAt: "2025/11/10" },
  { id: 9, username: "userID", storeName: "JimWhere", bizNum: "123-45-67890", createdAt: "2025/11/10", updatedAt: "2025/11/10" },
  { id: 10, username: "userID", storeName: "JimWhere", bizNum: "123-45-67890", createdAt: "2025/11/10", updatedAt: "2025/11/10" }
]);

// 페이지 이동 함수
const movePage = (p) => (page.value = p);
const prevPage = () => page.value > 1 && page.value--;
const nextPage = () => page.value < pageCount && page.value++;
</script>

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
</style>
