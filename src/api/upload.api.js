// src/api/upload.api.js
import api from "./axios.js";

const headers = { "Content-Type": "multipart/form-data" };

export const uploadAPI = {
  /** Admin — sube una imagen de producto */
  uploadProduct: (formData) =>
    api.post("/uploads/product", formData, { headers }),

  /** Admin — sube varias imágenes de producto */
  uploadProducts: (formData) =>
    api.post("/uploads/products", formData, { headers }),

  /** Admin — sube un banner */
  uploadBanner: (formData) =>
    api.post("/uploads/banner", formData, { headers }),

  /** Admin — sube imagen de categoría */
  uploadCategory: (formData) =>
    api.post("/uploads/category", formData, { headers }),

  /** Usuario autenticado — sube imagen de reseña */
  uploadReview: (formData) =>
    api.post("/uploads/review", formData, { headers }),

  /** Usuario autenticado — sube avatar de perfil */
  uploadAvatar: (formData) =>
    api.post("/uploads/avatar", formData, { headers }),
};
