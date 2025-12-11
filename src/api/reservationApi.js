// src/api/admin.js
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE  // 예: http://localhost:8081
const TOKEN_KEY = 'accessToken'                 // 나중에 admin 토큰 분리하면 여기만 교체

export async function fetchAdminReservations({ page, size }) {
    const token = localStorage.getItem(TOKEN_KEY)

    return await axios.get(
        `${API_BASE}/api/v1/admin/reservations`,
        {
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
            },
            params: {
                page: page - 1,   // 백엔드 Pageable 0-base
                size,
            },
        }
    )
}

export async function fetchAdminReservationDetail(reservationCode) {
    const token = localStorage.getItem(TOKEN_KEY)

    return await axios.get(
        `${API_BASE}/api/v1/admin/reservations/${reservationCode}`,
        {
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
            },
        }
    )
}
