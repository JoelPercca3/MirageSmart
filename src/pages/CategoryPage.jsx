import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { categoryAPI } from "../api/category.api.js";
import { useProducts } from "../hooks/useProducts.js";
import ProductGrid from "../components/product/ProductGrid.jsx";
import { useState } from "react";

export default function CategoryPage() {
  const { id } = useParams();
  const [sort, setSort] = useState("newest");

  const { data: category } = useQuery({
    queryKey: ["category", id],
    queryFn: () => categoryAPI.getOne(id),
    select: (res) => res.data,
  });

  const { data, isLoading } = useProducts({ category_id: id, sort, limit: 20 });

  const SORT_OPTIONS = [
    { label: "Más recientes", value: "newest" },
    { label: "Menor precio", value: "price_asc" },
    { label: "Mayor precio", value: "price_desc" },
    { label: "Más vendidos", value: "popular" },
    { label: "Mejor valorados", value: "rating" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-800">
          {category?.nombre || "Categoría"}
        </h1>
        {data?.meta && (
          <p className="text-sm text-gray-500 mt-1">
            {data.meta.total} productos
          </p>
        )}
      </motion.div>

      {/* Sort */}
      <div className="flex gap-2 overflow-x-auto mb-6">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSort(opt.value)}
            className={`whitespace-nowrap text-xs px-4 py-2 rounded-full border transition ${
              sort === opt.value
                ? "bg-red-500 text-white border-red-500"
                : "border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <ProductGrid products={data?.data} isLoading={isLoading} cols={4} />
    </div>
  );
}
