import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, MapPin, Truck, ArrowLeft } from "lucide-react";
import { useOrder, useCancelOrder } from "../hooks/useOrders.js";
import Spinner from "../components/ui/Spinner.jsx";
import Button from "../components/ui/Button.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import { formatDate } from "../utils/formatDate.js";

const STATUS_STYLES = {
  pendiente: "bg-yellow-100 text-yellow-700",
  pagado: "bg-blue-100 text-blue-700",
  preparando: "bg-purple-100 text-purple-700",
  enviado: "bg-indigo-100 text-indigo-700",
  entregado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
  reembolsado: "bg-gray-100 text-gray-700",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id);
  const cancelOrder = useCancelOrder();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  if (!order)
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Pedido no encontrado</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/orders"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft size={16} /> Volver a mis pedidos
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Pedido #{order.codigo_orden}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {formatDate(order.created_at)}
          </p>
        </div>
        <span
          className={`text-sm font-semibold px-4 py-1.5 rounded-full ${STATUS_STYLES[order.estado]}`}
        >
          {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Productos */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package size={18} className="text-red-500" />
              <h2 className="font-bold text-gray-800">Productos</h2>
            </div>
            <div className="flex flex-col gap-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {item.imagen_url && (
                      <img
                        src={item.imagen_url}
                        alt={item.nombre_producto}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">
                      {item.nombre_producto}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      x{item.cantidad} unidades
                    </p>
                    <p className="text-sm font-bold text-red-500 mt-1">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-red-500" />
              <h2 className="font-bold text-gray-800">Dirección de entrega</h2>
            </div>
            <p className="font-semibold text-gray-800">
              {order.nombre_destinatario}
            </p>
            <p className="text-sm text-gray-500 mt-1">{order.calle}</p>
            <p className="text-sm text-gray-500">
              {order.ciudad}, {order.departamento}
            </p>
            <p className="text-sm text-gray-500">{order.pais}</p>
          </div>

          {/* Tracking */}
          {order.tracking_number && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Truck size={18} className="text-red-500" />
                <h2 className="font-bold text-gray-800">Seguimiento</h2>
              </div>
              <p className="text-sm text-gray-600">
                Número de tracking:{" "}
                <span className="font-bold text-gray-800">
                  {order.tracking_number}
                </span>
              </p>
            </div>
          )}

          {/* Historial */}
          {order.history?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 mb-4">
                Historial del pedido
              </h2>
              <div className="flex flex-col gap-3">
                {order.history.map((h, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 capitalize">
                        {h.estado}
                      </p>
                      {h.comentario && (
                        <p className="text-xs text-gray-400">{h.comentario}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        {formatDate(h.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resumen */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">Resumen de pago</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.descuento > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600">Descuento</span>
                  <span className="text-green-600">
                    -{formatPrice(order.descuento)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Envío</span>
                <span>{formatPrice(order.costo_envio)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-3 mt-1">
                <span>Total</span>
                <span className="text-red-500">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {["pendiente", "pagado"].includes(order.estado) && (
            <Button
              variant="danger"
              className="w-full"
              loading={cancelOrder.isPending}
              onClick={() => cancelOrder.mutate(order.id)}
            >
              Cancelar pedido
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
