import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // ganti sesuai port backend
});

// (Opsional) inject JWT token kalau pakai auth
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;

// Axios akan menjadi jembatan frontend ↔ backend