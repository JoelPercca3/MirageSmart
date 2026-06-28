import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, X, Star } from "lucide-react";
import { useUpdateCartItem, useRemoveCartItem } from "../../hooks/useCart.js";
import { formatPrice } from "../../utils/formatPrice.js";
import { useState } from "react";

const COLOR_HEX = {
  rojo: "#e53e3e", azul: "#3182ce", negro: "#1a202c", blanco: "#f7fafc",
  verde: "#38a169", amarillo: "#ecc94b", rosa: "#ed64a6", rosado: "#ed64a6",
  morado: "#805ad5", gris: "#a0aec0", naranja: "#ed8936", beige: "#c8a876",
  cafe: "#7b341e", marron: "#7b341e",
};

function StarRow({ rating }) {
  return (
    <div className="flex gap-px" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={10}
          className={i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

function VariantChip({ label, value, colorHex }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 whitespace-nowrap">
      {colorHex && (
        <span
          className="w-2 h-2 rounded-full border border-black/10 flex-shrink-0"
          style={{ backgroundColor: colorHex }}
          aria-hidden="true"
        />
      )}
      {label}: <span className="font-medium text-gray-700">{value}</span>
    </span>
  );
}

export default function CartItem({ item }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const getImageUrl = () => {
    if (item.imagen) return item.imagen;
    if (item.product_images?.length > 0) return item.product_images[0].url;
    return "https://placehold.co/80x80?text=Sin+imagen";
  };

  const getProductName = () => item.product_name || item.nombre || "Producto";
  const getUnitPrice = () => Number(item.precio_unitario) || Number(item.price) || 0;
  const getPrecioBase = () => Number(item.precio_base) || 0;

  const getVariantChips = () => {
    const chips = [];
    if (item.variant_opciones) {
      try {
        const opts = typeof item.variant_opciones === "string"
          ? JSON.parse(item.variant_opciones)
          : item.variant_opciones;
        if (opts.Talla) chips.push({ label: "Talla", value: opts.Talla, colorHex: null });
        if (opts.Color) chips.push({ label: "Color", value: opts.Color, colorHex: COLOR_HEX[opts.Color.toLowerCase()] ?? null });
      } catch { /* silent */ }
    }
    return chips;
  };

  // ✅ DATOS QUE AHORA VIENEN DEL BACKEND
  const unitPrice = getUnitPrice();
  const basePrice = getPrecioBase();
  const discountPercent = Number(item.porcentaje_desc) || 0;
  const rating = Number(item.rating_promedio) || 0;
  const ratingCount = Number(item.rating_count) || 0;
  const ventasCount = Number(item.ventas_count) || 0;
  const variantChips = getVariantChips();
  const totalPrice = unitPrice * item.cantidad;
  const totalBase = basePrice * item.cantidad;
  const savings = totalBase - totalPrice;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex gap-3 py-3 border-b border-gray-100 last:border-0 relative"
      >
        {/* Imagen */}
        <Link
          to={`/products/${item.product_id}`}
          className="w-[72px] h-[88px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 hover:opacity-80 transition"
        >
          <img
            src={getImageUrl()}
            alt={getProductName()}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = "https://placehold.co/72x88?text=Error"; }}
          />
        </Link>

        {/* Cuerpo */}
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">

          {/* Nombre */}
          <Link
            to={`/products/${item.product_id}`}
            className="text-[11px] font-medium text-gray-800 hover:text-red-500 transition line-clamp-2 pr-5 leading-snug"
          >
            {getProductName()}
          </Link>

          {/* ⭐ Rating + reseñas + ventas */}
          {rating > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <StarRow rating={rating} />
              <span className="text-[10px] text-gray-400">
                {rating.toFixed(1)} ({ratingCount} reseñas)
              </span>
              {ventasCount > 0 && (
                <>
                  <span className="text-gray-300 text-[10px]">·</span>
                  <span className="text-[10px] text-gray-400">{ventasCount} vendidos</span>
                </>
              )}
            </div>
          )}

          {/* Chips de variante (Talla / Color) */}
          {variantChips.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {variantChips.map((chip, i) => <VariantChip key={i} {...chip} />)}
            </div>
          )}

          {/* 💰 Precio con descuento */}
          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
            <span className="text-[13px] font-bold text-gray-900">
              {formatPrice(totalPrice)}
            </span>
            {basePrice > 0 && basePrice > unitPrice && (
              <span className="text-[10px] text-gray-400 line-through">
                {formatPrice(totalBase)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[9px] font-bold bg-red-600 text-white px-1 py-px rounded">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* 💰 Ahorro */}
          {savings > 0 && (
            <span className="text-[10px] text-red-500 font-medium">
              Ahorras {formatPrice(savings)}
            </span>
          )}

          {/* Precio unitario si qty > 1 */}
          {item.cantidad > 1 && (
            <span className="text-[10px] text-gray-400">
              {formatPrice(unitPrice)} / unidad
            </span>
          )}

          {/* Footer: controles de cantidad */}
          <div className="flex justify-end mt-1">
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={() => updateItem.mutate({ id: item.id, cantidad: Math.max(1, item.cantidad - 1) })}
                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-40 cursor-pointer"
                disabled={item.cantidad <= 1}
                aria-label="Reducir cantidad"
              >
                <Minus size={10} className="text-gray-600" />
              </button>
              <span className="w-6 text-center text-[11px] font-medium text-gray-700">
                {item.cantidad}
              </span>
              <button
                onClick={() => updateItem.mutate({ id: item.id, cantidad: Math.min(item.cantidad + 1, item.stock || 99) })}
                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-40 cursor-pointer"
                disabled={item.cantidad >= (item.stock || 99)}
                aria-label="Aumentar cantidad"
              >
                <Plus size={10} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Botón eliminar */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-gray-300 cursor-pointer hover:text-gray-600 transition absolute top-3 right-0"
          aria-label="Eliminar producto"
        >
          <Trash2 size={15} />
        </button>
      </motion.div>

      {/* Popup confirmación */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-[100018]"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[100018] bg-white rounded-sm p-4 shadow-lg"
              style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", maxWidth: 280, width: "100%" }}
            >
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Cerrar"
              >
                <X size={14} className="text-gray-400" />
              </button>
              <h5 className="text-sm font-medium text-gray-900 mb-2 pr-6">
                ¿Estás seguro/a de que quieres eliminar este artículo?
              </h5>
              <p className="text-xs text-gray-500 mb-4 truncate">"{getProductName()}"</p>
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  NO
                </button>
                <button
                  onClick={() => { removeItem.mutate(item.id); setShowDeleteConfirm(false); }}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-[#F93A00] hover:bg-[#FC4812] rounded transition-colors"
                >
                  SÍ
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}