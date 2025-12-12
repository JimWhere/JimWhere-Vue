import { createRouter, createWebHistory } from 'vue-router'
// UI 공용컴포넌트 예시 
import UIPreview from '@/views/ui/UIView.vue'

// 레이아웃 불러오기
import MyPageLayout from '@/components/layouts/mypage/MypageLayout.vue'

// 임시로 보여줄 페이지 1개 생성하여 import
import UserInfo from '@/views/mypage/UserInfo.vue'
import Reservations from "@/views/mypage/Reservations.vue";
import Inventory from "@/views/mypage/Inventory.vue";
import Inquiry from "@/views/mypage/Inquiry.vue";
import Home from '@/views/Home.vue'

//admin
import AdminLayout from "@/components/layouts/admin/AdminLayout.vue"
import AdminHome from "@/views/admin/AdminHome.vue"
import AdminUsers from "@/views/admin/AdminUsers.vue"
import AdminInventory from "@/views/admin/AdminInventory.vue"
import AdminReservations from "@/views/admin/AdminReservations.vue"
import AdminInquiry from "@/views/admin/AdminInquiry.vue"
import AdminNotice from "@/views/admin/AdminNotice.vue"
import {useAuthStore} from "@/stores/authStore.js";
import {nextTick} from "vue";
import InquiryCreate from "@/views/mypage/InquiryCreate.vue";
import AdminNoticeDetail from "@/views/admin/AdminNoticeDetail.vue";
import AdminNoticeCreate from "@/views/admin/AdminNoticeCreate.vue";
import AdminInquiryDetail from "@/views/admin/AdminInquiryDetail.vue";
import Notice from "@/views/notice/Notice.vue";
import NoticeDetail from "@/views/notice/NoticeDetail.vue";


import TossPayPage from '@/views/payment/TossPayPage.vue'
import PaymentSuccess from '@/views/payment/PaymentSuccess.vue'
import PaymentFail from '@/views/payment/PaymentFail.vue'


//entry
import EntryQrView from "@/views/entry/EntryQrView.vue";
import MainInquiryCreate from "@/views/inquriy/MainInquiryCreate.vue";
import InquiryDetail from "@/views/mypage/InquiryDetail.vue";
import InOutHistory from "@/views/mypage/InOutHistory.vue";
import AdminInOutHistory from "@/views/admin/AdminInOutHistory.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // UI 컴포넌트 테스트용
        {
            path: '/ui-preview',
            name: 'UIPreview',
            component: UIPreview
        },

        { path: "/", name: "Home", component: Home },
        { path: "/home", redirect: "/" },
        { path: "/notice",name:'Notice', component: Notice },
        { path: "/notice/detail",name:'NoticeDetail', component: NoticeDetail },
        { path: "/inquiry",name:'MainInquiryCreate', component: MainInquiryCreate },
        // admin
        {
            path: "/admin",
            component: AdminLayout,
            meta: { requiresAdmin: true },
            children: [
                { path: "", redirect: "/admin/home" },
                { path: "home", component: AdminHome },
                { path: "users", component: AdminUsers },
                { path: "inventory", component: AdminInventory },
                { path: "inout",name:'AdminInOutHistory', component: AdminInOutHistory },
                { path: "reservations", component: AdminReservations },
                { path: "inquiry", name:'AdminInquiry',component: AdminInquiry },
                { path: "inquiry/detail",name:'AdminInquiryDetail', component: AdminInquiryDetail },
                { path: "notice",name:'AdminNotice', component: AdminNotice },
                { path: "notice/detail",name:'AdminNoticeDetail', component: AdminNoticeDetail },
                { path: "notice/create",name:'AdminNoticeCreate', component: AdminNoticeCreate },
            ],
        },

        {
            path: "/admin/login",
            name: "AdminLogin",
            component: () => import("@/views/auth/AdminLogin.vue")
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
                { path: "reservations", component: Reservations },
                { path: "inventory", component: Inventory },
                { path: "inout",name:'InOutHistory', component: InOutHistory },
                { path: "inquiry", name:'Inquiry',component: Inquiry },
                { path: "inquiry/create",name:'InquiryCreate', component: InquiryCreate },
                { path: "inquiry/detail",name:'InquiryDetail', component: InquiryDetail },

                { path: "", redirect: "/mypage/user" }, // 기본 진입 시 유저정보로
            ]
        },

        {
            path: '/payments/request',
            name: 'TossPay',
            component: TossPayPage,
        },
        {
            path: '/payments/success',
            name: 'PaymentSuccess',
            component: PaymentSuccess,
        },
        {
            path: '/payments/fail',
            name: 'PaymentFail',
            component: PaymentFail,
        },

        {
            path: '/entry/qr',
            name: 'EntryQr',
            component: EntryQrView,
            meta: {hideHeader: true},
        }
    ],
})

// admin 라우터가드
router.beforeEach(async (to, from) => {
    const auth = useAuthStore()
    const isLoggedIn = !!auth.user
    const isAdmin = auth.user?.role === "ADMIN"

    /* ============================
       0) 비로그인 상태 처리
       ============================ */
    if (!isLoggedIn) {
        // 비로그인 상태에서는 로그인 페이지는 모두 허용
        if (to.path === "/login" || to.name === "AdminLogin") {
            return true
        }

        // 비로그인 상태에서 /admin/* 접근 시 → 관리자 로그인 요구
        if (to.meta.requiresAdmin) {
            alert("관리자 로그인이 필요합니다.")
            await nextTick()
            return { name: "AdminLogin" }
        }

        // 그 외 페이지는 모두 허용
        return true
    }

    /* ============================
       1) 로그인한 상태에서 /login 접근 차단
       ============================ */
    if (to.path === "/login") {
        if (isAdmin) return { path: "/admin/home" }
        return { path: "/" } // 일반유저는 홈으로
    }

    /* ============================
       2) 로그인한 상태에서 /admin/login 접근 차단
       ============================ */
    if (to.name === "AdminLogin") {
        if (isAdmin) return { path: "/admin/home" }

        alert("관리자만 접근할 수 있습니다.")
        await nextTick()
        return { path: "/" }
    }

    /* ============================
       3) 로그인 상태에서 /admin/* 보호
       ============================ */
    if (to.meta.requiresAdmin) {
        if (!isAdmin) {
            alert("관리자만 접근할 수 있습니다.")
            await nextTick()
            return { path: "/" }
        }
    }

    return true
})


export default router
