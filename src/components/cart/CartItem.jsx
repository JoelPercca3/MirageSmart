import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import { useUpdateCartItem, useRemoveCartItem } from "../../hooks/useCart.js";
import { formatPrice } from "../../utils/formatPrice.js";

export default function CartItem({ item }) {

  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  // 🔥 Obtener la URL correcta de la imagen desde product_images
  const getImageUrl = () => {
    // Si el item tiene imagen directa
    if (item.imagen) return item.imagen;
    // Si el item tiene product_images (array de imágenes)
    if (item.product_images && item.product_images.length > 0) {
      return item.product_images[0].url;
    }
    // Imagen por defecto
    return "https://placehold.co/80x80?text=Sin+imagen";
  };

  // 🔥 Obtener el nombre correcto del producto
  const getProductName = () => {
    return item.nombre || item.product_name || "Producto";
  };

  // 🔥 Obtener el precio unitario correcto
  const getUnitPrice = () => {
    return Number(item.precio_unitario) || Number(item.price) || 0;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-3 bg-white rounded-xl p-3 border border-gray-100"
    >
      {/* Imagen clickeable */}
      <Link
        to={`/products/${item.product_id}`}
        className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 hover:opacity-80 transition"
      >
        <img
          src={getImageUrl()}
          alt={getProductName()}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/80x80?text=Error";
          }}
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${item.product_id}`}
          className="text-sm font-medium text-gray-800 hover:text-red-500 transition truncate block"
        >
          {getProductName()}
        </Link>

        {/* Mostrar opciones de variante (color, talla) */}
        {item.variant_opciones && (
          <p className="text-xs text-gray-400 mt-0.5">
            {(() => {
              try {
                const opts = typeof item.variant_opciones === 'string'
                  ? JSON.parse(item.variant_opciones)
                  : item.variant_opciones;
                const parts = [];
                if (opts.Talla) parts.push(`Talla: ${opts.Talla}`);
                if (opts.Color) parts.push(`Color: ${opts.Color}`);
                return parts.length > 0 ? parts.join(" · ") : null;
              } catch (e) {
                return null;
              }
            })()}
          </p>
        )}
        <p className="text-red-500 font-bold text-sm mt-1">
          {formatPrice(getUnitPrice() * item.cantidad)}
        </p>
      </div>
      {/* Controles */}
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => removeItem.mutate(item.id)}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <Trash2 size={14} />
        </button>
        <div className="flex items-center gap-1 border rounded-lg">
          <button
            onClick={() =>
              updateItem.mutate({
                id: item.id,
                cantidad: Math.max(1, item.cantidad - 1),
              })
            }
            className="p-1 hover:bg-gray-100 rounded-l-lg transition"
          >
            <Minus size={12} />
          </button>
          <span className="w-6 text-center text-sm font-medium">
            {item.cantidad}
          </span>
          <button
            onClick={() =>
              updateItem.mutate({ id: item.id, cantidad: item.cantidad + 1 })
            }
            className="p-1 hover:bg-gray-100 rounded-r-lg transition"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
