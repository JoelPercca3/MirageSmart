import api from "./axios.js";

export const categoryAPI = {
  getAll: () => api.get("/categories"),
  getOne: (id) => api.get(`/categories/${id}`),
  getProducts: (id, params) =>
    api.get(`/categories/${id}/products`, { params }),
};
