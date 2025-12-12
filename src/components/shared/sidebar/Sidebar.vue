<template>
  <div class="sw-sidebar" :class="{ 'is-open': ui.sidebarOpen }">
    <div class="overlay" @click="ui.closeSidebar" v-if="ui.sidebarOpen"></div>
    <div class="drawer" role="dialog" aria-hidden="false">
      <div class="drawer-header">
        <div class="user-info">
          <div class="label">유저ID</div>

          <!-- 아이디 + 알림 아이콘 한 줄 -->
          <div class="id-row">
            <div class="id">
              {{ auth.isLoggedIn ? auth.user.pName + ' (' + auth.user.username + ')' : '게스트' }}
            </div>

            <!-- 알림 아이콘 버튼 -->
            <button
                v-if="auth.isLoggedIn"
                class="alarm-btn"
                type="button"
                @click="goAlarm"
            >
              <span class="alarm-icon">🔔</span>
              <span class="alarm-badge" v-if="hasUnread">N</span>
              <span class="sr-only">알림 확인</span>
            </button>
          </div>
        </div>

        <button class="close-btn" @click="ui.closeSidebar">&times;</button>
      </div>

      <div class="menu">
        <div
            class="menu-item"
            v-for="item in menuItems"
            :key="item.text"
            @click="onItemClick(item)"
        >
          {{ item.text }}
        </div>
      </div>

      <div class="spacer"></div>

      <div class="drawer-footer">
        <div class="auth-links">
          <!-- 로그인 상태 : 로그아웃 표시 -->
          <template v-if="auth.isLoggedIn">
            <a href="#" @click.prevent="handleLogout">로그아웃</a>
          </template>

          <!-- 비로그인 상태 : 로그인 / 회원가입 -->
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/authStore'

const ui = useUiStore()
const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()              /* 로그아웃 처리 */
  router.push('/login')      /* 로그인 페이지로 이동 */
  ui.closeSidebar()          /* 사이드바 닫기 */
}

/* 알림 페이지로 이동 – 라우트 이름/경로는 프로젝트에 맞게 변경 */
function goAlarm() {
  router.push('/alarm')  /* 예시 경로 */
  ui.closeSidebar()
}

/* 아직 백엔드 연동 전이라 더미 값으로 표시 */
/* 나중에 Pinia나 API에서 안 읽은 알림 수 받아오면 교체 */
const hasUnread = computed(() => false)  /* true 로 바꾸면 N 배지 보임 */

const menuItems = [
  { text: '출입', to: '/entry/request' },
  { text: '공지사항', to: '/notice' },
  { text: '마이페이지', to: '/mypage/user' },
  { text: '문의하기', to: '/inquiry' }
]

function onItemClick(item) {
  if (item.to) router.push(item.to)
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
  transition: opacity 0.2s;
}

.drawer {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  max-width: 80vw;
  background: var(--color-surface, #fff);
  z-index: 1000;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
  transform: translateX(-100%);
  transition: transform 0.25s ease;
  display: flex;
  flex-direction: column;
  padding: 12px 8px;
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

/* 유저 정보 + 알림 버튼 한 줄 */
.user-info .label {
  font-size: 12px;
  color: var(--color-gray-500, #9aa4ad);
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
  position: relative;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 2px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alarm-icon {
  font-size: 16px;
}

/* 새 알림 배지 (선택) */
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
  line-height: 1.2;
}

/* 스크린리더 전용 텍스트 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.menu {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
}

.menu-item {
  background: transparent;
  border: none;
  text-align: left;
  padding: 18px 12px;
  cursor: pointer;
  font-size: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.03);
}

.menu-item:first-of-type {
  border-top: none;
}

.menu-item:hover {
  background: rgba(91, 184, 230, 0.08);
}

.spacer {
  flex: 1;
}

.drawer-footer {
  font-size: 12px;
  color: var(--color-gray-500, #9aa4ad);
  text-align: center;
  padding: 12px;
}

.drawer-footer .auth-links {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 8px;
}

.drawer-footer a {
  color: inherit;
  text-decoration: underline;
  font-size: 13px;
}

/* hide overlay/drawer when not open to avoid tab focus issues */
.sw-sidebar:not(.is-open) .overlay {
  display: none;
}

.sw-sidebar:not(.is-open) .drawer {
  pointer-events: none;
}

@media (max-width: 720px) {
  .drawer {
    width: 260px;
  }
}
</style>