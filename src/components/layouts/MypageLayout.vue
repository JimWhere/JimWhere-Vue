<template>
  <div class="mypage-layout">


    <div class="content-area">
      <!-- 왼쪽 사이드바 -->
      <aside class="sidebar">
        <div>마이페이지</div>
        <br><hr>
        <router-link to="/mypage/user" class="menu">유저정보</router-link>
        <router-link to="/mypage/entry" class="menu">출입내역</router-link>
        <router-link to="/mypage/inventory" class="menu">재고 현황</router-link>
        <router-link to="/mypage/reservations" class="menu">예약내역</router-link>
        <router-link to="/mypage/inquiry" class="menu">문의내역</router-link>
      </aside>

      <!-- 오른쪽 해당 페이지 -->
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

/* 상단 */
.header {
  height: 60px;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

/* 본문 영역 */
.content-area {
  flex: 1;
  display: flex;
}

/* 왼쪽 메뉴 */
.sidebar {
  width: 200px;
  border-right: 1px solid #ddd;
  padding: 20px;
}

.menu {
  display: block;
  margin-bottom: 15px;
  color: #333;
  text-decoration: none;
}
.menu.router-link-active {
  color: #2b84ff;
  font-weight: bold;
}

/* 오른쪽 페이지 내용 */
.main {
  flex: 1;
  padding: 30px;
}
</style>
