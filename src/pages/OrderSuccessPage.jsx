import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { useOrder } from "../hooks/useOrders.js";
import Button from "../components/ui/Button.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import { formatDate } from "../utils/formatDate.js";
import Spinner from "../components/ui/Spinner.jsx";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle size={48} className="text-green-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          ¡Pedido confirmado!
        </h1>
        <p className="text-gray-500 mb-8">
          Gracias por tu compra. Te notificaremos cuando sea enviado.
        </p>

        {order && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-left mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package size={20} className="text-red-500" />
                <span className="font-bold text-gray-800">
                  Pedido #{order.codigo_orden}
                </span>
              </div>
              <span className="text-sm text-gray-400">
                {formatDate(order.created_at)}
              </span>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.nombre_producto} x{item.cantidad}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Envío</span>
                <span>{formatPrice(order.costo_envio)}</span>
              </div>
              {order.descuento > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Descuento</span>
                  <span className="text-green-600">
                    -{formatPrice(order.descuento)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base mt-1">
                <span>Total pagado</span>
                <span className="text-red-500">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders">
            <Button size="lg">Ver mis pedidos</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="lg">
              Seguir comprando <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
