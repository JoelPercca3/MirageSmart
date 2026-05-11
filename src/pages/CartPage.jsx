import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "../hooks/useCart.js";
import useCartStore from "../store/useCartStore.js";
import CartItem from "../components/cart/CartItem.jsx";
import CartSummary from "../components/cart/CartSummary.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export default function CartPage() {
  const { isLoading } = useCart();
  const { items } = useCartStore();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );

  if (items.length === 0)
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <ShoppingBag size={80} className="text-gray-200 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-500 mb-8">
            ¡Agrega productos y empieza a comprar!
          </p>
          <Link to="/products">
            <Button size="lg">Ver productos</Button>
          </Link>
        </motion.div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/products"
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Mi carrito
          <span className="ml-2 text-base font-normal text-gray-400">
            ({items.length} productos)
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          <AnimatePresence>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </AnimatePresence>

          <Link
            to="/products"
            className="flex items-center gap-2 mt-6 text-sm text-red-500 hover:underline"
          >
            <ArrowLeft size={14} /> Seguir comprando
          </Link>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
