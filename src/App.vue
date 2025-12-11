<script setup>
import Layout from '@/components/shared/layout/Layout.vue'
import Header from '@/components/shared/header/Header.vue'
import {useRoute} from "vue-router";

const route = useRoute()

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