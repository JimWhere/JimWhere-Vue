import api from "@/axios";

// 사업자 진위 확인 (대표자 + 개업일 포함)
export const validateBusinessApi = (data) => {
    return api.post("/auth/business/validate", data);
};

// 휴폐업 조회 (원하면 사용)
export const businessStatusApi = (bno) => {
    return api.post("/auth/business/status", { bno });
};

// 진위확인 + 정보조회 통합 API
export const businessCheckApi = (data) => {
    return api.post("/auth/business/check", data);
};