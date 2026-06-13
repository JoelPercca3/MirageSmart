import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { orderAPI } from "../api/order.api.js";
import useAuthStore from "../store/useAuthStore.js";

export const useOrders = (params) => {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      const response = await orderAPI.myOrders(params);
      return response;
    },
    select: (res) => res,
    enabled: !!token,
  });
};

export const useOrder = (id) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: () => orderAPI.getOne(id),
    select: (res) => res.data,
    enabled: !!id,
  });

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: orderAPI.create,
    // ✅ Sin efectos secundarios — CheckoutPage maneja todo
    // el carrito y la navegación se limpian DESPUÉS del pago en handleCulqiPayment
    onError: (err) => toast.error(err.message || "Error al crear el pedido"),
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderAPI.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido cancelado");
    },
    onError: (err) =>
      toast.error(err.message || "No se puede cancelar este pedido"),
  });
};
