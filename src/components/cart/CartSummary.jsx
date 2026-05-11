import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import useCartStore from "../../store/useCartStore.js";
import Button from "../ui/Button.jsx";
import { formatPrice } from "../../utils/formatPrice.js";

export default function CartSummary({ couponData, onCheckout }) {
  const { items, subtotal } = useCartStore();

  const descuento = couponData?.descuento || 0;
  const total = Math.max(0, subtotal - descuento);
  const freeShipping = subtotal >= 150;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
      <h2 className="font-bold text-gray-800 mb-4">Resumen</h2>

      <div className="flex flex-col gap-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500">
            Subtotal ({items.length} productos)
          </span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {descuento > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex justify-between"
          >
            <span className="text-green-600 flex items-center gap-1">
              <Tag size={12} /> Descuento
            </span>
            <span className="text-green-600 font-medium">
              -{formatPrice(descuento)}
            </span>
          </motion.div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-500">Envío</span>
          <span
            className={
              freeShipping ? "text-green-600 font-medium" : "text-gray-500"
            }
          >
            {freeShipping ? "Gratis" : "Calculado al pagar"}
          </span>
        </div>

        {!freeShipping && (
          <p className="text-xs text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg">
            ¡Agrega S/ {formatPrice(150 - subtotal)} más para envío gratis!
          </p>
        )}
      </div>

      <div className="border-t pt-4 flex justify-between font-bold text-base mb-6">
        <span>Total estimado</span>
        <span className="text-red-500 text-xl">{formatPrice(total)}</span>
      </div>

      {onCheckout ? (
        <Button size="lg" className="w-full" onClick={onCheckout}>
          Proceder al pago
        </Button>
      ) : (
        <Link to="/checkout">
          <Button size="lg" className="w-full">
            Proceder al pago
          </Button>
        </Link>
      )}

      <p className="text-xs text-gray-400 text-center mt-3">
        🔒 Compra 100% segura y protegida
      </p>
    </div>
  );
}
