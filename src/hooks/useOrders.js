import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { orderAPI } from "../api/order.api.js";
import useAuthStore from "../store/useAuthStore.js";

export const useOrders = (params) => {
  const token = useAuthStore((s) => s.token);
  console.log("Token en useOrders:", token); // ← Agrega esto

  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      console.log("Llamando a orderAPI.myOrders con params:", params);
      const response = await orderAPI.myOrders(params);
      console.log("Respuesta completa de myOrders:", response);
      return response;
    },
    select: (res) => {
      console.log("Select - res:", res);
      return res;
    },
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
  const queryClient = useQueryClient();
  // const navigate = useNavigate();

  return useMutation({
    mutationFn: orderAPI.create,
    onSuccess: (res) => {
      // queryClient.invalidateQueries({ queryKey: ["cart"] });
      // queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("¡Pedido creado exitosamente!");
      // navigate(`/order-success/${res.data.id}`);
    },
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
