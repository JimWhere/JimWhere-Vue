<template>
  <div class="sw-sidebar" :class="{ 'is-open': ui.sidebarOpen }">
    <div class="overlay" @click="ui.closeSidebar" v-if="ui.sidebarOpen"></div>
    <div class="drawer" role="dialog" aria-hidden="false">
      <div class="drawer-header">
        <div class="user-info">
          <div class="label">유저ID</div>
          <div class="id">
            {{ auth.isLoggedIn ? auth.user.pName + ' (' + auth.user.username + ')' : '게스트' }}
          </div>
        </div>
        <button class="close-btn" @click="ui.closeSidebar">&times;</button>
      </div>
      <div class="menu">
        <div class="menu-item" v-for="item in menuItems" :key="item.text" @click="onItemClick(item)">
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
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from 'vue-router'

const ui = useUiStore()
const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout();          // Pinia , refreshToken 쿠키 삭제
  router.push("/login");  // 로그인 페이지로 이동
  ui.closeSidebar();      // 사이드바 닫기
}

const menuItems = [
  { text: '출입', to: '/entry/request' },
  { text: '공지사항', to: '/notice' }, 
  { text: '마이페이지', to: '/mypage/user' },
  { text: '문의하기', to: '/inquiry' },
]

function onItemClick(item) {
  if (item.to) router.push(item.to)
  ui.closeSidebar()
}
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";

.overlay{
  position:fixed; inset:0; background:rgba(0,0,0,0.28); z-index:900; transition:opacity .2s;
}
.drawer{
  position:fixed; left:0; top:0; bottom:0; width:280px; max-width:80vw;
  background:var(--color-surface, #fff); z-index:1000; box-shadow:2px 0 12px rgba(0,0,0,0.08);
  transform:translateX(-100%); transition:transform .25s ease;
  display:flex; flex-direction:column; padding:12px 8px;
}
.sw-sidebar.is-open .drawer{ transform:translateX(0); }

.drawer-header{ display:flex; align-items:center; justify-content:space-between; padding:8px 12px; }
.user-info .label{ font-size:12px; color:var(--color-gray-500,#9aa4ad) }
.user-info .id{ font-weight:600; margin-top:6px }
.close-btn{ border:none; background:transparent; font-size:18px; cursor:pointer }

.menu{ display:flex; flex-direction:column; margin-top:12px }
.menu-item{
  background:transparent; border:none; text-align:left; padding:18px 12px; cursor:pointer;
  font-size:14px; border-top:1px solid rgba(0,0,0,0.03)
}
.menu-item:first-of-type{ border-top: none }
.menu-item:hover{ background: rgba(91,184,230,0.08) }

.spacer{ flex:1 }
.drawer-footer{ font-size:12px; color:var(--color-gray-500,#9aa4ad); text-align:center; padding:12px }
.drawer-footer .auth-links{ display:flex; gap:12px; justify-content:center; margin-bottom:8px }
.drawer-footer a{ color:inherit; text-decoration:underline; font-size:13px }

/* hide overlay/drawer when not open to avoid tab focus issues */
.sw-sidebar:not(.is-open) .overlay{ display:none }
.sw-sidebar:not(.is-open) .drawer{ pointer-events:none }

@media (max-width:720px){
  .drawer{ width:260px }
}
</style>