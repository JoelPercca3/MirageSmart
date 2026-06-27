import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { MapPin, Truck, Tag, ChevronDown, ChevronUp, Flame, ShoppingCart } from "lucide-react";
import { useCart, useApplyCoupon, useAddToCart } from "../hooks/useCart.js";
import { useCreateOrder } from "../hooks/useOrders.js";
import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "../api/user.api.js";
import useCartStore from "../store/useCartStore.js";
import Button from "../components/ui/Button.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import api from "../api/axios.js";
import { useCulqiPayment } from "../hooks/usePayment.js";
import AddressModal from "../components/address/AddressModal.jsx";
import { productAPI } from "../api/product.api.js";

const schema = z.object({
  address_id: z.coerce
    .number({ required_error: "Selecciona una dirección" })
    .int()
    .positive(),
  shipping_method_id: z.coerce
    .number({ required_error: "Selecciona método de envío" })
    .int()
    .positive(),
  coupon_code: z.string().optional(),
  notas_cliente: z.string().max(500).optional(),
});

export default function CheckoutPage() {
  const [couponInput, setCouponInput] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);

  const { items, subtotal, clearCart } = useCartStore();
  const createOrder = useCreateOrder();
  const applyCoupon = useApplyCoupon();
  const addToCart = useAddToCart();
  const { openCulqi, loading: culqiLoading } = useCulqiPayment();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: addresses, refetch: refetchAddresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => userAPI.getAddresses(),
    select: (res) => res.data,
  });

  const { data: shippingMethods } = useQuery({
    queryKey: ["shipping-methods"],
    queryFn: () => api.get("/shipping"),
    select: (res) => res.data,
  });

  // ── Relacionados de todos los productos del carrito ──
  const cartProductIds = new Set(items.map((i) => i.product_id));

  const relatedQueries = useQueries({
    queries: items.map((item) => ({
      queryKey: ["related", item.product_id],
      queryFn: () => productAPI.getRelated(item.product_id),
      select: (res) => res.data,
      enabled: !!item.product_id,
    })),
  });

  const suggestedProducts = [
    ...new Map(
      relatedQueries
        .flatMap((q) => q.data ?? [])
        .filter((p) => !cartProductIds.has(p.id))
        .map((p) => [p.id, p])
    ).values(),
  ].slice(0, 4);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const selectedShipping = shippingMethods?.find(
    (s) => s.id === watch("shipping_method_id"),
  );

  const descuento = couponData?.descuento || 0;
  const costo_envio = selectedShipping?.precio || 0;
  const total = Math.max(0, subtotal - descuento + costo_envio);

  const handleCoupon = () => {
    if (!couponInput.trim()) return;
    applyCoupon.mutate(couponInput.trim(), {
      onSuccess: (res) => setCouponData(res.data),
    });
  };

  const onSubmit = async (data) => {
    if (!acceptTerms) {
      setTermsError("Debes aceptar los Términos y Condiciones para continuar");
      return;
    }
    setTermsError("");

    try {
      const order = await createOrder.mutateAsync({
        address_id: Number(data.address_id),
        shipping_method_id: Number(data.shipping_method_id),
        coupon_code: couponData ? couponInput : undefined,
        notas_cliente: data.notas_cliente || null,
      });
      setCreatedOrder(order.data || order);
    } catch (err) {
      console.error("Error al crear la orden:", err);
    }
  };

  const handleCulqiPayment = () => {
    if (!createdOrder) return;

    openCulqi(createdOrder, {
      onSuccess: () => {
        clearCart();
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["order", createdOrder.id] });
        navigate(`/pedido/${createdOrder.id}/exito`);
      },
      onError: (error) => {
        console.error("Error en pago:", error);
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl">🛒</span>
        <h2 className="text-xl font-bold text-gray-700 mt-4 mb-2">
          Tu carrito está vacío
        </h2>
        <p className="text-gray-500 mb-6">
          Agrega productos antes de continuar
        </p>
        <Button onClick={() => window.history.back()}>Volver a comprar</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Finalizar compra
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Dirección */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-red-500" />
                <h2 className="font-bold text-gray-800">Dirección de envío</h2>
              </div>

              {!addresses?.length ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm mb-3">
                    No tienes direcciones guardadas
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setShowAddressModal(true)}
                  >
                    + Agregar dirección
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${watch("address_id") === addr.id
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <input
                        type="radio"
                        value={addr.id}
                        className="mt-1 accent-red-500"
                        {...register("address_id", { valueAsNumber: true })}
                      />
                      <div>
                        <p className="font-semibold text-sm text-gray-800">
                          {addr.nombre_destinatario}
                          {addr.es_predeterminada === 1 && (
                            <span className="ml-2 text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
                              Principal
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {addr.calle}
                        </p>
                        <p className="text-sm text-gray-500">
                          {addr.distrito}, {addr.provincia}, {addr.departamento}
                        </p>
                        {addr.telefono_contacto && (
                          <p className="text-sm text-gray-400">
                            {addr.telefono_contacto}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(true)}
                    className="mt-2 text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                  >
                    + Agregar nueva dirección
                  </button>
                  {errors.address_id && (
                    <p className="text-xs text-red-500">
                      {errors.address_id.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Método de envío */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck size={20} className="text-red-500" />
                <h2 className="font-bold text-gray-800">Método de envío</h2>
              </div>
              <div className="flex flex-col gap-3">
                {shippingMethods?.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${watch("shipping_method_id") === method.id
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value={method.id}
                        className="accent-red-500"
                        {...register("shipping_method_id", {
                          valueAsNumber: true,
                        })}
                      />
                      <div>
                        <p className="font-semibold text-sm text-gray-800">
                          {method.nombre}
                        </p>
                        <p className="text-xs text-gray-400">
                          {method.dias_entrega_min}–{method.dias_entrega_max} días hábiles
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-gray-800">
                      {method.precio == 0 ? "Gratis" : formatPrice(method.precio)}
                    </span>
                  </label>
                ))}
                {errors.shipping_method_id && (
                  <p className="text-xs text-red-500">
                    {errors.shipping_method_id.message}
                  </p>
                )}
              </div>
            </div>

            {/* Cupón */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={20} className="text-red-500" />
                <h2 className="font-bold text-gray-800">Cupón de descuento</h2>
              </div>
              {couponData ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-4"
                >
                  <div>
                    <p className="font-bold text-green-700">
                      {couponInput.toUpperCase()}
                    </p>
                    <p className="text-sm text-green-600">
                      Descuento aplicado: {formatPrice(couponData.descuento)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCouponData(null);
                      setCouponInput("");
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Quitar
                  </button>
                </motion.div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Ingresa tu cupón"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCoupon}
                    loading={applyCoupon.isPending}
                  >
                    Aplicar
                  </Button>
                </div>
              )}
            </div>

            {/* Notas */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <button
                type="button"
                onClick={() => setShowNotes(!showNotes)}
                className="flex items-center justify-between w-full"
              >
                <h2 className="font-bold text-gray-800">
                  Notas del pedido (opcional)
                </h2>
                {showNotes ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {showNotes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <textarea
                    {...register("notas_cliente")}
                    rows={3}
                    placeholder="Instrucciones especiales para tu pedido..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 resize-none"
                  />
                </motion.div>
              )}
            </div>
          </div>

          {/* RESUMEN */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-gray-800 mb-4">Resumen del pedido</h2>

              {/* Items */}
              <div className="flex flex-col gap-3 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.imagen && (
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 line-clamp-2">
                        {item.nombre}
                      </p>
                      <p className="text-xs text-gray-400">x{item.cantidad}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-800 flex-shrink-0">
                      {formatPrice(Number(item.precio_unitario) * item.cantidad)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Descuento</span>
                    <span className="text-green-600 font-medium">
                      -{formatPrice(descuento)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Envío</span>
                  <span className="font-medium">
                    {costo_envio === 0 ? "Gratis" : formatPrice(costo_envio)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold border-t pt-3 mt-1">
                  <span>Total</span>
                  <span className="text-red-500 text-xl">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Términos */}
              <div className="mt-5 pt-3 border-t">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      if (e.target.checked) setTermsError("");
                    }}
                    className="mt-0.5 w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    He leído y acepto los{" "}
                    <Link to="/terminos" className="text-red-500 hover:underline" target="_blank">
                      Términos y Condiciones
                    </Link>
                    , la{" "}
                    <Link to="/privacidad" className="text-red-500 hover:underline" target="_blank">
                      Política de Privacidad
                    </Link>{" "}
                    y la{" "}
                    <Link to="/reembolsos" className="text-red-500 hover:underline" target="_blank">
                      Política de Reembolsos
                    </Link>
                  </span>
                </label>
                {termsError && <p className="text-xs text-red-500 mt-2">{termsError}</p>}
              </div>

              {/* Pago */}
              {!createdOrder ? (
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-4"
                  loading={createOrder.isPending}
                >
                  Crear pedido
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 flex flex-col gap-3"
                >
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <p className="text-green-700 text-sm font-medium">
                      ✅ Pedido #{createdOrder.codigo_orden} creado
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                      Completa el pago para confirmar
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                    loading={culqiLoading}
                    onClick={handleCulqiPayment}
                  >
                    💳 Pagar {formatPrice(createdOrder.total)} con Culqi
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    🔒 Pago seguro — Visa, Mastercard, Amex
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* ── PRODUCTOS SUGERIDOS (AHORA ABAJO) ── */}
      {suggestedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-orange-100 p-1.5 rounded-lg">
              <Flame size={18} className="text-orange-500" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-base">
                ¡Llévalo también! Productos que combinan con tu pedido
              </h2>
              <p className="text-xs text-gray-400">
                Agrégalos ahora y paga todo junto
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {suggestedProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Imagen */}
                <Link to={`/products/${product.id}`}>
                  <div className="relative" style={{ paddingBottom: "100%" }}>
                    <img
                      src={
                        product.images?.find((img) => !img.variant_id)?.url ||
                        product.images?.[0]?.url ||
                        "https://placehold.co/300x300?text=Sin+imagen"
                      }
                      alt={product.nombre}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {product.porcentaje_desc > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                        -{product.porcentaje_desc}%
                      </span>
                    )}
                  </div>
                </Link>

                {/* Info del producto */}
                <div className="p-2.5">
                  <p className="text-xs font-medium text-gray-700 line-clamp-2 mb-1.5 leading-snug">
                    {product.nombre}
                  </p>
                  <div className="flex items-center justify-between gap-1">
                    <div>
                      <p className="text-sm font-bold text-red-500">
                        {formatPrice(
                          product.precio_final ||
                          product.precio_oferta ||
                          product.precio_base
                        )}
                      </p>
                      {product.precio_oferta &&
                        Number(product.precio_base) > Number(product.precio_oferta) && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(product.precio_base)}
                          </p>
                        )}
                    </div>
                    <button
                      onClick={() =>
                        addToCart.mutate({
                          product_id: product.id,
                          cantidad: 1,
                        })
                      }
                      disabled={addToCart.isPending}
                      className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition active:scale-95"
                    >
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onAddressAdded={() => {
          refetchAddresses();
          setShowAddressModal(false);
        }}
      />
    </div>
  );
}