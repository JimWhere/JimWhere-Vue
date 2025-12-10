import { createRouter, createWebHistory } from 'vue-router'
// 레이아웃 불러오기
import MyPageLayout from '@/components/layouts/MypageLayout.vue'

// 임시로 보여줄 페이지 1개 생성하여 import
import UserInfo from '@/views/mypage/UserInfo.vue'
import EntryHistory from "@/views/mypage/EntryHistory.vue";
import Reservations from "@/views/mypage/Reservations.vue";
import Inventory from "@/views/mypage/Inventory.vue";
import Inquiry from "@/views/mypage/Inquiry.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/mypage",
            component: MyPageLayout,
            children: [
                { path: "user", component: UserInfo },
                { path: "entry", component: EntryHistory },
                { path: "reservations", component: Reservations },
                { path: "inventory", component: Inventory },
                { path: "inquiry", component: Inquiry },
                { path: "", redirect: "/mypage/user" }, // 기본 진입 시 유저정보로
            ]
        }
    ],
})

export default router
