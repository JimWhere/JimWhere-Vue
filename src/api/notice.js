import api from "@/axios.js";

export async function noticeAll({ page, size }) {
  return await api.get('/notice', {
    params: {
      page: page - 1,
      size: size,
    }
  });
}
export async function noticeDetail(code) {
  return await api.get(`/notice/${code}`, {
  });
}