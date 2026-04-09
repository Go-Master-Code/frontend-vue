import api from "./api";

// GET semua presensi
export const getAllPresensi = () => api.get("/api/presensi");

// POST presensi (check-in / check-out)
export const createPresensi = (payload) => api.post("/api/presensi", payload);