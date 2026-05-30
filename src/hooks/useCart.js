import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cartAPI } from "../api/cart.api.js";
import api from "../api/axios.js"; // ← IMPORTANTE: Agregar esta línea
import useCartStore from "../store/useCartStore.js";
import useAuthStore from "../store/useAuthStore.js";
import { productAPI } from "../api/product.api.js"; // ← Para obtener datos del producto

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

// 🔥 Hook para obtener producto por ID (si no existe)
const getProductById = async (id) => {
  try {
    const res = await productAPI.getOne(id);
    return res.data;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return null;
  }
};

// 🔥 useAddToCart CORREGIDO
export const useAddToCart = () => {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ product_id, variant_id, cantidad }) => {
      if (token) {
        // Usuario logueado: enviar al backend
        const res = await cartAPI.addItem({ product_id, variant_id, cantidad });
        return res.data;
      } else {
        // Usuario NO logueado: guardar en localStorage
        const currentItems = useCartStore.getState().items;
        const existingIndex = currentItems.findIndex(
          (i) => i.product_id === product_id && i.variant_id === variant_id,
        );

        let newItems;
        if (existingIndex >= 0) {
          newItems = [...currentItems];
          newItems[existingIndex].cantidad += cantidad;
        } else {
          // Obtener datos del producto
          const product = await getProductById(product_id);
          if (!product) {
            throw new Error("Producto no encontrado");
          }

          // Obtener datos de la variante si existe
          let variantInfo = null;
          let precioExtra = 0;
          if (variant_id && product.variants) {
            variantInfo = product.variants.find((v) => v.id === variant_id);
            if (variantInfo) {
              precioExtra = Number(variantInfo.precio_extra) || 0;
            }
          }

          const precioUnitario =
            (product.precio_oferta || product.precio_base) + precioExtra;

          newItems = [
            ...currentItems,
            {
              id: Date.now(), // ID temporal
              product_id: product_id,
              variant_id: variant_id || null,
              nombre: product.nombre,
              precio_unitario: precioUnitario,
              cantidad: cantidad,
              imagen:
                product.imagen_principal || product.images?.[0]?.url || null,
              variante_opciones: variantInfo?.opciones
                ? JSON.stringify(variantInfo.opciones)
                : null,
            },
          ];
        }

        // Actualizar store y guardar en localStorage
        useCartStore.setState({ items: newItems });
        useCartStore.getState().recalcTotals(); // ← AGREGAR ESTA LÍNEA

        useCartStore.getState().saveCartToLocal();

        return { success: true, local: true };
      }
    },
    onSuccess: (data) => {
      toast.success("Producto agregado al carrito");
      // Si el usuario está logueado, refrescar el carrito
      if (token) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Error al agregar al carrito");
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const { setCart } = useCartStore();

  return useMutation({
    mutationFn: ({ id, cantidad }) => cartAPI.updateItem(id, cantidad),
    onSuccess: async () => {
      // Refrescar el carrito desde el backend
      if (token) {
        const res = await cartAPI.getCart();
        setCart(res.data);
      }
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => toast.error(err.message || "Error al actualizar"),
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const { setCart } = useCartStore();

  return useMutation({
    mutationFn: cartAPI.removeItem,
    onSuccess: async () => {
      // Refrescar el carrito desde el backend
      if (token) {
        const res = await cartAPI.getCart();
        setCart(res.data);
      }
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Producto eliminado del carrito");
    },
    onError: (err) => toast.error(err.message || "Error al eliminar"),
  });
};
export const useClearCart = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const { clearCart, clearLocalCart } = useCartStore();

  return useMutation({
    mutationFn: async () => {
      if (token) {
        return cartAPI.clearCart();
      } else {
        clearLocalCart();
        clearCart();
        return { success: true };
      }
    },
    onSuccess: () => {
      if (token) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
      clearCart();
      toast.success("Carrito vaciado");
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
