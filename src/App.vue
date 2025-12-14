<script setup>
import Layout from '@/components/shared/layout/Layout.vue'
import Header from '@/components/shared/header/Header.vue'
import {useRoute} from "vue-router";

const route = useRoute()
console.log('API BASE:', import.meta.env.VITE_API_BASE)
console.log('SUCCESS URL:', import.meta.env.VITE_TOSS_SUCCESS_URL)

</script>

<template>
  <Layout>
    <template #header v-if="!route.meta.hideHeader">
      <Header @toggle-menu="onToggleMenu" />
    </template>

    <router-view />
    <!-- 넣고 싶은 메인 페이지 넣으세요 -->
  </Layout>

</template>

<style scoped></style>