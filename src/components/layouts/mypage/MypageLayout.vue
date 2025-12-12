<template>
  <div class="mypage-layout">

    <div class="content-area">

      <!-- 왼쪽 사이드바 -->
      <aside class="sidebar">

        <div class="header">마이페이지</div>
        <hr />

        <!-- 메뉴 리스트 -->
        <nav class="menu-list">
          <router-link to="/mypage/user" class="menu">유저정보</router-link>
          <router-link to="/mypage/entry" class="menu">출입내역</router-link>
          <router-link to="/mypage/inout" class="menu">입출고 현황</router-link>
          <router-link to="/mypage/inventory" class="menu">재고 현황</router-link>
          <router-link to="/mypage/reservations" class="menu">예약내역</router-link>
          <router-link to="/mypage/inquiry" class="menu">문의내역</router-link>
        </nav>

      </aside>

      <!-- 오른쪽 페이지 -->
      <main class="main">
        <router-view />
      </main>

    </div>

  </div>
</template>

<style scoped>
.mypage-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 전체 레이아웃 */
.content-area {
  flex: 1;
  display: flex;
  gap: 15px;
}

/* 사이드바 */
.sidebar {
  width: 200px;
  border: 1px solid #bbecff;
  padding: 20px;
  background: white;
  border-radius: 15px;

  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px); /* 관리자 레이아웃과 동일한 높이 */
}
.sidebar hr {
  width: 80%;
  border: none;
  border-top: 2px solid #ebf7fd;
}
/* 상단 제목 */
.header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  padding: 10px;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}

/* 메뉴 리스트를 전체 높이에 맞춰 균등 배치 */
.menu-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px 0;
  align-items: center;
}

/* 메뉴 스타일 */
.menu {
  display: block;
  color: #333;
  text-decoration: none;
  font-size: 15px;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}

.menu.router-link-active {
  color: #2b84ff;
  font-weight: bold;
}

/* 오른쪽 콘텐츠 */
.main {
  flex: 1;
  padding: 0 10px;
  background: white;
  border: 1px solid #bbecff;
  border-radius: 15px;
  min-height: calc(100vh - 100px);
}
</style>
<script setup lang="ts">
</script>