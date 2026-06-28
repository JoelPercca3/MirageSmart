import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight, ShoppingCart, Package } from "lucide-react";
import { Link } from "react-router-dom";
import useCartStore from "../../store/useCartStore.js";
import CartItem from "./CartItem.jsx";
import Button from "../ui/Button.jsx";
import { formatPrice } from "../../utils/formatPrice.js";



export default function CartDrawer() {
  const { isOpen, closeCart, items, subtotal } = useCartStore();

  const totalSavings = items.reduce((acc, item) => {
    const unit = Number(item.precio_unitario) || 0;
    const original = Number(item.precio_base) || 0;
    if (original > unit) return acc + (original - unit) * item.cantidad;
    return acc;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer flotante — no ocupa toda la altura */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-4 top-4 bottom-4 w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl rounded-2xl overflow-hidden"
            style={{ maxHeight: "calc(100vh - 32px)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-[#1e1e2f]/10 p-1.5 rounded-lg">
                  <Package size={16} className="text-[#1e1e2f]" />
                </div>
                <span className="text-sm font-bold text-[#1e1e2f]">Mi Carrito</span>
                {items.length > 0 && (
                  <span className="bg-[#1e1e2f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-[#1e1e2f] hover:text-white rounded-lg transition text-gray-400 cursor-pointer"
                aria-label="Cerrar carrito"
              >
                <X size={16} />
              </button>
            </div>

            {/* Banner ahorro total */}
            <AnimatePresence>
              {totalSavings > 0 && items.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden flex-shrink-0"
                >
                  <div className="flex items-center justify-center gap-1.5 px-4 py-1.5 bg-red-50 border-b border-red-100">
                    <span className="text-[11px] text-red-600 font-medium">
                      Ahorras {formatPrice(totalSavings)} en este pedido
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Items — scroll solo aquí */}
            <div className="flex-1 overflow-y-auto px-4 py-1 min-h-0">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-10">
                  <div className="bg-[#1e1e2f]/5 rounded-full p-6">
                    <ShoppingBag size={40} className="text-[#1e1e2f]/30" />
                  </div>
                  <div>
                    <p className="text-[#1e1e2f] font-semibold mb-1 text-sm">Tu carrito está vacío</p>
                    <p className="text-gray-400 text-xs">Agrega productos para comenzar</p>
                  </div>
                  <Button
                    variant="outline" onClick={closeCart} size="sm"
                    className="border-[#1e1e2f] text-[#1e1e2f] hover:bg-[#1e1e2f] hover:text-white transition-colors duration-300"
                  >
                    Ver productos
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col">
                  {items.map((item) => <CartItem key={item.id} item={item} />)}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-3.5 bg-white flex-shrink-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs text-gray-500">
                    Subtotal ({items.length} {items.length === 1 ? "producto" : "productos"})
                  </span>
                  <span className="font-bold text-[#1e1e2f] text-sm">{formatPrice(subtotal)}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-red-500">Descuentos aplicados</span>
                    <span className="text-[11px] font-medium text-red-500">−{formatPrice(totalSavings)}</span>
                  </div>
                )}

                <p className="text-[10px] text-gray-400 mb-3">Envío e impuestos calculados al finalizar</p>

                <Link
                  to="/cart" onClick={closeCart}
                  className="flex items-center justify-between w-full px-3.5 py-2.5 mb-2.5 border-2 border-gray-200 hover:border-[#1e1e2f] hover:bg-[#1e1e2f] rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={14} className="text-gray-500 group-hover:text-white transition-colors duration-300" />
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-white transition-colors duration-300">
                      Ver carrito completo
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </Link>

                <Link to="/checkout" onClick={closeCart}>
                  <Button
                    className="w-full bg-[#1e1e2f] hover:bg-[#1e1e2f]/80 text-white transition-colors duration-300"
                    size="lg"
                  >
                    Proceder al pago · {formatPrice(subtotal)}
                  </Button>
                </Link>

                <p className="text-[10px] text-gray-400 text-center mt-2.5">
                  🔒 Compra 100% segura y protegida
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}