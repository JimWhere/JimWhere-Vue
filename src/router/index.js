import { createRouter, createWebHistory } from 'vue-router'
// 레이아웃 불러오기
import MyPageLayout from '@/components/layouts/MypageLayout.vue'

// 임시로 보여줄 페이지 1개 생성하여 import
import UserInfo from '@/views/mypage/UserInfo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {
          path: "/mypage",
          component: MyPageLayout,
          children: [
              {
                  path: "user",   // /mypage/user
                  component: UserInfo
              }
          ]
      }
  ],
})

export default router
