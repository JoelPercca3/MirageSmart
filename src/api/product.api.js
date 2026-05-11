import api from "./axios.js";

export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getOne: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get("/products/featured"),
  search: (q, params) =>
    api.get("/products/search", { params: { q, ...params } }),
  getRelated: (id) => api.get(`/products/${id}/related`),
  getReviews: (id, params) => api.get(`/products/${id}/reviews`, { params }),
};
