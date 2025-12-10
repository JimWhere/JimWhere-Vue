<template>
  <div class="admin-layout">

    <div class="content-area">

      <!-- 왼쪽 사이드바 -->
      <aside class="sidebar">

        <!-- 상단 고정 문구 -->
        <div class="header">
          관리자 페이지
        </div>

        <hr />

        <!-- 메뉴 목록 (Flex 정렬) -->
        <nav class="menu-list">
          <router-link to="/admin/home" class="menu">홈</router-link>
          <router-link to="/admin/users" class="menu">회원 관리</router-link>
          <router-link to="/admin/entry" class="menu">출입 관리</router-link>
          <router-link to="/admin/inventory" class="menu">재고 관리</router-link>
          <router-link to="/admin/reservations" class="menu">예약 관리</router-link>
          <router-link to="/admin/inquiry" class="menu">문의 관리</router-link>
          <router-link to="/admin/notice" class="menu">공지 관리</router-link>
        </nav>

      </aside>

      <!-- 오른쪽 관리자 화면 -->
      <main class="main">
        <router-view />
      </main>

    </div>

  </div>
</template>

<style scoped>
/* 전체 레이아웃 */
.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 좌우 영역 */
.content-area {
  flex: 1;
  display: flex;
  gap: 15px;
}

.sidebar {
  width: 200px;
  border: 1px solid #bbecff;
  padding: 20px;
  background: white;
  border-radius: 15px;

  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px); /* 화면 높이에 맞추기 */
}

/* 상단 문구 */
.header {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}

/* 메뉴 리스트 (사이드바 높이에 맞춰 간격 배분) */
.menu-list {
  flex: 1; /* 남은 전체 영역 사용 */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-top: 10px;
  padding-bottom: 10px;
}

/* 메뉴 스타일 */
.menu {
  color: #333;
  text-decoration: none;
  font-size: 15px;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}

.menu.router-link-active {
  color: #2b84ff;
  font-weight: bold;
}

/* 오른쪽 메인 */
.main {
  flex: 1;
  padding: 0 15px;
  background: white;
  border: 1px solid #bbecff;
  border-radius: 15px;
  min-height: calc(100vh - 100px);
}
</style>
<script setup lang="ts">
</script>