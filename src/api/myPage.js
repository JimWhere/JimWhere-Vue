
import api from "@/axios";

const token = localStorage.getItem("accessToken");
export async function userEntryHistory({ page, size }) {
  return await api.get('/user/access/history', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: page - 1,
      size: size,
    }
  });
}
export async function entryHistoryDetail(code) {
  return await api.get(`/access/history/${code}` ,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function userInoutHistory({ page, size }) {
  return await api.get('/user/inout/history', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: page - 1,
      size: size,
    }
  });
}export async function updateInOutHistory(code,payload) {
  return  api.put(`/user/inout/history/${code}`, payload,{
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}
export async function userInquiryList({page,size}) {
  return await api.get('/user/inquiry', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: page - 1,
      size: size,
    }
  });
}
export async function inquiryCreate(request) {
  return await api.post('/user/inquiry',request, {
    headers: {
      Authorization: `Bearer ${token}`,
    }}
);
}

export async function userReservationList({ page, size }) {
    return await api.get("/user/reservations", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            page: page - 1,   // 백엔드 Pageable 0-base
            size: size,
        },
    });
}
