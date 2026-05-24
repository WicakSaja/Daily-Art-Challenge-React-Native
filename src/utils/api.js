import axios from "axios";

export const BASE_URL = "https://6a01954136fb6ad04de135c9.mockapi.io/api";

// Instance Axios dengan base URL dan header default
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10 detik
});

// ─── Challenges ───────────────────────────────────────────────

/** GET  /challenges  → ambil semua challenge */
export const getChallenges = () => api.get("/challenges");

/** GET  /challenges/:id  → ambil satu challenge berdasarkan id */
export const getChallengeById = (id) => api.get(`/challenges/${id}`);

/** POST /challenges  → kirim challenge baru */
export const postChallenge = (data) => api.post("/challenges", data);

/** PUT  /challenges/:id  → perbarui challenge yang sudah ada */
export const putChallenge = (id, data) => api.put(`/challenges/${id}`, data);

/** DELETE /challenges/:id  → hapus challenge */
export const deleteChallenge = (id) => api.delete(`/challenges/${id}`);

export default api;
