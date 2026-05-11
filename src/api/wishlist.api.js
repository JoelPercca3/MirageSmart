import api from "./axios.js";

export const wishlistAPI = {
  getWishlist: () => api.get("/wishlist"),
  toggle: (productId) => api.post(`/wishlist/${productId}`),
  clearAll: () => api.delete("/wishlist"),
};
