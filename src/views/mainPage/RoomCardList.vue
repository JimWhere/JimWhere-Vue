<template>
  <div class="home-wrapper">
    <div class="room-list">
      <article
          v-for="room in rooms"
          :key="room.id"
          class="room-card"
      >
        <!-- 이미지 영역 -->
        <div class="room-image-wrapper">
          <img
              :src="room.imageUrl"
              :alt="room.title"
              class="room-image"
          />
        </div>

        <!-- 텍스트 영역 -->
        <div class="room-content">
          <h3 class="room-title">{{ room.title }}</h3>
          <p class="room-desc">
            {{ room.description }}
          </p>
        </div>

        <!-- 버튼 영역 -->
        <div class="room-footer">
          <button
              type="button"
              class="room-button"
              @click="goDetail(room.id)"
          >
            예약하기
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import roomAImg from '@/assets/shared/cardList/roomA.png'
import roomBImg from '@/assets/shared/cardList/roomC.png'
import roomCImg from '@/assets/shared/cardList/roomB.png'

const router = useRouter()

// 나중에 API 연동하면 이 배열만 교체
const rooms = [
  {
    id: 'A',
    title: 'Room A 가로형 박스',
    description: '가로 단위로 짐을 보관하는 대여공간 입니다',
    imageUrl: roomAImg, // 실제 이미지 경로로 교체
  },
  {
    id: 'B',
    title: 'Room B 세로형 박스',
    description: '세로 단위로 짐을 보관하는 대여공간 입니다',
    imageUrl: roomBImg,
  },
  {
    id: 'C',
    title: 'Room C 혼합형',
    description: '다양 형태의 단위로 짐을 보관하는 대여공간 입니다',
    imageUrl: roomCImg,
  },
]

const goDetail = (roomId) => {
  // 상세 페이지 라우팅 (예시)
  router.push({ name: 'RoomDetail', params: { roomId } })
}
</script>

<style scoped>
.home-wrapper {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff; /* 전체 배경 흰색 */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;

}

/* 가로 스크롤 슬라이드 영역 */
.room-list {
  width: 100%;
  display: flex;
  justify-content: space-around;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
}

/* 카드 하나 */
.room-card {
  background-color: #e0f3ff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  scroll-snap-align: center;

}

.room-image-wrapper {
  width: 100%;
  height: 320px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;

  display: flex;
  justify-content: center;
  align-items: center;
}

.room-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 텍스트 영역 */
.room-content {
  margin-top: 12px;
  padding: 12px;
  background-color: #ffffff;
  border-radius: 8px;
}

.room-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 6px;
}

.room-desc {
  font-size: 13px;
  line-height: 1.4;
}

/* 버튼 영역 */
.room-footer {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.room-button {
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background-color: #4ba3e6;
  color: #ffffff;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.room-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
}
</style>
