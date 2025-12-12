import api from "@/axios.js";

export async function inquiryDetail(code) {
  return await api.get(`/inquiry/${code}`, {
  });
}