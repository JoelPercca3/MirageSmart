import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();

  // Obtener imágenes del producto
  const imagenes = product.imagenes
    ? typeof product.imagenes === "string"
      ? JSON.parse(product.imagenes)
      : product.imagenes
    : [];

  const primaryImage = imagenes[0] || product.imagen_principal;
  const secondaryImage = imagenes[1] || null;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) return;
    setWishlisted(!wishlisted);
    toggleWishlist.mutate(product.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart.mutate({ product_id: product.id, cantidad: 1 });
  };

  const handleViewProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group bg-white rounded-none overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`}>
        {/* Imagen */}
        <div
          className="relative overflow-hidden bg-gray-100"
          style={{ paddingBottom: "133.333%" }}
        >
          {!imageLoaded && <div className="absolute inset-0 shimmer" />}

          {/* Imagen primaria — estática, nunca cambia */}
          <img
            src={getImageUrl(primaryImage)}
            alt={product.nombre}
            onLoad={() => setImageLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover z-10
    transition-opacity duration-300
    ${imageLoaded ? "opacity-100" : "opacity-0"}
  `}
          />

          {/* Imagen secundaria — usa tus clases CSS globales igual que Shein */}
          {secondaryImage && (
            <img
              src={getImageUrl(secondaryImage)}
              alt={product.nombre}
              className={`absolute inset-0 w-full h-full object-cover z-20
      ${isHovered ? "image-fade-in" : "image-fade-out"}
    `}
            />
          )}

          {/* Overlay y botones que aparecen al hacer hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          />

          {/* Botones acción - aparecen al hacer hover */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: isHovered ? 0 : "100%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 z-30"
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="flex-1 bg-white text-gray-800 text-xs font-bold py-2 rounded-xl shadow-lg hover:bg-red-500 hover:text-red-500 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingCart size={13} />
              {addToCart.isPending ? "Agregando..." : "Agregar"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleViewProduct}
              className="bg-white/90 text-gray-700 p-2 rounded-xl  shadow-lg hover:bg-gray-100 transition flex items-center justify-center"
            >
              <Eye size={14} />
            </motion.button>
          </motion.div>

          {/* Wishlist */}
          <motion.button
            whileTap={{ scale: 0.75 }}
            onClick={handleWishlist}
            className={`absolute top-2 right-2 p-1.5 rounded-full shadow transition-all z-30 ${wishlisted
              ? "bg-red-500 text-white"
              : "bg-white/90 text-gray-400 hover:bg-red-50 hover:text-red-500"
              }`}
          >
            <Heart size={14} className={wishlisted ? "fill-white" : ""} />
          </motion.button>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-gray-400 mb-0.5 truncate">
            {product.marca || product.categoria}
          </p>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-2">
            {product.nombre}
          </h3>

          {/* Rating */}
          {product.rating_count > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    className={
                      i < Math.round(product.rating_promedio)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">
                ({product.rating_count})
              </span>
            </div>
          )}

          {/* Precio + descuento */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-red-500 font-extrabold text-base">
              {formatPrice(
                product.precio_final ||
                product.precio_oferta ||
                product.precio_base,
              )}
            </span>
            {product.precio_oferta &&
              Number(product.precio_base) > Number(product.precio_oferta) && (
                <span className="text-gray-400 text-xs line-through">
                  {formatPrice(product.precio_base)}
                </span>
              )}
            {product.porcentaje_desc > 0 && (
              <span className="text-red-500 text-xs font-bold">
                -{product.porcentaje_desc}%
              </span>
            )}
          </div>

          {/* Badges NUEVO / TOP */}
          <div className="flex items-center gap-1 flex-wrap mb-1">
            {product.es_nuevo === 1 && (
              <span className="text-xs font-bold text-green-600 border border-green-500 px-1.5 py-0.5 rounded">
                NUEVO
              </span>
            )}
            {product.ventas_count > 100 && (
              <span className="text-xs font-bold text-orange-500 border border-orange-400 px-1.5 py-0.5 rounded">
                🔥 TOP
              </span>
            )}
          </div>

          {/* Ventas y stock */}
          <div className="flex items-center justify-between mt-1">
            {product.ventas_count > 0 && (
              <p className="text-xs text-gray-400">
                {product.ventas_count > 1000
                  ? `+${Math.floor(product.ventas_count / 1000)}k vendidos`
                  : `${product.ventas_count} vendidos`}
              </p>
            )}
            {product.stock_total < 10 && product.stock_total > 0 && (
              <span className="text-xs text-orange-500 font-medium">
                ¡Solo {product.stock_total} left!
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
