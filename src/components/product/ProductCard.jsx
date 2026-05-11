import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useAddToCart } from "../../hooks/useCart.js";
import { useToggleWishlist } from "../../hooks/useWishlist.js";
import { formatPrice } from "../../utils/formatPrice.js";
import useAuthStore from "../../store/useAuthStore.js";
const getImageUrl = (url) => {
  if (!url) return "https://placehold.co/300x300?text=Sin+imagen";
  if (url.startsWith("http")) return url;
  return `http://localhost:4000${url}`;
};
export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();
  const token = useAuthStore((s) => s.token);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!token) return;
    setWishlisted(!wishlisted);
    toggleWishlist.mutate(product.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart.mutate({ product_id: product.id, cantidad: 1 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      <Link to={`/products/${product.id}`}>
        {/* Imagen */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          <img
            src={getImageUrl(product.imagen_principal)}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.porcentaje_desc > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                -{product.porcentaje_desc}%
              </span>
            )}
            {product.es_nuevo === 1 && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                NUEVO
              </span>
            )}
          </div>

          {/* Botones hover */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="bg-white text-gray-800 text-xs font-semibold px-4 py-2 rounded-full shadow hover:bg-red-500 hover:text-white transition flex items-center gap-1"
            >
              <ShoppingCart size={13} /> Agregar
            </motion.button>
          </div>

          {/* Wishlist */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleWishlist}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-red-50 transition"
          >
            <Heart
              size={15}
              className={
                wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
              }
            />
          </motion.button>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-gray-400 mb-0.5">
            {product.marca || product.categoria}
          </p>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
            {product.nombre}
          </h3>

          {/* Rating */}
          {product.rating_count > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-500">
                {Number(product.rating_promedio).toFixed(1)} (
                {product.rating_count})
              </span>
            </div>
          )}

          {/* Precio */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-red-500 font-bold text-base">
              {formatPrice(
                product.precio_final ||
                  product.precio_oferta ||
                  product.precio_base,
              )}
            </span>
            {product.precio_oferta &&
              product.precio_base > product.precio_oferta && (
                <span className="text-gray-400 text-xs line-through">
                  {formatPrice(product.precio_base)}
                </span>
              )}
          </div>

          {/* Ventas */}
          {product.ventas_count > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {product.ventas_count} vendidos
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
