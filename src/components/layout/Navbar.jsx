import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore.js";
import useCartStore from "../../store/useCartStore.js";
import useUIStore from "../../store/useUIStore.js";
import { useLogout } from "../../hooks/useAuth.js";
import { categoryAPI } from "../../api/category.api.js";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showUser, setShowUser] = useState(false);

  const { user } = useAuthStore();
  const { total_items, openCart } = useCartStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const logout = useLogout();
  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryAPI.getAll,
    select: (res) => res.data?.slice(0, 6) || [],
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput("");
      closeMobileMenu();
    }
  };

  return (
    <motion.header
      className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Barra superior */}
      <div className="bg-red-500 text-white text-xs text-center py-1.5 font-medium">
        🚀 ¡Envío gratis en pedidos mayores a S/ 150! Compra ahora
      </div>

      {/* Navbar principal */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <motion.span
            className="text-2xl font-extrabold text-red-500 tracking-tight"
            whileHover={{ scale: 1.05 }}
          >
            Mirage<span className="text-gray-800">Mart</span>
          </motion.span>
        </Link>

        {/* Buscador */}
        <form onSubmit={handleSearch} className="flex-1 hidden sm:flex">
          <div className="flex w-full max-w-xl border border-gray-200 rounded-lg overflow-hidden focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 transition">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar productos..."
              className="flex-1 px-4 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 px-4 text-white transition"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Iconos derecha */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Carrito */}
          <motion.button
            onClick={openCart}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingCart size={22} className="text-gray-700" />
            {total_items > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {total_items > 99 ? "99+" : total_items}
              </motion.span>
            )}
          </motion.button>

          {/* Wishlist */}
          {user && (
            <Link to="/wishlist">
              <motion.div
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                whileTap={{ scale: 0.9 }}
              >
                <Heart size={22} className="text-gray-700" />
              </motion.div>
            </Link>
          )}

          {/* Usuario */}
          <div className="relative">
            <motion.button
              onClick={() => setShowUser(!showUser)}
              className="flex items-center gap-1.5 p-2 hover:bg-gray-100 rounded-lg transition"
              whileTap={{ scale: 0.9 }}
            >
              <User size={22} className="text-gray-700" />
              {user && (
                <>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[80px] truncate">
                    {user.nombre.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className="text-gray-500" />
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {showUser && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                  onMouseLeave={() => setShowUser(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user.nombre}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setShowUser(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Mi perfil
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setShowUser(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Mis pedidos
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setShowUser(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Favoritos
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setShowUser(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setShowUser(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-50 font-medium"
                      >
                        Iniciar sesión
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setShowUser(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Crear cuenta
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Menú móvil */}
          <button
            onClick={toggleMobileMenu}
            className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Categorías */}
      {categories?.length > 0 && (
        <div className="hidden sm:block border-t bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-6 overflow-x-auto py-2 no-scrollbar">
              <Link
                to="/products"
                className="text-sm font-medium text-gray-600 hover:text-red-500 whitespace-nowrap transition"
              >
                Todos
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="text-sm text-gray-600 hover:text-red-500 whitespace-nowrap transition"
                >
                  {cat.nombre}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menú móvil desplegable */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden border-t bg-white overflow-hidden"
          >
            <form onSubmit={handleSearch} className="flex p-4 gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar productos..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-red-400"
              />
              <button
                type="submit"
                className="bg-red-500 text-white px-4 rounded-lg"
              >
                <Search size={16} />
              </button>
            </form>
            <div className="px-4 pb-4 flex flex-col gap-1">
              {categories?.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  onClick={closeMobileMenu}
                  className="py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  {cat.nombre}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
