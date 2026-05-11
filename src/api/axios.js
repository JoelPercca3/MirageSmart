import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request: adjunta el token JWT automáticamente ─────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: manejo de errores y refresh token ───────────
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const original = error.config;

    // Si el token expiró y no hemos reintentado aún
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post("/api/v1/auth/refresh", { refreshToken });
        const { accessToken, refreshToken: newRefresh } = res.data.data.tokens;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefresh);

        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        // Refresh falló — limpiar sesión
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error.response?.data || error);
  },
);

export default api;
