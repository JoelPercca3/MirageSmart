import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("accessToken") || null,

  setAuth: (user, tokens) => {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token: tokens.accessToken });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  updateUser: (data) => {
    const updated = { ...JSON.parse(localStorage.getItem("user")), ...data };
    localStorage.setItem("user", JSON.stringify(updated));
    set({ user: updated });
  },

  isAuthenticated: () => !!localStorage.getItem("accessToken"),
}));

export default useAuthStore;
