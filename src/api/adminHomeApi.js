import api from "@/axios";

export const fetchUserStats = async () => {
    const { data } = await api.get("/admin/users/stat");
    return data.data;   // { total, active, inactive }
};


// 전체 방 조회
export const fetchRoomList = async () => {
    const res = await api.get("/room");  // ← 반드시 이 URL
    return res.data.data; // 전체 방 리스트 반환
};


// 방 타입별 사용 현황(룸코드순서)
export const fetchRoomStats = async () => {
    const { data } = await api.get("room/rooms/stat");
    return data.data;
};

// 예약 현황 최근 3건 조회
export const fetchLatestReservations = async () => {
    const res = await api.get("/admin/reservations/latest?limit=3");
    return res.data.data;
};

// 문의사항 갯수 , 처리상태
export const fetchInquiryStats = async () => {
    const res = await api.get("/admin/inquiry/stats");
    return res.data.data;  // { total, completed, pending }
};