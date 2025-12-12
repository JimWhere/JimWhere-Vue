
import api from "@/axios";



const token = localStorage.getItem("accessToken");
export async function adminAccessHistoryAll({ page, size }) {
  return await api.get('/admin/access/history', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: page - 1,
      size: size,
    }
  });
}
export async function adminInOutHistoryAll({ page, size }) {
    return await api.get('/admin/inout/history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: page - 1,
        size: size,
      }
    });
}
export async function noticeAll({ page, size }) {
  return await api.get('/notice', {
    params: {
      page: page - 1,
      size: size,
    }
  });
}
export async function adminInquiryAll({ page, size }) {
  return await api.get('/admin/inquiry', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: page - 1,
      size: size,
    }
  });
}
export async function inquiryDetail(code) {
  return await api.get(`/inquiry/${code}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function adminInquiryAnswer(code,answer) {
  return await api.put(`/admin/inquiry/${code}`,answer, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function adminInquiryDelete(code) {
  return await api.delete(`/admin/inquiry/${code}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function noticeDetail(code) {
  return await api.get(`/notice/${code}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function adminNoticeCreate(request) {
  return await api.post(`/admin/notice`, request,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function adminNoticeUpdate(code,request) {
  return await api.put(`/admin/notice/${code}`, request,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function adminNoticeDelete(code) {
  return await api.delete(`/admin/notice/${code}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}export async function adminBoxListAll() {
  return await api.get('/admin/room/boxes', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function adminReservationAll({ page, size }) {
    return await api.get('/admin/reservations', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            page: page - 1,
            size: size,
        }
    });
}
