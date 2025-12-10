<template>
  <div class="layout-root">
    <div class="bg-gradient" />

    <slot name="header" />

    <div class="page-wrap">
      <slot />
    </div>
  </div>
</template>

<script setup>
// simplified layout: full-bleed gradient background; header rendered by App.vue slot/component
</script>

<style scoped>
@import "@/assets/shared/styles/theme.css";

.layout-root{ position:relative; min-height:100vh; padding:5px 10px; }

.bg-gradient{
  position:fixed; inset:0; z-index:0;
  background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid) 60%, var(--bg-gradient-end) 100%);
}

.page-wrap{
  position:relative; z-index:1; padding:10px 0; box-sizing:border-box; min-height:100vh;
  display:flex; flex-direction:column;
}

/* leave top room for header visual */
.page-wrap > *:first-child { margin-top:18px }

@media (max-width:420px){
  .page-wrap{ padding:12px }
}
</style>