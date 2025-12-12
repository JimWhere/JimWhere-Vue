
import api from "@/axios";



export async function userInoutHistory({ page, size }) {
  return await api.get('/user/inout/history', {
    params: {
      page: page - 1,
      size: size,
    }
  });
}export async function updateInOutHistory(code,payload) {
  return  api.put(`/user/inout/history/${code}`, payload,{
  });
}
export async function userInquiryList({page,size}) {
  return await api.get('/user/inquiry', {
    params: {
      page: page - 1,
      size: size,
    }
  });
}

export async function inquiryCreate(request) {
  return await api.post('/user/inquiry',request, {

  }
);
}
export async function userBoxList() {
  return await api.get('/user/room/boxes', {
  });
}
export async function userAvailableBoxCount() {
  return await api.get('/user/boxes/count', {
  });
}