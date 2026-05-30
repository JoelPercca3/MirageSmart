import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import useCartStore from "../../store/useCartStore.js";
import { useCart } from "../../hooks/useCart.js";
import CartItem from "./CartItem.jsx";
import Button from "../ui/Button.jsx";
import { formatPrice } from "../../utils/formatPrice.js";

export default function CartDrawer() {
  const { isOpen, closeCart, items, subtotal } = useCartStore();
  useCart(); // sincroniza el carrito con el backend

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
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-red-500" />

                {/* LINK AL CARRITO */}
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="text-lg font-bold text-gray-800 hover:text-red-500 transition-colors"
                >
                  Mi Carrito
                </Link>

                {items.length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>

              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={64} className="text-gray-200" />
                  <p className="text-gray-500 font-medium">
                    Tu carrito está vacío
                  </p>
                  <Button variant="outline" onClick={closeCart} size="sm">
                    Seguir comprando
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

            {/* Footer con total */}
            {items.length > 0 && (
              <div className="border-t p-4 bg-gray-50">
                <div className="flex justify-between mb-1 text-sm text-gray-600">
                  <span>Subtotal ({items.length} productos)</span>
                  <span className="font-semibold text-gray-800">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Envío calculado al finalizar
                </p>
                <Link to="/checkout" onClick={closeCart}>
                  <Button className="w-full" size="lg">
                    Proceder al pago
                  </Button>
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 py-2"
                >
                  Seguir comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
