import api from "@/axios";

export async function checkOverlap(roomCode, startAt, endAt) {
  const res = await api.get('/user/reservations/check', {
    params: { roomCode, startAt, endAt }
  });
  return res.data?.data ?? res.data;
}

export async function createReservation(payload) {
  const res = await api.post('/user/reservations', payload);
  return res.data?.data ?? res.data;
}

export function fetchReservedRanges(roomCode, from, to) {
    return api.get(`/room/${roomCode}/reservations`, { params: { from, to } })
}