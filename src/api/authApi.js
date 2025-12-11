import api from "@/axios";

// 회원가입
export const signupApi = (data) => {
    return api.post("/auth/signup", data);
};

// 로그인
export const loginApi = (userId, password) => {
    return api.post("/auth/login", { userId, password });
};

// 토큰 재발급
export const refreshApi = () => api.post("/auth/refresh");

// 로그아웃
export const logoutApi = () => api.delete("/auth/logout");

// 내 정보 조회
export const getUserMe = () => api.get("/user/users/me");


// 아이디 중복 확인
export const checkDuplicateIdApi = (userId) => {
    return api.post("/auth/check-duplicate-id", { userId });
};
// 전화번호 중복 확인
export const checkDuplicatePhoneApi = (phone) => {
    return api.post("/auth/check-duplicate-phone", { phone });
};

// 사업자번호 중복 확인
export const checkDuplicateBusinessApi = (businessNumber) =>
    api.post("/auth/check-duplicate-business", { businessNumber });