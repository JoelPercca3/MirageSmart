import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import {
  useProduct,
  useRelatedProducts,
  useProductReviews,
} from "../hooks/useProducts.js";
import { useAddToCart } from "../hooks/useCart.js";
import { useToggleWishlist } from "../hooks/useWishlist.js";
import ProductCard from "../components/product/ProductCard.jsx";
import { SkeletonGrid } from "../components/ui/SkeletonCard.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import { timeAgo } from "../utils/formatDate.js";
import useAuthStore from "../store/useAuthStore.js";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("descripcion");

  const token = useAuthStore((s) => s.token);
  const addToCart = useAddToCart();
  const toggleWish = useToggleWishlist();

  const { data: product, isLoading } = useProduct(id);
  const { data: related } = useRelatedProducts(id);
  const { data: reviewsData } = useProductReviews(id);

  const getImageUrl = (url) => {
    if (!url) return "https://placehold.co/600x600?text=Sin+imagen";
    if (url.startsWith("http")) return url;
    return `http://localhost:4000${url}`;
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Producto no encontrado</p>
        <Link to="/products">
          <Button className="mt-4">Ver productos</Button>
        </Link>
      </div>
    );

  const images =
    product.images?.length > 0
      ? product.images
      : [
          {
            url: "https://placehold.co/600x600?text=Sin+imagen",
            es_principal: 1,
          },
        ];

  const precio = selectedVariant
    ? Number(product.precio_base) + Number(selectedVariant.precio_extra || 0)
    : Number(
        product.precio_final || product.precio_oferta || product.precio_base,
      );

  const handleAddToCart = () => {
    addToCart.mutate({
      product_id: product.id,
      variant_id: selectedVariant?.id || null,
      cantidad: quantity,
    });
  };

  const handleWishlist = () => {
    if (!token) return;
    setWishlisted(!wishlisted);
    toggleWish.mutate(product.id);
  };

  const variantGroups = {};
  product.variants?.forEach((v) => {
    const opts =
      typeof v.opciones === "string" ? JSON.parse(v.opciones) : v.opciones;
    Object.entries(opts || {}).forEach(([k, val]) => {
      if (!variantGroups[k]) variantGroups[k] = [];
      if (!variantGroups[k].includes(val)) variantGroups[k].push(val);
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-red-500 transition">
          Inicio
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-red-500 transition">
          Productos
        </Link>
        <span>/</span>
        <span className="text-gray-600 line-clamp-1">{product.nombre}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={getImageUrl(images[selectedImage]?.url)}
                alt={product.nombre}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.porcentaje_desc > 0 && (
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{product.porcentaje_desc}%
                </span>
              )}
              {product.es_nuevo === 1 && (
                <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  NUEVO
                </span>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleWishlist}
              className="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-md hover:bg-red-50 transition"
            >
              <Heart
                size={20}
                className={
                  wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
                }
              />
            </motion.button>

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImage(
                      (prev) => (prev - 1 + images.length) % images.length,
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setSelectedImage((prev) => (prev + 1) % images.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white transition"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === i
                      ? "border-red-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={getImageUrl(img.url)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info del producto ── */}
        <div className="flex flex-col gap-5">
          {/* Marca y nombre */}
          {product.marca && (
            <p className="text-sm font-medium text-red-500">{product.marca}</p>
          )}
          <h1 className="text-2xl font-bold text-gray-800 leading-snug">
            {product.nombre}
          </h1>

          {/* Rating */}
          {product.rating_count > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(product.rating_promedio)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {Number(product.rating_promedio).toFixed(1)} (
                {product.rating_count} reseñas)
              </span>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-500">
                {product.ventas_count} vendidos
              </span>
            </div>
          )}

          {/* Precio */}
          <div className="flex items-end gap-3">
            <span className="text-4xl font-extrabold text-red-500">
              {formatPrice(precio)}
            </span>
            {product.precio_oferta &&
              product.precio_base > product.precio_oferta && (
                <span className="text-xl text-gray-400 line-through mb-1">
                  {formatPrice(product.precio_base)}
                </span>
              )}
          </div>

          {/* Variantes */}
          {Object.entries(variantGroups).map(([atributo, valores]) => (
            <div key={atributo}>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {atributo}:
                {selectedVariant && (
                  <span className="font-normal text-gray-500 ml-1">
                    {
                      (typeof selectedVariant.opciones === "string"
                        ? JSON.parse(selectedVariant.opciones)
                        : selectedVariant.opciones)?.[atributo]
                    }
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {valores.map((val) => {
                  const variant = product.variants?.find((v) => {
                    const opts =
                      typeof v.opciones === "string"
                        ? JSON.parse(v.opciones)
                        : v.opciones;
                    return opts?.[atributo] === val;
                  });
                  const isSelected = selectedVariant?.id === variant?.id;
                  const outOfStock = variant?.stock === 0;

                  return (
                    <button
                      key={val}
                      disabled={outOfStock}
                      onClick={() =>
                        setSelectedVariant(isSelected ? null : variant)
                      }
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition ${
                        isSelected
                          ? "border-red-500 bg-red-50 text-red-600"
                          : outOfStock
                            ? "border-gray-100 text-gray-300 cursor-not-allowed line-through"
                            : "border-gray-200 text-gray-700 hover:border-red-300"
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Cantidad */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Cantidad:
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 hover:bg-gray-50 transition"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-bold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="px-4 py-2.5 hover:bg-gray-50 transition"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-sm text-gray-400">
                {product.stock_total > 0
                  ? `${product.stock_total} disponibles`
                  : "Sin stock"}
              </span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              loading={addToCart.isPending}
              disabled={product.stock_total === 0}
            >
              <ShoppingCart size={18} />
              {product.stock_total === 0 ? "Sin stock" : "Agregar al carrito"}
            </Button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className={`p-3.5 rounded-xl border-2 transition ${
                wishlisted
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-red-300"
              }`}
            >
              <Heart
                size={22}
                className={
                  wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
                }
              />
            </motion.button>
          </div>

          {/* Garantías */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, text: "Envío rápido" },
              { icon: Shield, text: "Compra segura" },
              { icon: RotateCcw, text: "Devoluciones" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl text-center"
              >
                <Icon size={20} className="text-red-500" />
                <span className="text-xs text-gray-600 font-medium">
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Atributos */}
          {product.atributos?.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Características
              </p>
              <div className="grid grid-cols-2 gap-2">
                {product.atributos.map((attr, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-gray-400 font-medium">
                      {attr.atributo}:
                    </span>
                    <span className="text-gray-700">{attr.valor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs: Descripción y Reseñas ── */}
      <div className="mt-12">
        <div className="flex border-b border-gray-200 mb-6">
          {["descripcion", "resenas"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-semibold transition border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-red-500 text-red-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "descripcion"
                ? "Descripción"
                : `Reseñas (${product.rating_count || 0})`}
            </button>
          ))}
        </div>

        {activeTab === "descripcion" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose max-w-none text-gray-600 text-sm leading-relaxed"
          >
            {product.descripcion || "Sin descripción disponible."}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            {reviewsData?.data?.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Aún no hay reseñas para este producto.
              </p>
            ) : (
              reviewsData?.data?.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white border border-gray-100 rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-bold text-red-500">
                      {rev.autor?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {rev.autor}
                      </p>
                      <p className="text-xs text-gray-400">
                        {timeAgo(rev.created_at)}
                      </p>
                    </div>
                    <div className="ml-auto flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={
                            i < rev.calificacion
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {rev.titulo && (
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {rev.titulo}
                    </p>
                  )}
                  {rev.comentario && (
                    <p className="text-sm text-gray-600">{rev.comentario}</p>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}
      </div>

      {/* ── Productos relacionados ── */}
      {related?.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            También te puede gustar
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {related.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
