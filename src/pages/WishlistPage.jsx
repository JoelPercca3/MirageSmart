import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, ShoppingCart, PackageSearch } from "lucide-react";
import { useWishlist, useToggleWishlist } from "../hooks/useWishlist.js";
import Spinner from "../components/ui/Spinner.jsx";
import Button from "../components/ui/Button.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import { useAddToCart } from "../hooks/useCart.js";

// ─── Constantes ───────────────────────────────────────────────────────────────

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.045, duration: 0.25, ease: "easeOut" },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.18 } },
};

// ─── Sub-componente: WishlistCard ─────────────────────────────────────────────

function WishlistCard({ item, index, onRemove, onAddToCart, isAddingId }) {
  const [imgError, setImgError] = useState(false);
  const isAdding = isAddingId === item.product_id;

  const hasDiscount = item.porcentaje_desc > 0;
  const precioPrevio =
    hasDiscount && item.precio_base ? item.precio_base : null;

  return (
    <motion.article
      layout
      key={item.product_id}
      custom={index}
      variants={CARD_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col"
    >
      {/* Imagen */}
      <Link
        to={`/products/${item.product_id}`}
        className="relative block aspect-square bg-gray-50 overflow-hidden flex-shrink-0"
        tabIndex={0}
        aria-label={`Ver ${item.nombre}`}
      >
        <img
          src={imgError ? PLACEHOLDER : (item.imagen_principal || PLACEHOLDER)}
          alt={item.nombre}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge descuento */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            -{item.porcentaje_desc}%
          </span>
        )}

        {/* Botón eliminar flotante */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(item.product_id);
          }}
          aria-label={`Quitar ${item.nombre} de favoritos`}
          className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-red-50 border border-white/60 hover:border-red-200 rounded-full shadow-sm opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-150"
        >
          <Trash2 size={13} className="text-gray-400 hover:text-red-500 transition-colors" />
        </button>
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <Link to={`/products/${item.product_id}`} className="flex-1 mb-2 block">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1.5 hover:text-gray-600 transition-colors">
            {item.nombre}
          </h3>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base font-bold text-gray-900">
              {formatPrice(item.precio_final)}
            </span>
            {precioPrevio && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(precioPrevio)}
              </span>
            )}
          </div>
          {hasDiscount && precioPrevio && (
            <p className="text-[11px] text-green-600 mt-0.5">
              Ahorras {formatPrice(precioPrevio - item.precio_final)}
            </p>
          )}
        </Link>

        {/* Acciones */}
        <div className="flex gap-2 mt-auto">
          <Button
            size="sm"
            className="flex-1 text-xs gap-1.5"
            onClick={() => onAddToCart(item.product_id)}
            loading={isAdding}
            disabled={isAdding}
          >
            <ShoppingCart size={13} />
            Agregar
          </Button>
          <button
            onClick={() => onRemove(item.product_id)}
            aria-label={`Quitar ${item.nombre} de favoritos`}
            className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            <Trash2 size={14} className="text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Estado vacío ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      className="text-center py-24 flex flex-col items-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
        <Heart size={36} className="text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        No tienes favoritos aún
      </h3>
      <p className="text-sm text-gray-400 mb-6 max-w-xs leading-relaxed">
        Guarda productos que te gusten para encontrarlos rápidamente después.
      </p>
      <Link to="/products">
        <Button>Explorar productos</Button>
      </Link>
    </motion.div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function WishlistPage() {
  const { data: items, isLoading } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const addToCart = useAddToCart();

  // Trackea qué producto se está agregando al carrito para feedback individual
  const [addingId, setAddingId] = useState(null);

  const handleRemove = useCallback(
    (productId) => {
      toggleWishlist.mutate(productId);
    },
    [toggleWishlist],
  );

  const handleAddToCart = useCallback(
    (productId) => {
      setAddingId(productId);
      addToCart.mutate(
        { product_id: productId, cantidad: 1 },
        { onSettled: () => setAddingId(null) },
      );
    },
    [addToCart],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-20" aria-label="Cargando favoritos">
        <Spinner size="lg" />
      </div>
    );
  }

  const count = items?.length ?? 0;
  const isEmpty = count === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Heart size={22} className="text-red-500 fill-red-500" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-800">Mis favoritos</h1>
        {!isEmpty && (
          <span className="bg-red-50 text-red-500 text-sm font-bold px-2.5 py-0.5 rounded-full border border-red-100">
            {count}
          </span>
        )}
      </div>

      {/* Contenido */}
      {isEmpty ? (
        <EmptyState />
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {items.map((item, i) => (
              <WishlistCard
                key={`wishlist-${item.product_id}`}
                item={item}
                index={i}
                onRemove={handleRemove}
                onAddToCart={handleAddToCart}
                isAddingId={addingId}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}