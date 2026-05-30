import api from "./axios.js";

export const paymentAPI = {
  createCharge: (data) => api.post("/payments/charge", data),
  createIntent: (data) => api.post("/payments/create-intent", data),
  getByOrder: (orderId) => api.get(`/payments/order/${orderId}`),
};
