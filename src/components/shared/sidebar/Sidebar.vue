<template>
  <div class="sw-sidebar" :class="{ 'is-open': ui.sidebarOpen }">

    <div class="overlay" @click="ui.closeSidebar" v-if="ui.sidebarOpen"></div>

    <div class="drawer">

      <!-- HEADER -->
      <div class="drawer-header">
        <div class="user-info">
          <div class="label">유저ID</div>

          <div class="id-row">
            <div class="id">
              {{ auth.isLoggedIn ? auth.user.pName + ' (' + auth.user.username + ')' : '게스트' }}
            </div>

            <!-- 알림 버튼 : 일반 유저만 -->
            <button
                v-if="auth.isLoggedIn && !auth.isAdmin"
                class="alarm-btn"
                type="button"
                @click="goAlarm"
            >
              <span class="alarm-icon">🔔</span>
              <span class="alarm-badge" v-if="hasUnread">N</span>
            </button>
          </div>
        </div>

        <button class="close-btn" @click="ui.closeSidebar">&times;</button>
      </div>

      <!-- MENU -->
      <div class="menu">

        <!-- 일반 유저 메뉴 -->
        <template v-if="!auth.isAdmin">
          <div
              v-for="item in userMenu"
              :key="item.text"
              class="menu-item"
              @click="onItemClick(item)"
          >
            {{ item.text }}
          </div>
        </template>

        <!-- 관리자 메뉴 -->
        <template v-else>
          <div
              v-for="item in adminMenu"
              :key="item.text"
              class="menu-item"
              @click="onItemClick(item)"
          >
            {{ item.text }}
          </div>
        </template>
      </div>

      <!-- 관리자 전용 버튼 영역 -->
      <template v-if="auth.isAdmin">
        <div class="admin-switch-area">
          <button class="switch-btn" @click="goAdminHome">관리자 홈</button>
          <button class="switch-btn" @click="goUserHome">유저 홈</button>
        </div>
      </template>

      <div class="spacer"></div>

      <!-- FOOTER -->
      <div class="drawer-footer">
        <div class="auth-links">
          <template v-if="auth.isLoggedIn">
            <a href="#" @click.prevent="handleLogout">로그아웃</a>
          </template>

          <template v-else>
            <a href="/login">로그인</a>
            <a href="/register">회원가입</a>
          </template>
        </div>

        <div>© JimWhere</div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useUiStore } from "@/stores/ui"
import { useAuthStore } from "@/stores/authStore"

const ui = useUiStore()
const auth = useAuthStore()
const router = useRouter()

const hasUnread = computed(() => false)

/* 일반 유저 메뉴 */
const userMenu = [
  { text: "출입", to: "/entry/request" },
  { text: "공지사항", to: "/notice" },
  { text: "마이페이지", to: "/mypage/user" },
  { text: "문의하기", to: "/inquiry" }
]

/* 관리자 메뉴 */
const adminMenu = [
  { text: "대시보드", to: "/admin/home" },
  { text: "회원관리", to: "/admin/users" },
  { text: "출입관리", to: "/admin/entry" },
  { text: "입출고관리", to: "/admin/inout" },
  { text: "예약관리", to: "/admin/reservations" },
  { text: "문의관리", to: "/admin/inquiry" },
  { text: "공지관리", to: "/admin/notice" }
]

function onItemClick(item) {
  router.push(item.to)
  ui.closeSidebar()
}

function goAdminHome() {
  router.push("/admin/home")
  ui.closeSidebar()
}

function goUserHome() {
  router.push("/")
  ui.closeSidebar()
}

function goAlarm() {
  router.push("/alarm")
  ui.closeSidebar()
}

function handleLogout() {
  auth.logout()

  if (auth.isAdmin) router.push("/admin/login")
  else router.push("/login")

  ui.closeSidebar()
}
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
  z-index: 900;
}

.drawer {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  max-width: 80vw;
  background: #fff;
  z-index: 1000;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
  transform: translateX(-100%);
  transition: transform 0.25s ease;
  display: flex;
  flex-direction: column;
  padding: 12px 8px;
}
.close-btn {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.sw-sidebar.is-open .drawer {
  transform: translateX(0);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
}

.user-info .label {
  font-size: 12px;
  color: #9aa4ad;
}

.id-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
}

.user-info .id {
  font-weight: 600;
}

/* 알림 버튼 */
.alarm-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 2px 4px;
}

.alarm-badge {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  background: #f97373;
  color: #fff;
  border-radius: 999px;
  font-size: 10px;
  padding: 0 4px;
}

.menu {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
}

.menu-item {
  padding: 18px 12px;
  border-top: 1px solid rgba(0,0,0,0.03);
  cursor: pointer;
}

.menu-item:hover {
  background: rgba(91, 184, 230, 0.08);
}

/* 관리자용 버튼 영역 */
.admin-switch-area {
  padding: 0 12px;
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.switch-btn {
  width: 100%;
  padding: 12px;
  background: #eaf6ff;
  border: 1px solid #bcdcff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.switch-btn:hover {
  background: #d7edff;
}

.spacer {
  flex: 1;
}

.drawer-footer {
  font-size: 12px;
  color: #9aa4ad;
  text-align: center;
  padding: 12px;
}

.drawer-footer a {
  color: inherit;
  text-decoration: underline;
  font-size: 13px;
}
</style>
