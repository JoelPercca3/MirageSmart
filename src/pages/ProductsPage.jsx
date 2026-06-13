import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "../hooks/useProducts.js";
import { useQuery } from "@tanstack/react-query";
import { categoryAPI } from "../api/category.api.js";
import ProductCard from "../components/product/ProductCard.jsx";
import { SkeletonGrid } from "../components/ui/SkeletonCard.jsx";
import Button from "../components/ui/Button.jsx";

const SORT_OPTIONS = [
  { label: "Más recientes", value: "created_at:desc" },
  { label: "Menor precio", value: "precio:asc" },
  { label: "Mayor precio", value: "precio:desc" },
  { label: "Más vendidos", value: "ventas:desc" },
  { label: "Mejor valorados", value: "rating:desc" },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const q = searchParams.get("q") || "";
  const category_id = searchParams.get("category_id") || "";
  const sort = searchParams.get("sort") || "newest";
  const min_price = searchParams.get("min_price") || "";
  const max_price = searchParams.get("max_price") || "";
  const page = searchParams.get("page") || 1;

  const { data: result, isLoading } = useProducts({
    search: q,
    category_id,
    sort,
    min_price,
    max_price,
    page,
    limit: 20,
  });

  const products = result?.data || [];
  const meta = result?.meta || {};

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryAPI.getAll,
    select: (res) => res.data,
  });

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});
  const hasFilters = q || category_id || min_price || max_price;

  return (
    <div className="w-full px-28 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-0">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            {q ? `Resultados para "${q}"` : "Todos los productos"}
          </h1>
          {meta.total !== undefined && (
            <p className="text-sm text-gray-500 mt-0.5">
              {meta.total} productos encontrados
            </p>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition sm:hidden"
        >
          <SlidersHorizontal size={16} />
          Filtros
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filtros */}

        <aside
          className={`w-64 flex-shrink-0 flex-col gap-5 ${showFilters ? "flex" : "hidden"} sm:flex`}
        >
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800">Filtros</h3>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1"
                >
                  <X size={12} /> Limpiar
                </button>
              )}
            </div>

            {/* Categorías */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Categoría
              </p>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setParam("category_id", "")}
                  className={`text-left text-sm px-3 py-1.5 rounded-lg transition ${!category_id
                    ? "bg-red-50 text-red-500 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  Todas
                </button>
                {categories
                  ?.filter((c) => !c.parent_id)
                  .map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setParam("category_id", cat.id)}
                      className={`text-left text-sm px-3 py-1.5 rounded-lg transition ${category_id == cat.id
                        ? "bg-red-50 text-red-500 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      {cat.nombre}
                    </button>
                  ))}
              </div>
            </div>

            {/* Precio */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Precio (S/)
              </p>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={min_price}
                  onChange={(e) => setParam("min_price", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-400"
                />
                <span className="text-gray-400 text-sm">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={max_price}
                  onChange={(e) => setParam("max_price", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-400"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  ["0-50", "0", "50"],
                  ["50-100", "50", "100"],
                  ["100-200", "100", "200"],
                  ["200+", "200", ""],
                ].map(([label, min, max]) => (
                  <button
                    key={label}
                    onClick={() => {
                      setParam("min_price", min);
                      setParam("max_price", max);
                    }}
                    className="text-xs px-3 py-1 border border-gray-200 rounded-full hover:border-red-400 hover:text-red-500 transition"
                  >
                    S/ {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Productos */}
        <div className="flex-1 min-w-0">
          {/* Sort */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar mb-6">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setParam("sort", opt.value)}
                className={`whitespace-nowrap text-xs px-4 py-2 rounded-full border transition ${sort === opt.value
                  ? "bg-red-500 text-white border-red-500"
                  : "border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {isLoading ? (
            <SkeletonGrid count={12} />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-6xl mb-4">🔍</span>
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Intenta con otros filtros
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Paginación */}
          {meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setParam("page", Number(page) - 1)}
              >
                Anterior
              </Button>
              <div className="flex gap-1">
                {Array.from(
                  { length: Math.min(5, meta.totalPages) },
                  (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setParam("page", p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition ${Number(page) === p
                          ? "bg-red-500 text-white"
                          : "border border-gray-200 text-gray-600 hover:border-red-400"
                          }`}
                      >
                        {p}
                      </button>
                    );
                  },
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={Number(page) >= meta.totalPages}
                onClick={() => setParam("page", Number(page) + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
