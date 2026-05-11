import api from "./axios.js";

export const cartAPI = {
  getCart: () => api.get("/cart"),
  addItem: (data) => api.post("/cart/add", data),
  updateItem: (id, cantidad) => api.put(`/cart/item/${id}`, { cantidad }),
  removeItem: (id) => api.delete(`/cart/item/${id}`),
  clearCart: () => api.delete("/cart/clear"),
  applyCoupon: (coupon_code) => api.post("/cart/apply-coupon", { coupon_code }),
};
