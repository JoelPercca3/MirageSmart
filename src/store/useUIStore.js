import { create } from "zustand";

const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  searchQuery: "",

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () =>
    set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  setSearchQuery: (q) => set({ searchQuery: q }),
}));

export default useUIStore;
