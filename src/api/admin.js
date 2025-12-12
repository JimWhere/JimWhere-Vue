
import api from "@/axios";




export async function adminInOutHistoryAll({ page, size }) {
    return await api.get('/admin/inout/history', {
      params: {
        page: page - 1,
        size: size,
      }
    });
}

export async function adminInquiryAll({ page, size }) {
  return await api.get('/admin/inquiry', {
    params: {
      page: page - 1,
      size: size,
    }
  });
}

export async function adminInquiryAnswer(code,answer) {
  return await api.put(`/admin/inquiry/${code}`,answer, {
  });
}
export async function adminInquiryDelete(code) {
  return await api.delete(`/admin/inquiry/${code}`, {
  });
}

export async function adminNoticeCreate(request) {
  return await api.post(`/admin/notice`, request,{
  });
}
export async function adminNoticeUpdate(code,request) {
  return await api.put(`/admin/notice/${code}`, request,{
  });
}
export async function adminNoticeDelete(code) {
  return await api.delete(`/admin/notice/${code}`, {
  });
}export async function adminBoxListAll() {
  return await api.get('/admin/room/boxes', {
  });
}
export async function adminReservationAll({ page, size }) {
    return await api.get("/admin/reservations", {
        params: {
            page: page - 1,
            size: size,
        },
    });
}
