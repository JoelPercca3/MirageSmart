import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ChevronRight } from "lucide-react";
import { useOrders } from "../hooks/useOrders.js";
import Spinner from "../components/ui/Spinner.jsx";
import Button from "../components/ui/Button.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import { formatDateShort } from "../utils/formatDate.js";
import OrderReviewButton from "../components/orders/OrderReviewButton.jsx";


const STATUS_STYLES = {
  pendiente: "bg-yellow-100 text-yellow-700",
  pagado: "bg-blue-100 text-blue-700",
  preparando: "bg-purple-100 text-purple-700",
  enviado: "bg-indigo-100 text-indigo-700",
  entregado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
  reembolsado: "bg-gray-100 text-gray-700",
};

export default function OrdersPage() {
  const { data, isLoading } = useOrders();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );

  const orders = data?.rows || data?.data || [];


  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">
            No tienes pedidos aún
          </h3>
          <p className="text-gray-500 mb-6">
            ¡Empieza a comprar y tus pedidos aparecerán aquí!
          </p>
          <Link to="/products">
            <Button>Ver productos</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order, i) => (

            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}

            >

              <Link to={`/orders/${order.id}`}>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-800">
                        #{order.codigo_orden}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatDateShort(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[order.estado]}`}
                      >
                        {order.estado.charAt(0).toUpperCase() +
                          order.estado.slice(1)}
                      </span>
                      <ChevronRight size={18} className="text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {order.total_items} producto(s)
                    </span>
                    <span className="font-bold text-red-500">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
