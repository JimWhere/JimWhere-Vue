import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api/v1",
  withCredentials: true, // 쿠키(refreshToken) 받기 위해 필수
});

export const loginApi = (userEmail, password) => {
  return api.post("/auth/login", {
    userId: userEmail,
    password: password,
  });
};

export const refreshApi = () => api.post("/auth/refresh");

export const logoutApi = () => api.delete("/auth/logout");

export const getUserMe = () => api.get("/user/users/me");


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
