<template>
  <section class="banner">
    <img class="banner-img" :src="bannerImg" alt="JIMWHERE Banner" />

    <!-- 배너 위 문구 (선택) -->
    <div class="banner-text">
      <h1>스마트 창고 대여 서비스, JIMWHERE</h1>
      <p>내 상품과 재고를 안전하고 체계적으로 관리하세요</p>
    </div>
  </section>
</template>

<script setup>
import bannerImg from '@/assets/shared/banner/jimwhere-banner.png'
</script>

<style scoped>
.banner {
  position: relative;
  width: 100vw;     /* 뷰포트 전체 너비 */
  margin-left: calc(50% - 50vw); /* 부모 컨테이너 padding 무시하고 꽉 채우는 핵심 코드 */
  margin-right: calc(50% - 50vw);
  height: 450px;
  overflow: hidden;
}

/* 이미지가 가득 차도록 */
.banner-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}


/* 오버레이 텍스트 */
.banner-text {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: #1a1a1a;
  text-shadow: 0 2px 6px rgba(255, 255, 255, 0.8);
}

.banner-text h1 {
  font-size: 1.8rem;
  margin: 0;
  font-weight: 600;
  color: #344685;
}

.banner-text p {
  margin-top: 6px;
  font-weight: 500;
  color: #6ba2ff;
}

@media (max-width: 768px) {
  .banner {
    height: 180px; /* 📱 모바일에서는 더 얇게 */
  }
  .banner-text h1 {
    font-size: 1.3rem;
  }
  .banner-text p {
    font-size: 0.8rem;
  }
}
</style>
