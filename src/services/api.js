import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // ganti sesuai port backend
});

// ==============================
// 🔥 AUTO ATTACH JWT TOKEN
// ==============================
api.interceptors.request.use((config) => {
  // ambil token dari localStorage
  const token = localStorage.getItem("token");

  // jika ada token
  if (token) {
    // attach Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

// Axios akan menjadi jembatan frontend ↔ backend