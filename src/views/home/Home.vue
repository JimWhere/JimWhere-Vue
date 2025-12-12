<script setup>
import RoomCardList from "@/components/home/RoomCardList.vue";
import ServiceIntro from "@/components/home/ServiceIntro.vue";
import HowToUse from "@/components/home/HowToUse.vue";
import StorageNotice from "@/components/home/StorageNotice.vue";
import Footer from "@/components/home/Footer.vue";
import HomeBanner from "@/components/home/HomeBanner.vue";
</script>

<template>
  <div class="home">
    <HomeBanner />
    <RoomCardList />
    <ServiceIntro />
    <HowToUse />
    <StorageNotice />
    <Footer />
  </div>
</template>
<style scoped>
.home {
  min-height: 100vh;

  display: flex;
  flex-direction: column; /* 세로 배치 */
  align-items: center;    /* 가운데 정렬 */
  gap: 40px;              /* 컴포넌트 간 간격 */
  padding: 40px 0;
}

</style>