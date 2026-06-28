import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items: [],
  subtotal: 0,
  total_items: 0,
  isOpen: false,

  recalcTotals: () => {
    const items = get().items;
    const subtotal = items.reduce((acc, item) => {
      return acc + Number(item.precio_unitario) * item.cantidad;
    }, 0);
    const total_items = items.reduce((acc, item) => acc + item.cantidad, 0);
    set({ subtotal, total_items });
    return { subtotal, total_items };
  },

  setCart: (cart) => {
    const items = (cart.items || []).map((item) => ({
      // ── IDs y cantidades ──────────────────────────────
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      cantidad: item.cantidad,
      // ── Precios ───────────────────────────────────────
      precio_unitario: item.precio_unitario,
      precio_extra: item.precio_extra,
      precio_base: item.precio_base, // ← para precio tachado
      precio_oferta: item.precio_oferta, // ← por si acaso
      // ── Info del producto ─────────────────────────────
      nombre: item.nombre, // ← nombre real del producto
      product_name: item.product_name, // ← fallback
      descripcion_corta: item.descripcion_corta,
      sku: item.sku,
      // ── Rating y ventas (NUEVO) ───────────────────────
      rating_promedio: item.rating_promedio,
      rating_count: item.rating_count,
      ventas_count: item.ventas_count,
      // ── Variante e imagen ─────────────────────────────
      variant_opciones: item.variant_opciones,
      imagen: item.imagen,
    }));

    set({
      items,
      subtotal: cart.subtotal || 0,
      total_items: cart.total_items || 0,
    });
  },

  clearCart: () => set({ items: [], subtotal: 0, total_items: 0 }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  saveCartToLocal: () => {
    const { items, subtotal, total_items } = get();
    localStorage.setItem(
      "guestCart",
      JSON.stringify({ items, subtotal, total_items }),
    );
  },

  loadCartFromLocal: () => {
    const saved = localStorage.getItem("guestCart");
    if (saved) {
      try {
        const cart = JSON.parse(saved);
        set({
          items: cart.items || [],
          subtotal: cart.subtotal || 0,
          total_items: cart.total_items || 0,
        });
        return cart.items || [];
      } catch (e) {
        console.error("Error al cargar carrito local:", e);
      }
    }
    return [];
  },

  clearLocalCart: () => {
    localStorage.removeItem("guestCart");
  },
}));

export default useCartStore;
