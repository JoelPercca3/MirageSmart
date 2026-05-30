import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Package,
  LogOut,
  ChevronRight,
  Grid3x3,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../../store/useAuthStore.js";
import useCartStore from "../../store/useCartStore.js";
import useUIStore from "../../store/useUIStore.js";
import { useLogout } from "../../hooks/useAuth.js";
import { categoryAPI } from "../../api/category.api.js";
import { productAPI } from "../../api/product.api.js";
import logo from "../../assets/logoOficial.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showUser, setShowUser] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoriesWithSub, setCategoriesWithSub] = useState([]);
  const [isCompact, setIsCompact] = useState(false);
  const [showCompactCategories, setShowCompactCategories] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const searchRef = useRef(null);
  const searchTimer = useRef(null);
  const userMenuRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const categoryTimeoutRef = useRef(null);
  const compactMenuRef = useRef(null);
  const location = useLocation();

  const { user } = useAuthStore();
  const { total_items, openCart } = useCartStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const logout = useLogout();
  const navigate = useNavigate();

  // 👈 Efecto para ocultar navbar al hacer scroll (funciona en home y product detail)
  useEffect(() => {
    const isProductPage = location.pathname.includes("/products/");

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // En ambas páginas (home y product detail): ocultar al bajar, mostrar al subir
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll hacia abajo y no está en la parte superior
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
        // Scroll hacia arriba o en la parte superior
        setIsNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 👈 Efecto para compact mode en product detail
  useEffect(() => {
    const isProductPage = location.pathname.includes("/products/");
    setIsCompact(isProductPage);
    setScrolled(window.scrollY > 20);
  }, [location.pathname]);

  // Obtener categorías
  const { data: rawCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryAPI.getAll,
    select: (res) => res.data || [],
  });

  // Procesar categorías
  useEffect(() => {
    if (rawCategories && rawCategories.length > 0) {
      const mainCategories = rawCategories.filter((cat) => !cat.parent_id);
      const categoriesWithChildren = mainCategories.map((mainCat) => ({
        ...mainCat,
        subcategorias: rawCategories.filter(
          (sub) => sub.parent_id === mainCat.id,
        ),
      }));
      setCategoriesWithSub(categoriesWithChildren.slice(0, 7));
    }
  }, [rawCategories]);

  // Timer para cerrar el menú de categorías con delay
  const handleCategoryMouseEnter = (category) => {
    if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
    setActiveCategory(category);
  };

  const handleCategoryMouseLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => setActiveCategory(null), 150);
  };

  const handleMegaMenuEnter = () => {
    if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
  };

  const handleMegaMenuLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => setActiveCategory(null), 150);
  };

  // Manejar menú compacto
  const handleCompactMenuMouseEnter = () => {
    if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
    setShowCompactCategories(true);
  };

  const handleCompactMenuMouseLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setShowCompactCategories(false);
    }, 150);
  };

  const handleCompactMegaMenuEnter = () => {
    if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
  };

  const handleCompactMegaMenuLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setShowCompactCategories(false);
    }, 150);
  };

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    closeMobileMenu();
    setShowSearch(false);
    setShowUser(false);
    setIsSearchActive(false);
    setActiveCategory(null);
    setShowCompactCategories(false);
  }, [location.pathname]);

  // Cerrar búsqueda al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
        setShowSearch(false);
      }
    };
    if (isSearchActive) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSearchActive]);

  // Búsqueda en tiempo real
  useEffect(() => {
    if (!searchInput.trim() || searchInput.length < 2) {
      setSearchResults([]);
      return;
    }
    clearTimeout(searchTimer.current);
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await productAPI.search(searchInput.trim(), { limit: 5 });
        setSearchResults(res.data?.slice(0, 5) || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [searchInput]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput("");
      setSearchResults([]);
      setShowSearch(false);
      setIsSearchActive(false);
    }
  };

  const handleResultClick = (id) => {
    navigate(`/products/${id}`);
    setSearchInput("");
    setSearchResults([]);
    setShowSearch(false);
    setIsSearchActive(false);
  };

  const handleSearchFocus = () => {
    setIsSearchActive(true);
    setShowSearch(true);
    setShowUser(false);
    setActiveCategory(null);
    setShowCompactCategories(false);
  };

  const handleSearchClose = () => {
    setIsSearchActive(false);
    setShowSearch(false);
  };

  return (
    <>
      {/* Fondos oscuros */}
      <AnimatePresence>
        {showUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setShowUser(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setIsSearchActive(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(activeCategory || showCompactCategories) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => {
              setActiveCategory(null);
              setShowCompactCategories(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Barra superior - siempre visible */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky top-0 z-50 bg-gray-900 text-white text-xs text-center py-4 font-medium border-b border-gray-800"
      >
        <span className="tracking-wide">🚚 Envío gratis desde S/ 150</span>
        <span className="mx-2 text-gray-500">|</span>
        <span className="text-gray-300">Ofertas exclusivas todos los días</span>
      </motion.div>

      {/* Navbar principal - se oculta/muestra con scroll */}
      <motion.header
        animate={{ y: isNavbarVisible ? 0 : -200 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`bg-white transition-all duration-300 ${
          scrolled && isNavbarVisible ? "shadow-lg" : "shadow-sm"
        }`}
        style={{ position: "sticky", top: 0, zIndex: 40 }}
      >
        {/* Navbar principal */}
        <div
          className={`max-w-7xl mx-auto pl-1 pr-4 py-3 flex items-center ${isCompact ? "gap-4" : "gap-24"}`}
        >
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 -ml-8">
            <img
              src={logo}
              alt="MirageMart"
              className={`transition-all duration-300 ${isCompact ? "w-32 md:w-24 h-auto" : "w-44 md:w-32 h-auto"}`}
            />
          </Link>

          {/* Botón de categorías en modo compacto */}
          {isCompact && (
            <div
              className="relative"
              ref={compactMenuRef}
              onMouseEnter={handleCompactMenuMouseEnter}
              onMouseLeave={handleCompactMenuMouseLeave}
            >
              <button className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
                <Grid3x3 size={18} className="text-gray-700" />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  Categorías
                </span>
                <ChevronDown
                  size={14}
                  className={`text-gray-500 transition-transform duration-200 ${showCompactCategories ? "rotate-180" : ""}`}
                />
              </button>

              {/* Mega menú compacto */}
              <AnimatePresence>
                {showCompactCategories && categoriesWithSub.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50"
                    onMouseEnter={handleCompactMegaMenuEnter}
                    onMouseLeave={handleCompactMegaMenuLeave}
                  >
                    <div className="max-h-96 overflow-y-auto">
                      {categoriesWithSub.map((cat) => (
                        <div key={cat.id} className="group relative">
                          <Link
                            to={`/category/${cat.id}`}
                            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowCompactCategories(false)}
                          >
                            <span className="text-sm text-gray-700">
                              {cat.nombre}
                            </span>
                            {cat.subcategorias?.length > 0 && (
                              <ChevronRight
                                size={14}
                                className="text-gray-400"
                              />
                            )}
                          </Link>
                          {/* Subcategorías dentro del menú compacto */}
                          {cat.subcategorias?.length > 0 && (
                            <div className="pl-4">
                              {cat.subcategorias.slice(0, 5).map((sub) => (
                                <Link
                                  key={sub.id}
                                  to={`/category/${sub.id}`}
                                  className="block px-4 py-1.5 text-xs text-gray-500 hover:text-red-500 hover:bg-gray-50"
                                  onClick={() =>
                                    setShowCompactCategories(false)
                                  }
                                >
                                  {sub.nombre}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Buscador desktop */}
          <div
            className={`flex-1 ${isCompact ? "max-w-2xl" : "max-w-xl"}`}
            ref={searchRef}
          >
            <form onSubmit={handleSearch} className="relative">
              <div
                className={`flex border-1 rounded-xl overflow-hidden transition-all duration-300 ${
                  isSearchActive
                    ? "border-black"
                    : showSearch
                      ? "border-red-400"
                      : "border-gray-200"
                } ${isSearchActive ? "relative z-50 bg-white" : ""}`}
              >
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowSearch(true);
                  }}
                  onFocus={handleSearchFocus}
                  placeholder="Buscar productos, marcas y más..."
                  className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 px-5 text-white transition flex items-center gap-1.5"
                >
                  <Search size={16} />
                  {!isCompact && (
                    <span className="text-sm font-medium hidden lg:block">
                      Buscar
                    </span>
                  )}
                </button>
              </div>

              {isSearchActive && (
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onClick={handleSearchClose}
                  className="absolute -right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 font-medium text-sm"
                ></motion.button>
              )}

              {/* Resultados de búsqueda */}
              <AnimatePresence>
                {(showSearch || isSearchActive) && searchInput.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  >
                    {searching ? (
                      <div className="p-4 text-center text-sm text-gray-400">
                        <div className="animate-spin inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full mr-2" />
                        Buscando...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onMouseDown={() => handleResultClick(product.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {product.imagen_principal && (
                                <img
                                  src={product.imagen_principal}
                                  alt={product.nombre}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {product.nombre}
                              </p>
                              <p className="text-xs text-red-500 font-bold">
                                S/ {Number(product.precio_final).toFixed(2)}
                              </p>
                            </div>
                          </button>
                        ))}
                        <button
                          onMouseDown={() => {
                            navigate(
                              `/products?q=${encodeURIComponent(searchInput)}`,
                            );
                            handleSearchClose();
                          }}
                          className="w-full px-4 py-3 text-sm text-red-500 font-medium hover:bg-red-50 transition text-center border-t border-gray-100"
                        >
                          Ver todos los resultados para "{searchInput}" →
                        </button>
                      </>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-400">
                        No se encontraron productos para "{searchInput}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Iconos derecha */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Carrito */}
            <motion.button
              onClick={openCart}
              className="relative p-2.5 hover:bg-gray-100 rounded-xl transition"
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingCart size={22} className="text-gray-700" />
              <AnimatePresence>
                {total_items > 0 && (
                  <motion.span
                    key={total_items}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {total_items > 99 ? "99+" : total_items}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Wishlist */}
            {user && (
              <Link to="/wishlist">
                <motion.div
                  className="p-2.5 hover:bg-red-50 rounded-xl transition"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Heart
                    size={22}
                    className="text-gray-700 hover:text-red-500 transition"
                  />
                </motion.div>
              </Link>
            )}

            {/* Usuario */}
            <div
              ref={userMenuRef}
              className="relative"
              onMouseLeave={() => setShowUser(false)}
            >
              <motion.button
                onMouseEnter={() => {
                  setShowUser(true);
                  setIsSearchActive(false);
                  setActiveCategory(null);
                  setShowCompactCategories(false);
                }}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition relative z-50"
                whileTap={{ scale: 0.9 }}
              >
                {user ? (
                  user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.nombre}
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.nombre?.[0]?.toUpperCase()}
                    </div>
                  )
                ) : (
                  <User size={22} className="text-gray-700" />
                )}
                {user && !isCompact && (
                  <>
                    <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[80px] truncate">
                      {user.nombre.split(" ")[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      className="text-gray-500 hidden md:block"
                    />
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {showUser && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-0 pt-1 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.nombre}
                                className="w-10 h-10 rounded-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                                {user.nombre?.[0]?.toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {user.nombre}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        {[
                          { to: "/profile", icon: User, label: "Mi perfil" },
                          {
                            to: "/orders",
                            icon: Package,
                            label: "Mis pedidos",
                          },
                          { to: "/wishlist", icon: Heart, label: "Favoritos" },
                        ].map(({ to, icon: Icon, label }) => (
                          <Link
                            key={to}
                            to={to}
                            onClick={() => setShowUser(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <Icon size={15} className="text-gray-400" />
                            {label}
                          </Link>
                        ))}
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={() => {
                            logout();
                            setShowUser(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                        >
                          <LogOut size={15} />
                          Cerrar sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm text-gray-500">
                            ¡Hola! Inicia sesión
                          </p>
                        </div>
                        <Link
                          to="/login"
                          onClick={() => setShowUser(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                        >
                          <User size={15} className="text-gray-400" />
                          Iniciar sesión
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setShowUser(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition"
                        >
                          Crear cuenta gratis
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menú móvil */}
            <motion.button
              onClick={toggleMobileMenu}
              className="sm:hidden p-2.5 hover:bg-gray-100 rounded-xl transition"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="x"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                  >
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -90 }}
                  >
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Categorías desktop - Solo visible en modo normal */}
        {!isCompact && categoriesWithSub?.length > 0 && (
          <div
            className="hidden sm:block border-t border-gray-100 relative"
            ref={categoryMenuRef}
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5">
                <Link
                  to="/products"
                  className={`text-sm px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    location.pathname === "/products" && !location.search
                      ? "bg-red-50 text-red-500"
                      : "text-gray-600 hover:text-red-500 hover:bg-gray-50"
                  }`}
                  onMouseEnter={() => setActiveCategory(null)}
                >
                  Todos
                </Link>
                {categoriesWithSub.map((cat) => (
                  <div
                    key={cat.id}
                    className="relative"
                    onMouseEnter={() => handleCategoryMouseEnter(cat)}
                    onMouseLeave={handleCategoryMouseLeave}
                  >
                    <Link
                      to={`/category/${cat.id}`}
                      className={`text-sm px-3 py-1.5 rounded-lg whitespace-nowrap transition inline-flex items-center gap-1 ${
                        location.pathname === `/category/${cat.id}`
                          ? "bg-red-50 text-red-500 font-medium"
                          : "text-gray-600 hover:text-red-500 hover:bg-gray-50"
                      }`}
                    >
                      {cat.nombre}
                      {cat.subcategorias?.length > 0 && (
                        <ChevronDown size={12} className="opacity-50" />
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Mega Menú normal */}
            <AnimatePresence>
              {activeCategory && activeCategory.subcategorias?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 bg-white shadow-2xl z-50 border-t border-gray-100"
                  onMouseEnter={handleMegaMenuEnter}
                  onMouseLeave={handleMegaMenuLeave}
                >
                  <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {activeCategory.subcategorias.map((sub) => (
                        <div key={sub.id}>
                          <Link
                            to={`/category/${sub.id}`}
                            className="font-semibold text-gray-800 hover:text-red-500 transition block mb-2 text-sm"
                          >
                            {sub.nombre}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Menú móvil */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <form onSubmit={handleSearch} className="flex p-4 gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar productos..."
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-red-400"
                />
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 rounded-xl"
                >
                  <Search size={16} />
                </button>
              </form>

              <div className="px-4 pb-4">
                {categoriesWithSub?.map((cat) => (
                  <div key={cat.id} className="mb-2">
                    <Link
                      to={`/category/${cat.id}`}
                      onClick={closeMobileMenu}
                      className="py-2.5 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        {cat.nombre}
                      </span>
                      {cat.subcategorias?.length > 0 && (
                        <ChevronRight size={14} className="text-gray-400" />
                      )}
                    </Link>
                    {cat.subcategorias?.length > 0 && (
                      <div className="ml-6 pl-2 border-l-2 border-gray-100">
                        {cat.subcategorias.slice(0, 5).map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/category/${sub.id}`}
                            onClick={closeMobileMenu}
                            className="py-1.5 px-3 text-xs text-gray-500 hover:text-red-500 block"
                          >
                            {sub.nombre}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {user && (
                <div className="border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    👤 Mi perfil
                  </Link>
                  <Link
                    to="/orders"
                    onClick={closeMobileMenu}
                    className="py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    📦 Mis pedidos
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={closeMobileMenu}
                    className="py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    ❤️ Favoritos
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="py-2 px-3 text-sm text-red-500 hover:bg-red-50 rounded-xl text-left"
                  >
                    🚪 Cerrar sesión
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
