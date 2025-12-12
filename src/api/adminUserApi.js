import api from "@/axios";

// 관리자: 전체 유저 조회
export const fetchAdminUsers = (page = 0, size = 10, status = "", sort = "") => {
    return api.get("/admin/users", {
        params: {
            page,
            size,
            status: status || undefined,   // ''이면 파라미터 제외
            sort: sort || undefined        // ''이면 파라미터 제외
        }
    });
};

// 관리자: 특정 유저 정보 수정 (ROLE / STATUS)
export const updateAdminUser = (userCode, data) => {
    return api.patch(`/admin/users/modify/${userCode}`, data);
};