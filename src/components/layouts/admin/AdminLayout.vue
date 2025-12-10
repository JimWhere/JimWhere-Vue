<template>
  <div class="admin-layout">

    <div class="content-area">
      <!-- 왼쪽 사이드바 -->
      <aside class="sidebar">
        <div class="title">관리자 페이지</div>
        <br><hr />

        <router-link to="/admin/home" class="menu">홈</router-link>
        <router-link to="/admin/users" class="menu">회원 관리</router-link>
        <router-link to="/admin/entry" class="menu">출입 관리</router-link>
        <router-link to="/admin/inventory" class="menu">재고 관리</router-link>
        <router-link to="/admin/reservations" class="menu">예약 관리</router-link>
        <router-link to="/admin/inquiry" class="menu">문의 관리</router-link>
        <router-link to="/admin/notice" class="menu">공지 관리</router-link>
      </aside>

      <!-- 오른쪽 관리자 화면 -->
      <main class="main">
        <router-view />
      </main>
    </div>

  </div>
</template>

<style scoped>
.admin-layout {
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
  border-right: 1px solid #ddd;
  padding: 20px;
  background: #f4faff;
}

.title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
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
  background: #e5f1ff;
  padding: 6px 10px;
  border-radius: 6px;
}

/* 오른쪽 페이지 내용 */
.main {
  flex: 1;
  padding: 30px;
}
</style>
