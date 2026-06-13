import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, MapPin, Truck, ArrowLeft, ClipboardList } from "lucide-react";
import { orderAPI } from "../api/order.api.js";
import Spinner from "../components/ui/Spinner.jsx";
import Button from "../components/ui/Button.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import { formatDate } from "../utils/formatDate.js";
import OrderReviewButton from "../components/orders/OrderReviewButton.jsx";
import toast from "react-hot-toast";

// ─── Constantes ───────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  pendiente: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  pagado: "bg-blue-50 text-blue-700 border border-blue-200",
  preparando: "bg-purple-50 text-purple-700 border border-purple-200",
  enviado: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  entregado: "bg-green-50 text-green-700 border border-green-200",
  cancelado: "bg-red-50 text-red-700 border border-red-200",
  reembolsado: "bg-gray-100 text-gray-600 border border-gray-200",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseVariantOpts(raw) {
  if (!raw) return null;
  try {
    const opts = typeof raw === "object" ? raw : JSON.parse(raw);
    return Object.entries(opts).map(([k, v]) => `${k}: ${v}`).join(" · ");
  } catch {
    return raw;
  }
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={17} className="text-red-500 flex-shrink-0" />
        <h2 className="font-semibold text-gray-800 text-sm">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function OrderItem({ item, orderId, orderEstado }) {
  const variantLabel = parseVariantOpts(item.opciones_variante);
  const canReview = orderEstado === "entregado";

  return (
    <div className="flex gap-3 py-3 border-b border-gray-50 last:border-0 last:pb-0 first:pt-0">
      {/* Imagen */}
      <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
        {item.imagen_url ? (
          <img
            src={item.imagen_url}
            alt={item.nombre_producto}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={18} className="text-gray-300" />
          </div>
        )}
      </div>

      {/* Info + acciones */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
              {item.nombre_producto}
            </p>
            {variantLabel && (
              <p className="text-xs text-gray-400 mt-0.5">{variantLabel}</p>
            )}
            <p className="text-xs text-gray-400 mt-0.5">x{item.cantidad}</p>
          </div>
          <p className="text-sm font-bold text-red-500 whitespace-nowrap flex-shrink-0">
            {formatPrice(item.subtotal)}
          </p>
        </div>

        {/* Reseña: debajo del nombre, no del precio */}
        {canReview && (
          <div className="mt-2">
            <OrderReviewButton
              orderId={orderId}
              productId={item.product_id}
              productName={item.nombre_producto}
              productImage={item.imagen_url}
              hasReviewed={item.has_reviewed}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => {
      if (!id) throw new Error("ID no válido");
      return orderAPI.getOne(id);
    },
    select: (res) => res.data,
    enabled: !!id && id !== "undefined",
  });

  const cancelOrder = useMutation({
    mutationFn: (orderId) => orderAPI.cancel(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      toast.success("Pedido cancelado exitosamente");
    },
    onError: (err) => toast.error(err.message || "Error al cancelar pedido"),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Pedido no encontrado</p>
        <Link to="/orders" className="text-red-500 hover:underline text-sm">
          Volver a mis pedidos
        </Link>
      </div>
    );
  }

  const canCancel = ["pendiente", "pagado"].includes(order.estado);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Back */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition mb-6"
      >
        <ArrowLeft size={15} />
        Volver a mis pedidos
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Pedido #{order.codigo_orden}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
        </div>
        <span className={`self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLES[order.estado] ?? "bg-gray-100 text-gray-600"}`}>
          {capitalize(order.estado)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Columna principal ── */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Productos */}
          <SectionCard icon={Package} title="Productos">
            <div className="flex flex-col divide-y divide-gray-50">
              {order.items?.map((item) => (
                <OrderItem
                  key={item.id}
                  item={item}
                  orderId={order.id}
                  orderEstado={order.estado}
                />
              ))}
            </div>
          </SectionCard>

          {/* Dirección */}
          <SectionCard icon={MapPin} title="Dirección de entrega">
            <p className="font-semibold text-gray-800 text-sm">{order.nombre_destinatario}</p>
            <p className="text-sm text-gray-500 mt-1">{order.calle}</p>
            <p className="text-sm text-gray-500">{order.ciudad}, {order.departamento}</p>
            <p className="text-sm text-gray-500">{order.pais}</p>
          </SectionCard>

          {/* Tracking */}
          {order.tracking_number && (
            <SectionCard icon={Truck} title="Seguimiento">
              <p className="text-sm text-gray-600">
                Número de tracking:{" "}
                <span className="font-bold text-gray-800 font-mono tracking-wide">
                  {order.tracking_number}
                </span>
              </p>
            </SectionCard>
          )}

          {/* Historial */}
          {order.history?.length > 0 && (
            <SectionCard icon={ClipboardList} title="Historial del pedido">
              <div className="flex flex-col gap-3">
                {order.history.map((h, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 capitalize">{h.estado}</p>
                      {h.comentario && (
                        <p className="text-xs text-gray-400 mt-0.5">{h.comentario}</p>
                      )}
                      <p className="text-xs text-gray-400">{formatDate(h.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* ── Sidebar: resumen ── */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Resumen de pago</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-700">{formatPrice(order.subtotal)}</span>
              </div>
              {order.descuento > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-{formatPrice(order.descuento)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Envío</span>
                <span className="text-gray-700">{formatPrice(order.costo_envio)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm border-t border-gray-100 pt-3 mt-1">
                <span className="text-gray-800">Total</span>
                <span className="text-red-500">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {canCancel && (
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