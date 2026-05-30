import api from "./axios.js";

export const orderAPI = {
  create: (data) => api.post("/orders", data),
  myOrders: (params) => {
    console.log("myOrders - params enviados:", params);
    return api.get("/orders/my-orders", { params });
  },
  getOne: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
};
