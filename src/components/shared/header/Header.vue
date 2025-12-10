<template>
  <header class="sw-header">
    <div class="sw-header-inner">
      <div class="left">
        <button class="icon-btn" @click="$emit('toggle-menu')" aria-label="menu">
          <span class="hamburger"/>
        </button>
      </div>

      <div class="center">
        <img :src="logo" alt="JimWhere" class="brand"/>
      </div>

      <div class="right">
        <el-dropdown trigger="click">
          <span class="user-wrap">
            <el-avatar :size="36" :src="avatar" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>프로필</el-dropdown-item>
              <el-dropdown-item>설정</el-dropdown-item>
              <el-dropdown-item divided @click="$emit('logout')">로그아웃</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup>
import logo from '@/assets/shared/logo/logo.png'
const props = defineProps({ avatar: { type: String, default: '' } })
</script>

<style scoped>
@import "@/styles/theme.css";

.sw-header{
  width:100%;
  padding:12px 20px;
  position:relative;
}

.sw-header-inner{
  max-width:1200px;
  margin:0 auto;
  display:flex;
  align-items:center;
  justify-content:space-between;
  background: linear-gradient(180deg, rgba(143,211,246,0.12), rgba(255,255,255,0.6));
  border-radius: 12px;
  padding:8px 16px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.04) inset;
}

.left, .center, .right{ display:flex; align-items:center }
.center{ flex:1; justify-content:center }
.right{ justify-content:flex-end }

.brand{ height:36px; object-fit:contain }

.icon-btn{ background:#fff; border:1px solid rgba(0,0,0,0.06); padding:8px; border-radius:8px; cursor:pointer }
.icon-btn .hamburger{ display:block; width:18px; height:2px; background:var(--color-primary-800); position:relative }
.icon-btn .hamburger::before, .icon-btn .hamburger::after{ content:''; position:absolute; left:0; width:18px; height:2px; background:var(--color-primary-800) }
.icon-btn .hamburger::before{ top:-6px }
.icon-btn .hamburger::after{ top:6px }

.user-wrap{ display:inline-flex; align-items:center; gap:8px; cursor:pointer }

@media (max-width:720px){
  .center{ justify-content:flex-start }
  .sw-header-inner{ padding:8px }
  .brand{ height:28px }
}
</style>
