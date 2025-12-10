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



/* 본문 영역 */
.content-area {
  flex: 1;
  display: flex;
}

/* 왼쪽 메뉴 */
.sidebar {
  width: 200px;
  border: 1px solid #bbecff;
  padding: 20px;
  background: white;
  border-radius: 15px;

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
  padding: 0 10px;
  background: white;
  border: 1px solid #bbecff;
  min-height: calc(100vh - 100px);
  border-radius: 15px;
}
</style>
