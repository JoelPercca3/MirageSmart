import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { useCart } from "../hooks/useCart.js";
import useCartStore from "../store/useCartStore.js";
import CartItem from "../components/cart/CartItem.jsx";
import CartSummary from "../components/cart/CartSummary.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import ProductCard from "../components/product/ProductCard.jsx";
import { productAPI } from "../api/product.api.js";
import { useFeaturedProducts } from "../hooks/useProducts.js";

export default function CartPage() {
  const { isLoading } = useCart();
  const { items } = useCartStore();

  // Relacionados de todos los productos del carrito
  const cartProductIds = new Set(items.map((i) => i.product_id));

  const relatedQueries = useQueries({
    queries: items.map((item) => ({
      queryKey: ["related", item.product_id],
      queryFn: () => productAPI.getRelated(item.product_id),
      select: (res) => res.data,
      enabled: !!item.product_id,
    })),
  });

  // Mezclamos, deduplicamos y filtramos los que ya están en el carrito
  const relatedFiltered = [
    ...new Map(
      relatedQueries
        .flatMap((q) => q.data ?? [])
        .filter((p) => !cartProductIds.has(p.id))
        .map((p) => [p.id, p])
    ).values(),
  ].slice(0, 6);

  // Fallback: productos destacados cuando no hay relacionados
  const { data: featured } = useFeaturedProducts();
  const featuredFiltered = (featured ?? [])
    .filter((p) => !cartProductIds.has(p.id))
    .slice(0, 6);

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

      {/* Productos relacionados o destacados como fallback */}
      {(relatedFiltered.length > 0 || featuredFiltered.length > 0) && (
        <div className="mt-14 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">
              {relatedFiltered.length > 0
                ? "También te puede interesar"
                : "Productos destacados"}
            </h2>
            <Link
              to="/products"
              className="text-sm text-red-500 hover:underline"
            >
              Ver más →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(relatedFiltered.length > 0
              ? relatedFiltered
              : featuredFiltered
            ).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}