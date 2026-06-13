import api from "./axios.js";

export const orderAPI = {
  create: (data) => api.post("/orders", data),
  myOrders: (params) => api.get("/orders/my-orders", { params }),
  getOne: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`), // ← FIX: era POST, debe ser PUT
};
