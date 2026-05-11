import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import { useUpdateCartItem, useRemoveCartItem } from "../../hooks/useCart.js";
import { formatPrice } from "../../utils/formatPrice.js";

export default function CartItem({ item }) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-3 bg-white rounded-xl p-3 border border-gray-100"
    >
      {/* Imagen */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {item.imagen ? (
          <img
            src={item.imagen}
            alt={item.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {item.nombre}
        </p>
        {item.variante_opciones && (
          <p className="text-xs text-gray-400 mt-0.5">
            {Object.entries(JSON.parse(item.variante_opciones || "{}"))
              .map(([k, v]) => `${k}: ${v}`)
              .join(" · ")}
          </p>
        )}
        <p className="text-red-500 font-bold text-sm mt-1">
          {formatPrice(Number(item.precio_unitario) * item.cantidad)}
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
