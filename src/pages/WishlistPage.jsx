import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import { useWishlist, useToggleWishlist } from "../hooks/useWishlist.js";
import Spinner from "../components/ui/Spinner.jsx";
import Button from "../components/ui/Button.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import { useAddToCart } from "../hooks/useCart.js";

export default function WishlistPage() {
  const { data: items, isLoading } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const addToCart = useAddToCart();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart size={24} className="text-red-500 fill-red-500" />
        <h1 className="text-2xl font-bold text-gray-800">Mis favoritos</h1>
        {items?.length > 0 && (
          <span className="bg-red-100 text-red-500 text-sm font-bold px-2.5 py-0.5 rounded-full">
            {items.length}
          </span>
        )}
      </div>

      {items?.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={64} className="text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">
            No tienes favoritos aún
          </h3>
          <p className="text-gray-500 mb-6">
            Guarda productos que te gusten para verlos aquí
          </p>
          <Link to="/products">
            <Button>Ver productos</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items?.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-md transition"
            >
              <Link to={`/products/${item.product_id}`}>
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={
                      item.imagen_principal ||
                      "https://placehold.co/300x300?text=Sin+imagen"
                    }
                    alt={item.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.porcentaje_desc > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      -{item.porcentaje_desc}%
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-3">
                <Link to={`/products/${item.product_id}`}>
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
                    {item.nombre}
                  </h3>
                  <p className="text-red-500 font-bold">
                    {formatPrice(item.precio_final)}
                  </p>
                </Link>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() =>
                      addToCart.mutate({
                        product_id: item.product_id,
                        cantidad: 1,
                      })
                    }
                    loading={addToCart.isPending}
                  >
                    Agregar
                  </Button>
                  <button
                    onClick={() => toggleWishlist.mutate(item.product_id)}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition"
                  >
                    <Trash2
                      size={14}
                      className="text-gray-400 hover:text-red-500"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
