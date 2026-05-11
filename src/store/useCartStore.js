import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items: [],
  subtotal: 0,
  total_items: 0,
  isOpen: false,

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
}));

export default useCartStore;
