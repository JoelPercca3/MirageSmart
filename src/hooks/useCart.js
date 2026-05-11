import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cartAPI } from "../api/cart.api.js";
import useCartStore from "../store/useCartStore.js";
import useAuthStore from "../store/useAuthStore.js";

export const useCart = () => {
  const { setCart } = useCartStore();
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await cartAPI.getCart();
      setCart(res.data);
      return res.data;
    },
    enabled: !!token,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { openCart } = useCartStore();

  return useMutation({
    mutationFn: cartAPI.addItem,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      openCart();
      toast.success("¡Agregado al carrito!");
    },
    onError: (err) => toast.error(err.message || "Error al agregar al carrito"),
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cantidad }) => cartAPI.updateItem(id, cantidad),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: (err) => toast.error(err.message || "Error al actualizar"),
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Producto eliminado del carrito");
    },
    onError: (err) => toast.error(err.message || "Error al eliminar"),
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: cartAPI.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      clearCart();
    },
  });
};

export const useApplyCoupon = () => {
  return useMutation({
    mutationFn: cartAPI.applyCoupon,
    onSuccess: (res) =>
      toast.success(`Cupón aplicado — descuento: S/ ${res.data.descuento}`),
    onError: (err) => toast.error(err.message || "Cupón inválido"),
  });
};
