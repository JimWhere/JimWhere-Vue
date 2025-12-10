import { createRouter, createWebHistory } from 'vue-router'
// 레이아웃 불러오기
import MyPageLayout from '@/components/layouts/mypage/MypageLayout.vue'

// 임시로 보여줄 페이지 1개 생성하여 import
import UserInfo from '@/views/mypage/UserInfo.vue'
import EntryHistory from "@/views/mypage/EntryHistory.vue";
import Reservations from "@/views/mypage/Reservations.vue";
import Inventory from "@/views/mypage/Inventory.vue";
import Inquiry from "@/views/mypage/Inquiry.vue";
import Home from '@/views/Home.vue'

//admin
import AdminLayout from "@/components/layouts/admin/AdminLayout.vue"
import AdminDashboard from "@/views/admin/AdminDashboard.vue"
import AdminHome from "@/views/admin/AdminHome.vue"
import AdminUsers from "@/views/admin/AdminUsers.vue"
import AdminEntry from "@/views/admin/AdminEntry.vue"
import AdminInventory from "@/views/admin/AdminInventory.vue"
import AdminReservations from "@/views/admin/AdminReservations.vue"
import AdminInquiry from "@/views/admin/AdminInquiry.vue"
import AdminNotice from "@/views/admin/AdminNotice.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: Home
        },

        // admin
        {
            path: "/admin",
            component: AdminLayout,
            children: [
                { path: "", redirect: "/admin/home" },
                { path: "home", component: AdminHome },
                { path: "users", component: AdminUsers },
                { path: "entry", component: AdminEntry },
                { path: "inventory", component: AdminInventory },
                { path: "reservations", component: AdminReservations },
                { path: "inquiry", component: AdminInquiry },
                { path: "notice", component: AdminNotice },
            ],
        },

        {
            path: "/login",
            component: () => import('@/views/auth/Login.vue')
        },
        {
            path: "/register",
            component: () => import('@/views/auth/Register.vue')
        },

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
