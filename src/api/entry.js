import api from '@/axios'

export async function createEntry(payload) {
  return  api.post(`/user/access/history`, payload,{
  });
}
export async function verifyToken(token) {
  return api.post('/entry/verify', { token })
}
