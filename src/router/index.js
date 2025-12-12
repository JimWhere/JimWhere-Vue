import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from "vue"
import { useAuthStore } from "@/stores/authStore.js"

// UI 공용컴포넌트 예시
import UIPreview from '@/views/ui/UIView.vue'

// 레이아웃
import MyPageLayout from '@/components/layouts/mypage/MypageLayout.vue'
import AdminLayout from "@/components/layouts/admin/AdminLayout.vue"

// pages
import Home from '@/views/Home.vue'

// mypage
import UserInfo from '@/views/mypage/UserInfo.vue'
import EntryHistory from "@/views/mypage/EntryHistory.vue"
import Reservations from "@/views/mypage/Reservations.vue"
import Inventory from "@/views/mypage/Inventory.vue"
import Inquiry from "@/views/mypage/Inquiry.vue"
import InquiryCreate from "@/views/mypage/InquiryCreate.vue"
import InquiryDetail from "@/views/mypage/InquiryDetail.vue"
import InOutHistory from "@/views/mypage/InOutHistory.vue"
import EntryDetailView from "@/views/mypage/EntryDetailView.vue"

// admin
import AdminHome from "@/views/admin/AdminHome.vue"
import AdminUsers from "@/views/admin/AdminUsers.vue"
import AdminEntry from "@/views/admin/AdminEntry.vue"
import AdminInventory from "@/views/admin/AdminInventory.vue"
import AdminReservations from "@/views/admin/AdminReservations.vue"
import AdminInquiry from "@/views/admin/AdminInquiry.vue"
import AdminInquiryDetail from "@/views/admin/AdminInquiryDetail.vue"
import AdminNotice from "@/views/admin/AdminNotice.vue"
import AdminNoticeDetail from "@/views/admin/AdminNoticeDetail.vue"
import AdminNoticeCreate from "@/views/admin/AdminNoticeCreate.vue"
import AdminEntryDetailView from "@/views/admin/AdminEntryDetailView.vue"
import AdminInOutHistory from "@/views/admin/AdminInOutHistory.vue"

// notice
import Notice from "@/views/notice/Notice.vue"
import NoticeDetail from "@/views/notice/NoticeDetail.vue"

// payment
import TossPayPage from '@/views/payment/TossPayPage.vue'
import PaymentSuccess from '@/views/payment/PaymentSuccess.vue'
import PaymentFail from '@/views/payment/PaymentFail.vue'

// entry
import EntryQrView from "@/views/entry/EntryQrView.vue"
import EntryRequestView from "@/views/entry/EntryRequestView.vue"

// alarm
import AlarmView from "@/views/alarm/AlarmView.vue"

// inquiry (main)
import MainInquiryCreate from "@/views/inquriy/MainInquiryCreate.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        /* UI 프리뷰 */
        { path: '/ui-preview', name: 'UIPreview', component: UIPreview },

        /* public */
        { path: "/", name: "Home", component: Home },
        { path: "/home", redirect: "/" },
        { path: "/notice", name: 'Notice', component: Notice },
        { path: "/notice/detail", name: 'NoticeDetail', component: NoticeDetail },
        { path: "/inquiry", name: 'MainInquiryCreate', component: MainInquiryCreate },

        /* admin */
        {
            path: "/admin",
            component: AdminLayout,
            meta: { requiresAdmin: true },
            children: [
                { path: "", redirect: "/admin/home" },
                { path: "home", component: AdminHome },
                { path: "users", component: AdminUsers },
                { path: "entry", component: AdminEntry },
                { path: "entry/detail", component: AdminEntryDetailView },
                { path: "inventory", component: AdminInventory },
                { path: "inout", name: 'AdminInOutHistory', component: AdminInOutHistory },
                { path: "reservations", component: AdminReservations },

                { path: "inquiry", name: 'AdminInquiry', component: AdminInquiry },
                { path: "inquiry/detail", name: 'AdminInquiryDetail', component: AdminInquiryDetail },

                { path: "notice", name: 'AdminNotice', component: AdminNotice },
                { path: "notice/detail", name: 'AdminNoticeDetail', component: AdminNoticeDetail },
                { path: "notice/create", name: 'AdminNoticeCreate', component: AdminNoticeCreate },
            ]
        },

        {
            path: "/admin/login",
            name: "AdminLogin",
            component: () => import("@/views/auth/AdminLogin.vue")
        },

        /* auth */
        { path: "/login", component: () => import('@/views/auth/Login.vue') },
        { path: "/register", component: () => import('@/views/auth/Register.vue') },

        /* mypage */
        {
            path: "/mypage",
            component: MyPageLayout,
            children: [
                { path: "user", component: UserInfo },
                { path: "entry", component: EntryHistory },
                { path: "entry/detail", name: 'EntryDetail', component: EntryDetailView },
                { path: "reservations", component: Reservations },
                { path: "inventory", component: Inventory },
                { path: "inout", name: 'InOutHistory', component: InOutHistory },
                { path: "inquiry", name: 'Inquiry', component: Inquiry },
                { path: "inquiry/create", name: 'InquiryCreate', component: InquiryCreate },
                { path: "inquiry/detail", name: 'InquiryDetail', component: InquiryDetail },
                { path: "", redirect: "/mypage/user" },
            ]
        },

        /* payments */
        { path: '/payments/request', name: 'TossPay', component: TossPayPage },
        { path: '/payments/success', name: 'PaymentSuccess', component: PaymentSuccess },
        { path: '/payments/fail', name: 'PaymentFail', component: PaymentFail },

        /* entry */
        {
            path: '/entry/qr',
            name: 'EntryQr',
            component: EntryQrView,
            meta: { hideHeader: true, requiresAdmin: true }
        },
        { path: '/entry/request', name: 'EntryRequest', component: EntryRequestView },

        /* alarm */
        { path: '/alarm', name: 'Alarm', component: AlarmView },
    ],
})

/* router guard */
router.beforeEach(async (to) => {
    const auth = useAuthStore()
    const isLoggedIn = !!auth.user
    const isAdmin = auth.user?.role === "ADMIN"

    /* 0) 비로그인 */
    if (!isLoggedIn) {
        if (to.path === "/login" || to.name === "AdminLogin") return true

        /* admin 권한 필요한 페이지면 redirect 달고 관리자 로그인으로 */
        if (to.meta.requiresAdmin) {
            alert("관리자 로그인이 필요합니다.")
            await nextTick()
            return {
                name: "AdminLogin",
                query: { redirect: to.fullPath } /* 여기 핵심 */
            }
        }
        return true
    }

    /* 1) 로그인 상태에서 /login 접근 차단 */
    if (to.path === "/login") {
        if (isAdmin) return { path: "/admin/home" }
        return { path: "/" }
    }

    /* 2) 로그인 상태에서 /admin/login 접근 차단 */
    if (to.name === "AdminLogin") {
        if (isAdmin) {
            /* 이미 관리자면 redirect 있으면 거기로 */
            const redirect = to.query?.redirect
            return { path: redirect ? String(redirect) : "/admin/home" }
        }

        alert("관리자만 접근할 수 있습니다.")
        await nextTick()
        return { path: "/" }
    }

    /* 3) /admin 보호 */
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

