<template>
  <header class="sw-topbar">
    <div class="sw-topbar-inner">
      <button class="menu-btn" @click="$emit('toggle-menu')" aria-label="menu">
        <span class="hamburger" />
      </button>

      <div class="logo-wrap">
        <img :src="logo" alt="JimWhere" />
      </div>

      <div class="spacer" />
    </div>
  </header>
</template>

<script setup>
import logo from '@/assets/shared/logo/logo.png'
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";

.sw-topbar{ width:100%; padding:10px 0; box-sizing:border-box }
.sw-topbar-inner{
  margin:0 auto; display:flex; align-items:center; justify-content:space-between;
  background: #ffffff; /* changed to solid white */
  border-radius:12px; padding:8px 12px; box-shadow: 0 1px 0 rgba(0,0,0,0.04) inset;
  border:1px solid rgba(91,184,230,0.08);
}

.menu-btn{ width:42px; height:42px; border-radius:10px; background:#fff; border:1px solid rgba(0,0,0,0.06); display:flex; align-items:center; justify-content:center }
.menu-btn .hamburger{ display:block; width:18px; height:2px; background:var(--color-primary-800); position:relative }
.menu-btn .hamburger::before, .menu-btn .hamburger::after{ content:''; position:absolute; left:0; width:18px; height:2px; background:var(--color-primary-800) }
.menu-btn .hamburger::before{ top:-6px }
.menu-btn .hamburger::after{ top:6px }

.logo-wrap{ display:flex; align-items:center; justify-content:center; flex:1 }
.logo-wrap img{ height:28px; object-fit:contain }

.spacer{ width:42px; height:42px }

@media (max-width:720px){
  .sw-topbar-inner{ padding:6px 8px }
  .logo-wrap img{ height:24px }
}
</style>
