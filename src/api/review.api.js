import api from "./axios.js";

export const reviewAPI = {
  getByProduct: (productId, params) =>
    api.get(`/reviews/product/${productId}`, { params }),
  create: (data) => api.post("/reviews", data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  remove: (id) => api.delete(`/reviews/${id}`),
  markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
};
