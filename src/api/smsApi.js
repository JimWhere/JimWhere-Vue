import api from "@/axios";

// 인증번호 발송
export const sendSmsApi = (phone) => {
    return api.post("/auth/sms/send", { phone });
};

// 인증번호 검증
export const verifySmsApi = (phone, code) => {
    return api.post("/auth/sms/verify", { phone, code });
};