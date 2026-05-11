import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth.api.js";
import useAuthStore from "../store/useAuthStore.js";
import useCartStore from "../store/useCartStore.js";

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.tokens);
      toast.success(`¡Bienvenido, ${res.data.user.nombre}!`);
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message || "Credenciales incorrectas");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      toast.success("¡Cuenta creada! Revisa tu email para verificarla.");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err.message || "Error al registrarse");
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const { clearCart } = useCartStore();
  const navigate = useNavigate();

  return () => {
    authAPI.logout().catch(() => {});
    logout();
    clearCart();
    toast.success("Sesión cerrada");
    navigate("/");
  };
};

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (email) => authAPI.forgotPassword(email),
    onSuccess: () =>
      toast.success("Si el email existe, recibirás un enlace en tu correo."),
    onError: (err) => toast.error(err.message || "Error al enviar el email"),
  });
