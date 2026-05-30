import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items: [],
  subtotal: 0,
  total_items: 0,
  isOpen: false,

  // 🔥 Función para recalcular subtotal y total_items
  recalcTotals: () => {
    const items = get().items;
    const subtotal = items.reduce((acc, item) => {
      return acc + Number(item.precio_unitario) * item.cantidad;
    }, 0);
    const total_items = items.reduce((acc, item) => acc + item.cantidad, 0);
    set({ subtotal, total_items });
    return { subtotal, total_items };
  },

  setCart: (cart) =>
    set({
      items: cart.items || [],
      subtotal: cart.subtotal || 0,
      total_items: cart.total_items || 0,
    }),

  clearCart: () => set({ items: [], subtotal: 0, total_items: 0 }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  // 🔥 FUNCIÓN CORREGIDA
  saveCartToLocal: () => {
    const { items, subtotal, total_items } = get();
    // Si los totals están mal, recalcular
    let finalSubtotal = subtotal;
    let finalTotalItems = total_items;

    if (items.length > 0 && (subtotal === 0 || total_items === 0)) {
      finalSubtotal = items.reduce((acc, item) => {
        return acc + Number(item.precio_unitario) * item.cantidad;
      }, 0);
      finalTotalItems = items.reduce((acc, item) => acc + item.cantidad, 0);
      set({ subtotal: finalSubtotal, total_items: finalTotalItems });
    }

    const cartData = {
      items,
      subtotal: finalSubtotal,
      total_items: finalTotalItems,
    };
    console.log("💾 Guardando en localStorage:", cartData);
    localStorage.setItem("guestCart", JSON.stringify(cartData));
  },

  // 🔥 FUNCIÓN CORREGIDA
  loadCartFromLocal: () => {
    const saved = localStorage.getItem("guestCart");
    console.log("📥 Cargando desde localStorage:", saved);
    if (saved) {
      try {
        const cart = JSON.parse(saved);
        // Recalcular totals por si están corruptos
        const subtotal = cart.items.reduce((acc, item) => {
          return acc + Number(item.precio_unitario) * item.cantidad;
        }, 0);
        const total_items = cart.items.reduce(
          (acc, item) => acc + item.cantidad,
          0,
        );

        set({
          items: cart.items || [],
          subtotal: subtotal,
          total_items: total_items,
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
