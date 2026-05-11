import { motion } from "framer-motion";
import ProductCard from "./ProductCard.jsx";
import { SkeletonGrid } from "../ui/SkeletonCard.jsx";

export default function ProductGrid({ products, isLoading, cols = 4 }) {
  const colsMap = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  };

  if (isLoading) return <SkeletonGrid count={cols * 2} />;

  if (!products?.length)
    return (
      <div className="text-center py-16">
        <span className="text-5xl">🔍</span>
        <p className="text-gray-500 mt-4">No se encontraron productos</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid ${colsMap[cols]} gap-3`}
    >
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
