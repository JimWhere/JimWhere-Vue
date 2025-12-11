import api from "@/axios";

// 내정보 조회
export const getMyUserInfoApi = () => {
    return api.get("/user/users/me");
};

// 전화번호 수정
export const updateUserPhoneApi = (newPhone) => {
    return api.patch("/user/users/modify", {
        newPhoneNumber: newPhone
    });
};

// 회원 탈퇴
export const deleteUserApi = () => {
    return api.delete("/user/users/withdraw");
};