import api from '@/axios'

// 특정 방의 박스목록 반환
export async function listBoxesByRoom(roomCode) {
  const res = await api.get(`/room/${roomCode}/boxes`)
  return res.data
}

// 특정 방의 이용가능한 박스개수 반환
export async function countAvailableBoxes(roomCode, status = 'Y') {
  const res = await api.get(`/room/${roomCode}/boxes/count`, { params: { status } })
  return res.data
}

// 특정 방의 총재고수 반환
export async function getTotalBoxCurrentCount(roomCode) {
  const res = await api.get(`/room/${roomCode}/boxes/total`)
  return res.data
}

export default {
  listBoxesByRoom,
  countAvailableBoxes,
  getTotalBoxCurrentCount,
}