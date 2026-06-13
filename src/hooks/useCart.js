import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cartAPI } from "../api/cart.api.js";
import api from "../api/axios.js";
import useCartStore from "../store/useCartStore.js";
import useAuthStore from "../store/useAuthStore.js";
import { productAPI } from "../api/product.api.js";

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
        const res = await cartAPI.addItem({ product_id, variant_id, cantidad });
        const cartRes = await cartAPI.getCart();
        useCartStore.getState().setCart(cartRes.data);
        return res.data;
      } else {
        const currentItems = useCartStore.getState().items;
        const existingIndex = currentItems.findIndex(
          (i) => i.product_id === product_id && i.variant_id === variant_id,
        );

        let newItems;
        if (existingIndex >= 0) {
          newItems = [...currentItems];
          newItems[existingIndex].cantidad += cantidad;
        } else {
          const product = await getProductById(product_id);
          if (!product) throw new Error("Producto no encontrado");

          let variantInfo = null;
          let precioExtra = 0;
          let variantOptions = null;
          let variantImage = null;

          if (variant_id && product.variants) {
            variantInfo = product.variants.find((v) => v.id === variant_id);
            if (variantInfo) {
              precioExtra = Number(variantInfo.precio_extra) || 0;
              variantOptions = variantInfo.opciones;
              if (product.images) {
                const foundImage = product.images.find(
                  (img) => img.variant_id === variant_id,
                );
                if (foundImage) variantImage = foundImage.url;
              }
            }
          }

          const precioUnitario =
            (product.precio_oferta || product.precio_base) + precioExtra;

          newItems = [
            ...currentItems,
            {
              id: Date.now(),
              product_id: product_id,
              variant_id: variant_id || null,
              nombre: product.nombre,
              precio_unitario: precioUnitario,
              cantidad: cantidad,
              imagen:
                variantImage ||
                product.imagen_principal ||
                product.images?.[0]?.url ||
                null,
              variante_opciones: variantOptions
                ? JSON.stringify(variantOptions)
                : null,
            },
          ];
        }

        useCartStore.setState({ items: newItems });
        useCartStore.getState().recalcTotals();
        useCartStore.getState().saveCartToLocal();

        return { success: true, local: true };
      }
    },
    onSuccess: (data) => {
      toast.success("Producto agregado al carrito");
      if (token) {
        useCartStore.getState().loadCartFromLocal();
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
