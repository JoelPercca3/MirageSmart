// src/pages/OrderDetailPage.jsx
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Package, MapPin, Truck, ArrowLeft, ClipboardList,
  CheckCircle, Clock, XCircle, RefreshCw, CreditCard,
} from "lucide-react";
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

// Orden lógico del flujo de un pedido
const STATUS_FLOW = [
  { key: "pendiente", label: "Pedido recibido", icon: Clock },
  { key: "pagado", label: "Pago confirmado", icon: CreditCard },
  { key: "preparando", label: "En preparación", icon: Package },
  { key: "enviado", label: "En camino", icon: Truck },
  { key: "entregado", label: "Entregado", icon: CheckCircle },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseVariantOpts(raw) {
  if (!raw) return null;
  try {
    const opts = typeof raw === "object" ? raw : JSON.parse(raw);
    return Object.entries(opts).map(([k, v]) => `${k}: ${v}`).join(" · ");
  } catch { return raw; }
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Timeline de seguimiento ──────────────────────────────────────────────────

function OrderTimeline({ estado, history }) {
  // Si está cancelado o reembolsado, mostrar solo eso
  if (["cancelado", "reembolsado"].includes(estado)) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
        <XCircle size={20} className="text-red-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-700 capitalize">{estado}</p>
          <p className="text-xs text-red-400 mt-0.5">
            {estado === "cancelado"
              ? "Este pedido fue cancelado"
              : "Este pedido fue reembolsado"}
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.findIndex((s) => s.key === estado);

  return (
    <div className="relative">
      {STATUS_FLOW.map((step, i) => {
        const isDone = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const Icon = step.icon;

        // Buscar fecha en el historial
        const historyEntry = history?.find((h) => h.estado === step.key);

        return (
          <div key={step.key} className="flex gap-3 mb-0">
            {/* Línea vertical + punto */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isCurrent
                ? "bg-red-500 text-white shadow-md shadow-red-200"
                : isDone
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-300"
                }`}>
                <Icon size={14} />
              </div>
              {i < STATUS_FLOW.length - 1 && (
                <div className={`w-0.5 h-8 mt-1 ${isDone && i < currentIndex ? "bg-green-400" : "bg-gray-100"}`} />
              )}
            </div>

            {/* Texto */}
            <div className="pb-6">
              <p className={`text-sm font-semibold ${isCurrent ? "text-red-600" : isDone ? "text-gray-800" : "text-gray-300"}`}>
                {step.label}
                {isCurrent && (
                  <span className="ml-2 text-xs font-normal bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
                    Actual
                  </span>
                )}
              </p>
              {historyEntry && (
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(historyEntry.created_at)}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
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
      <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
        {item.imagen_url ? (
          <img src={item.imagen_url} alt={item.nombre_producto} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={18} className="text-gray-300" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">{item.nombre_producto}</p>
            {variantLabel && <p className="text-xs text-gray-400 mt-0.5">{variantLabel}</p>}
            <p className="text-xs text-gray-400 mt-0.5">x{item.cantidad}</p>
          </div>
          <p className="text-sm font-bold text-red-500 whitespace-nowrap flex-shrink-0">
            {formatPrice(item.subtotal)}
          </p>
        </div>
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
    // ✅ Refetch automático cada 60s para ver actualizaciones de estado
    refetchInterval: 60_000,
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
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
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
      <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition mb-6">
        <ArrowLeft size={15} />
        Volver a mis pedidos
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pedido #{order.codigo_orden}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
        </div>
        <span className={`self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLES[order.estado] ?? "bg-gray-100 text-gray-600"}`}>
          {capitalize(order.estado)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Columna principal ── */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* ✅ Timeline de seguimiento */}
          <SectionCard icon={RefreshCw} title="Seguimiento del pedido">
            <OrderTimeline estado={order.estado} history={order.history} />

            {/* Tracking number si existe */}
            {order.tracking_number && (
              <div className="mt-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-xs text-indigo-500 font-medium mb-1">Número de tracking</p>
                <p className="font-mono font-bold text-indigo-700 text-sm">{order.tracking_number}</p>
              </div>
            )}
          </SectionCard>

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

          {/* Historial */}
          {order.history?.length > 0 && (
            <SectionCard icon={ClipboardList} title="Historial del pedido">
              <div className="flex flex-col gap-3">
                {order.history.map((h, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 capitalize">{h.estado}</p>
                      {h.comentario && <p className="text-xs text-gray-400 mt-0.5">{h.comentario}</p>}
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

          {/* Info de contacto */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-3">¿Necesitas ayuda?</h2>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Si tienes alguna duda sobre tu pedido, contáctanos por WhatsApp.
            </p>
            <a
              href={`https://wa.me/51944174400?text=Hola! Tengo una consulta sobre mi pedido #${order.codigo_orden}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition"
            >
              <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.738 5.49 2.027 7.8L0 32l8.418-2.01A15.938 15.938 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.273 19.406c-.398-.2-2.355-1.16-2.72-1.293-.366-.133-.632-.2-.898.2-.266.398-1.03 1.293-1.263 1.56-.233.266-.465.3-.863.1-.398-.2-1.681-.619-3.202-1.974-1.183-1.054-1.982-2.356-2.214-2.754-.233-.398-.025-.613.175-.812.18-.178.398-.465.598-.698.2-.233.266-.398.398-.664.133-.266.067-.498-.033-.698-.1-.2-.898-2.164-1.23-2.963-.324-.778-.654-.672-.898-.685-.233-.012-.498-.015-.764-.015s-.698.1-.964.398c-.266.3-1.03 1.006-1.03 2.454 0 1.449 1.063 2.85 1.21 3.048.148.2 2.09 3.19 5.063 4.476.708.306 1.26.488 1.69.625.71.226 1.357.194 1.868.118.57-.085 1.755-.717 2.003-1.41.248-.692.248-1.285.174-1.41-.074-.124-.274-.198-.573-.298z" />
              </svg>
              Escribir por WhatsApp
            </a>
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