import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight, ShoppingCart, Package } from "lucide-react";
import { Link } from "react-router-dom";
import useCartStore from "../../store/useCartStore.js";
import { useCart } from "../../hooks/useCart.js";
import CartItem from "./CartItem.jsx";
import Button from "../ui/Button.jsx";
import { formatPrice } from "../../utils/formatPrice.js";

export default function CartDrawer() {
  const { isOpen, closeCart, items, subtotal } = useCartStore();
  useCart();

  const freeShipping = subtotal >= 150;
  const freeShippingRemaining = Math.max(0, 150 - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / 150) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="bg-[#1e1e2f]/10 p-1.5 rounded-lg">
                  <Package size={18} className="text-[#1e1e2f]" />
                </div>
                <span className="text-base font-bold text-[#1e1e2f]">
                  Mi Carrito
                </span>
                {items.length > 0 && (
                  <span className="bg-[#1e1e2f] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-[#1e1e2f] hover:text-white rounded-lg transition text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Barra de envío gratis - ELIMINADA */}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="bg-[#1e1e2f]/5 rounded-full p-6">
                    <ShoppingBag size={48} className="text-[#1e1e2f]/30" />
                  </div>
                  <div>
                    <p className="text-[#1e1e2f] font-semibold mb-1">
                      Tu carrito está vacío
                    </p>
                    <p className="text-gray-400 text-sm">
                      Agrega productos para comenzar
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={closeCart}
                    size="sm"
                    className="border-[#1e1e2f] text-[#1e1e2f] hover:bg-[#1e1e2f] hover:text-white transition-colors duration-300"
                  >
                    Ver productos
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-5 bg-white">
                {/* Subtotal */}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500">
                    Subtotal ({items.length}{" "}
                    {items.length === 1 ? "producto" : "productos"})
                  </span>
                  <span className="font-bold text-[#1e1e2f] text-base">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Envío e impuestos calculados al finalizar
                </p>

                {/* Botón ver carrito completo - DARK HOVER */}
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="flex items-center justify-between w-full px-4 py-3 mb-3 border-2 border-gray-200 hover:border-[#1e1e2f] hover:bg-[#1e1e2f] rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart
                      size={16}
                      className="text-gray-500 group-hover:text-white transition-colors duration-300"
                    />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors duration-300">
                      Ver carrito completo
                    </span>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                  />
                </Link>

                {/* Botón checkout - DARK */}
                <Link to="/checkout" onClick={closeCart}>
                  <Button
                    className="w-full bg-[#1e1e2f] hover:bg-[#1e1e2f]/80 text-white transition-colors duration-300"
                    size="lg"
                  >
                    Proceder al pago · {formatPrice(subtotal)}
                  </Button>
                </Link>

                <p className="text-xs text-gray-400 text-center mt-3">
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