import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { categoryAPI } from "../api/category.api.js";
import { useFeaturedProducts } from "../hooks/useProducts.js";
import ProductCard from "../components/product/ProductCard.jsx";
import { SkeletonGrid } from "../components/ui/SkeletonCard.jsx";

// ── Animaciones reutilizables ─────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// ── Hero Banner ───────────────────────────────────────────
function HeroBanner() {
  const slides = [
    {
      bg: "from-red-500 to-orange-400",
      title: "¡Hasta 70% OFF!",
      sub: "En miles de productos seleccionados",
      btn: "Ver ofertas",
      link: "/products?sort=price_asc",
    },
    {
      bg: "from-purple-500 to-pink-500",
      title: "Nueva colección",
      sub: "Moda de temporada recién llegada",
      btn: "Ver ahora",
      link: "/products?sort=newest",
    },
    {
      bg: "from-blue-500 to-cyan-400",
      title: "Envío gratis",
      sub: "En pedidos mayores a S/ 150",
      btn: "Comprar",
      link: "/products",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4 mt-4 h-52 sm:h-72">
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${slides[0].bg} flex items-center`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="px-8 sm:px-12 text-white">
          <motion.p
            className="text-sm font-medium opacity-90 mb-1"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            ¡Oferta especial!
          </motion.p>
          <motion.h1
            className="text-3xl sm:text-5xl font-extrabold leading-tight"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {slides[0].title}
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base opacity-90 mt-1 mb-4"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {slides[0].sub}
          </motion.p>
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to={slides[0].link}
              className="inline-flex items-center gap-2 bg-white text-red-500 font-bold px-6 py-2.5 rounded-full hover:bg-red-50 transition text-sm"
            >
              {slides[0].btn} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Decoración */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20">
          <div className="absolute top-4 right-8 w-24 h-24 rounded-full border-4 border-white animate-pulse" />
          <div
            className="absolute bottom-4 right-24 w-16 h-16 rounded-full border-4 border-white animate-ping"
            style={{ animationDuration: "2s" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

// ── Flash Sale ────────────────────────────────────────────
function FlashSaleBanner() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mx-4 my-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-xl">
          <Zap size={24} className="text-white" />
        </div>
        <div className="text-white">
          <p className="font-extrabold text-lg leading-tight">FLASH SALE</p>
          <p className="text-xs opacity-90">Ofertas por tiempo limitado</p>
        </div>
      </div>
      <Link
        to="/products?sort=popular"
        className="bg-white text-orange-500 font-bold text-sm px-4 py-2 rounded-full hover:bg-orange-50 transition"
      >
        Ver todo
      </Link>
    </motion.div>
  );
}

// ── Categorías ────────────────────────────────────────────
const CATEGORY_COLORS = [
  "from-pink-400 to-red-400",
  "from-purple-400 to-indigo-400",
  "from-blue-400 to-cyan-400",
  "from-green-400 to-teal-400",
  "from-yellow-400 to-orange-400",
  "from-red-400 to-pink-400",
  "from-indigo-400 to-purple-400",
  "from-teal-400 to-green-400",
];

function CategoryGrid({ categories }) {
  return (
    <section className="px-4 my-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Categorías</h2>
        <Link
          to="/products"
          className="text-red-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          Ver todas <ArrowRight size={14} />
        </Link>
      </div>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-4 sm:grid-cols-8 gap-3"
      >
        {categories?.slice(0, 8).map((cat, i) => (
          <motion.div key={cat.id} variants={fadeUp}>
            <Link
              to={`/category/${cat.id}`}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                <span className="text-2xl">
                  {["👗", "👔", "📱", "🏠", "💄", "⚽", "🧸", "💍"][i] || "🛍️"}
                </span>
              </div>
              <p className="text-xs text-gray-600 text-center font-medium leading-tight line-clamp-2">
                {cat.nombre}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ── Sección de productos destacados ──────────────────────
function ProductSection({ title, products, link }) {
  return (
    <section className="px-4 my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <Link
          to={link}
          className="text-red-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          Ver más <ArrowRight size={14} />
        </Link>
      </div>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
      >
        {products?.slice(0, 10).map((product) => (
          <motion.div key={product.id} variants={fadeUp}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ── Promo banner ──────────────────────────────────────────
function PromoBanner() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mx-4 my-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <p className="text-xs font-medium opacity-80 mb-1">
          Colección exclusiva
        </p>
        <h3 className="text-xl font-extrabold mb-3">Moda de temporada</h3>
        <Link
          to="/category/1"
          className="bg-white text-indigo-600 font-bold text-sm px-4 py-2 rounded-full inline-block hover:bg-indigo-50 transition"
        >
          Explorar
        </Link>
      </div>
      <div className="bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl p-6 text-white">
        <p className="text-xs font-medium opacity-80 mb-1">Tech & Gadgets</p>
        <h3 className="text-xl font-extrabold mb-3">Electrónica top</h3>
        <Link
          to="/category/3"
          className="bg-white text-teal-600 font-bold text-sm px-4 py-2 rounded-full inline-block hover:bg-teal-50 transition"
        >
          Ver ahora
        </Link>
      </div>
    </motion.div>
  );
}

// ── HomePage principal ────────────────────────────────────
export default function HomePage() {
  const { data: featured, isLoading: loadingFeatured } = useFeaturedProducts();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryAPI.getAll,
    select: (res) => res.data,
  });

  return (
    <div className="pb-12">
      <HeroBanner />
      <FlashSaleBanner />
      <CategoryGrid categories={categories} />

      {/* Productos destacados */}
      <section className="px-4 my-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">⭐ Destacados</h2>
          <Link
            to="/products?sort=popular"
            className="text-red-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            Ver más <ArrowRight size={14} />
          </Link>
        </div>
        {loadingFeatured ? (
          <SkeletonGrid count={10} />
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
          >
            {featured?.slice(0, 10).map((product) => (
              <motion.div key={product.id} variants={fadeUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <PromoBanner />

      {/* Más vendidos */}
      <ProductSection
        title="🔥 Más vendidos"
        products={featured}
        link="/products?sort=popular&type=best"
      />
    </div>
  );
}
