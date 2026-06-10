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

  // Efecto para ocultar navbar al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsNavbarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Efecto para compact mode en product detail
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
          (sub) => sub.parent_id === mainCat.id
        ),
      }));
      setCategoriesWithSub(categoriesWithChildren.slice(0, 7));
    }
  }, [rawCategories]);

  // ─── Helpers para cerrar todo de golpe ───────────────────────────────────
  const closeCompactMenu = () => {
    clearTimeout(categoryTimeoutRef.current);
    setShowCompactCategories(false);
    setActiveCategory(null);
  };

  // ─── Categorías normales (modo no-compacto) ───────────────────────────────
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

  // ─── Menú compacto ────────────────────────────────────────────────────────
  // El contenedor padre (div ref={compactMenuRef}) maneja enter/leave global.
  // El mega menú fixed NO tiene sus propios handlers — el overlay negro
  // se encarga de cerrarlo cuando el cursor llega a la página.
  const handleCompactMenuMouseEnter = () => {
    if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
    setShowCompactCategories(true);
  };

  // Este leave solo se dispara si el cursor sale del botón SIN entrar
  // al mega menú (porque el mega menú es fixed y está fuera del DOM del div).
  // El overlay negro cubre el resto → al llegar ahí se cierra todo.
  const handleCompactMenuMouseLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      closeCompactMenu();
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
      return () => document.removeEventListener("mousedown", handleClickOutside);
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
      {/* ── Overlay: menú usuario ─────────────────────────────────────────── */}
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

      {/* ── Overlay: buscador ─────────────────────────────────────────────── */}
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

      {/* ── Overlay: categorías ───────────────────────────────────────────── */}
      {/* onMouseEnter cierra el menú en cuanto el cursor llega a la página    */}
      <AnimatePresence>
        {(activeCategory || showCompactCategories) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={closeCompactMenu}
            onMouseEnter={closeCompactMenu}
          />
        )}
      </AnimatePresence>

      {/* ── Barra superior ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky top-0 z-50 bg-gray-900 text-white text-xs text-center py-4 font-medium border-b border-gray-800"
      >
        <span className="tracking-wide">🚚 Envío gratis desde S/ 150</span>
        <span className="mx-2 text-gray-500">|</span>
        <span className="text-gray-300">Ofertas exclusivas todos los días</span>
      </motion.div>

      {/* ── Navbar principal ──────────────────────────────────────────────── */}
      <motion.header
        animate={{ y: isNavbarVisible ? 0 : -200 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`bg-white transition-all duration-300 ${scrolled && isNavbarVisible ? "shadow-lg" : "shadow-sm"
          }`}
        style={{ position: "sticky", top: "40px", zIndex: 40 }}
      >
        <div
          className={`max-w-7xl mx-auto pl-1 pr-4 py-3 flex items-center ${isCompact ? "gap-4" : "gap-24"
            }`}
        >
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 -ml-8">
            <img
              src={logo}
              alt="MirageMart"
              className={`transition-all duration-300 ${isCompact ? "w-32 md:w-24 h-auto" : "w-44 md:w-32 h-auto"
                }`}
            />
          </Link>

          {/* ── Botón categorías (modo compacto) ──────────────────────────── */}
          {isCompact && (
            <div
              className="relative"
              ref={compactMenuRef}
              onMouseEnter={handleCompactMenuMouseEnter}
              onMouseLeave={handleCompactMenuMouseLeave}
            >
              <button className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  Categorías
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-600 transition-transform duration-200 ${showCompactCategories ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Mega menú compacto — fixed, fuera del flujo del div padre */}
              <AnimatePresence>
                {showCompactCategories && categoriesWithSub.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="fixed left-0 right-0 top-[106px] bg-white shadow-2xl z-50 border-t border-gray-100"
                  // Sin handlers propios: el overlay negro cierra al salir
                  >
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="flex max-h-[500px]">

                        {/* Columna izquierda */}
                        <div className="w-64 bg-gray-50 rounded-l-xl overflow-y-auto border-r border-gray-100">
                          {categoriesWithSub.map((cat) => (
                            <div
                              key={cat.id}
                              className={`
                                flex items-center justify-between px-4 py-3 cursor-pointer
                                transition-all duration-150 border-r-2
                                ${activeCategory?.id === cat.id
                                  ? "bg-white text-orange-500 border-orange-500"
                                  : "text-gray-600 border-transparent"
                                }
                              `}
                              onMouseEnter={() => handleCategoryMouseEnter(cat)}
                            >
                              <span className="text-sm font-medium">
                                {cat.nombre}
                              </span>
                              <ChevronRight size={14} className="text-gray-400" />
                            </div>
                          ))}
                        </div>

                        {/* Columna derecha */}
                        <div className="flex-1 bg-white rounded-r-xl overflow-y-auto p-4">
                          {activeCategory ? (
                            <>
                              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                                <span className="text-orange-500 text-sm">✦</span>
                                <h6 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                                  {activeCategory.nombre}
                                </h6>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                {/* Ver todo */}
                                <Link
                                  to={`/category/${activeCategory.id}`}
                                  className="flex flex-col items-center text-center group"
                                  style={{ width: "84px" }}
                                  onClick={closeCompactMenu}
                                >
                                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center group-hover:shadow-md transition-shadow border border-gray-200">
                                    {activeCategory.imagen_url ? (
                                      <img
                                        src={activeCategory.imagen_url}
                                        alt={activeCategory.nombre}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                                      />
                                    ) : (
                                      <span className="text-[10px] text-gray-400 font-medium">
                                        TODO
                                      </span>
                                    )}
                                  </div>
                                  <span className="mt-2 text-[11px] text-gray-500 group-hover:text-orange-500 leading-tight">
                                    Ver todo
                                  </span>
                                </Link>

                                {/* Subcategorías */}
                                {activeCategory.subcategorias
                                  ?.slice(0, 14)
                                  .map((sub) => (
                                    <Link
                                      key={sub.id}
                                      to={`/category/${sub.id}`}
                                      className="flex flex-col items-center text-center group"
                                      style={{ width: "84px" }}
                                      onClick={closeCompactMenu}
                                    >
                                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                                        <img
                                          src={sub.imagen_url}
                                          alt={sub.nombre}
                                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                        />
                                      </div>
                                      <span className="mt-2 text-[11px] text-gray-600 group-hover:text-black leading-tight w-full text-center line-clamp-3 break-words hyphens-auto">
                                        {sub.nombre}
                                      </span>
                                    </Link>
                                  ))}
                              </div>

                              {activeCategory.subcategorias?.length > 15 && (
                                <div className="mt-4 pt-2 text-center">
                                  <Link
                                    to={`/category/${activeCategory.id}`}
                                    className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                                    onClick={closeCompactMenu}
                                  >
                                    Ver más de {activeCategory.nombre} →
                                  </Link>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                              Selecciona una categoría
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── Buscador desktop ──────────────────────────────────────────── */}
          <div
            className={`flex-1 ${isCompact ? "max-w-2xl" : "max-w-xl"}`}
            ref={searchRef}
          >
            <form onSubmit={handleSearch} className="relative">
              <div
                className={`flex border-2 rounded-xl overflow-hidden transition-all duration-300 ${isSearchActive
                  ? "border-red-500 shadow-lg shadow-red-200 ring-2 ring-red-200"
                  : showSearch
                    ? "border-red-400 shadow-lg shadow-red-100"
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
                  className="bg-gray-800 hover:bg-red-600 px-3 text-white transition flex items-center gap-1.5"
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
                >
                  Cancelar
                </motion.button>
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
                              `/products?q=${encodeURIComponent(searchInput)}`
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

          {/* ── Iconos derecha ────────────────────────────────────────────── */}
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
                          { to: "/orders", icon: Package, label: "Mis pedidos" },
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

        {/* ── Categorías desktop (modo normal) ──────────────────────────── */}
        {!isCompact && categoriesWithSub?.length > 0 && (
          <div
            className="hidden sm:block border-t border-gray-100 relative"
            ref={categoryMenuRef}
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5">
                <Link
                  to="/products"
                  className={`text-sm px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${location.pathname === "/products" && !location.search
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
                      className={`text-sm px-3 py-1.5 rounded-lg whitespace-nowrap transition inline-flex items-center gap-1 ${location.pathname === `/category/${cat.id}`
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

            {/* Mega menú normal */}
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {activeCategory.subcategorias.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/category/${sub.id}`}
                          className="group flex flex-col items-center text-center hover:bg-gray-50 rounded-xl p-3 transition-all duration-200"
                        >
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 overflow-hidden mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                            {sub.imagen_url ? (
                              <img
                                src={sub.imagen_url}
                                alt={sub.nombre}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-gray-300"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-red-500 transition-colors line-clamp-2">
                            {sub.nombre}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── Menú móvil ────────────────────────────────────────────────── */}
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