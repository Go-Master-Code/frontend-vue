import api from "./api";

// GET all karyawan
export const getAllKaryawan = () => api.get("/api/karyawan");

// PUT update karyawan berdasarkan ID
export const updateKaryawan = (id, data) => api.put(`/api/karyawan/${id}`, data);

// DELETE karyawan berdasarkan ID
export const deleteKaryawan = (id) => api.delete(`/api/karyawan/${id}`);