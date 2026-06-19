import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { categoryAPI } from "../api/category.api.js";
import { useFeaturedProducts } from "../hooks/useProducts.js";
import ProductCard from "../components/product/ProductCard.jsx";
import { SkeletonGrid } from "../components/ui/SkeletonCard.jsx";

// ── Animaciones ───────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// ── Hero Banner con imágenes ───────────────────────────────────
const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200", // Moda
    tag: "🔥 Oferta especial",
    title: "¡Hasta 70% OFF!",
    sub: "En miles de productos seleccionados",
    btn: "Ver ofertas",
    link: "/products?sort=price_asc",
    overlay: "from-black/70 to-black/30",
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200", // Moda mujer
    tag: "✨ Nueva colección",
    title: "Moda de temporada",
    sub: "Recién llegada — Sé el primero en lucirla",
    btn: "Ver ahora",
    link: "/products?sort=newest",
    overlay: "from-black/70 to-black/30",
  },
  {
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200", // Tecnología
    tag: "🚚 Envío gratis",
    title: "En pedidos +S/ 150",
    sub: "Rápido, seguro y directo a tu puerta",
    btn: "Comprar",
    link: "/products",
    overlay: "from-black/60 to-black/20",
  },
  {
    image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Electrónica
    tag: "⚡ Tech & Gadgets",
    title: "Electrónica top",
    sub: "Los mejores gadgets al mejor precio",
    btn: "Explorar",
    link: "/category/3",
    overlay: "from-black/70 to-black/30",
  },
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const slide = SLIDES[current];

  return (
    <div
      className="relative overflow-hidden h-72 sm:h-96 md:h-[520px]"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <motion.div
        key={current}
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }}
        />

        {/* Overlay oscuro para legibilidad */}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />

        {/* Contenido */}
        <div className="relative h-full flex items-center">
          <div className="px-8 sm:px-14 text-white flex-1 max-w-2xl">
            <motion.p
              className="text-xs sm:text-sm font-semibold mb-1 text-yellow-300"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {slide.tag}
            </motion.p>
            <motion.h1
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {slide.title}
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl opacity-90 mb-5"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {slide.sub}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to={slide.link}
                className="inline-flex items-center gap-2 bg-white text-gray-800 font-bold px-8 py-3.5 rounded-full hover:bg-opacity-90 hover:scale-105 transition-all text-base shadow-lg"
              >
                {slide.btn} <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Flechas de navegación */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition text-white z-10"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition text-white z-10"
      >
        <ChevronRight size={22} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? "w-8 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
// ── Flash Sale con contador regresivo ─────────────────────
function FlashSale({ products }) {
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 59, s: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="my-5"
    >
      <div className="bg-gradient-to-r from-black to-gray-800 rounded-none p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Zap size={22} className="text-white" />
            </div>
            <div className="text-white">
              <p className="font-extrabold text-lg leading-tight">
                ⚡ FLASH SALE
              </p>
              <p className="text-xs opacity-80">Ofertas por tiempo limitado</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Clock size={14} className="text-white/80" />
            {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((t, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="bg-white/20 text-white font-mono font-bold text-sm px-2 py-1 rounded-lg min-w-[32px] text-center">
                  {t}
                </span>
                {i < 2 && <span className="text-white font-bold">:</span>}
              </span>
            ))}
          </div>
        </div>

        {products?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {products.slice(0, 4).map((product, idx) => (
              <ProductCard key={`flash-${product.id}-${idx}`} product={product} />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

// ── Sección de productos con scroll horizontal ────────────
function ProductScrollSection({ title, products, link, isLoading }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
    }
  };

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            className="p-1.5 bg-gray-100 hover:bg-red-100 hover:text-red-500 rounded-lg transition"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="p-1.5 bg-gray-100 hover:bg-red-100 hover:text-red-500 rounded-lg transition"
          >
            <ChevronRight size={16} />
          </button>
          <Link
            to={link}
            className="text-red-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all ml-1"
          >
            Ver más <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid count={5} />
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar pb-2"
        >
          {products?.slice(0, 12).map((product, i) => (
            <motion.div
              key={`scroll-${product.id}-${i}`}
              className="flex-shrink-0 w-44 sm:w-52"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Grid de productos con animación al entrar ─────────────
function ProductGridSection({ title, products, link, isLoading }) {
  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <Link
          to={link}
          className="text-red-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          Ver más <ArrowRight size={14} />
        </Link>
      </div>
      {isLoading ? (
        <SkeletonGrid count={10} />
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4"
        >
          {products?.slice(0, 10).map((product, idx) => (
            <motion.div key={`grid-${product.id}-${idx}`} variants={fadeUp}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

// ── Banners promocionales ─────────────────────────────────
function PromoBanners() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {[
        {
          bg: "from-indigo-500 to-purple-600",
          emoji: "👗",
          tag: "Colección exclusiva",
          title: "Moda de temporada",
          link: "/category/1",
          btnColor: "text-indigo-600",
        },
        {
          bg: "from-teal-500 to-green-500",
          emoji: "📱",
          tag: "Tech & Gadgets",
          title: "Electrónica top",
          link: "/category/3",
          btnColor: "text-teal-600",
        },
        {
          bg: "from-orange-400 to-red-500",
          emoji: "⚡",
          tag: "Flash deals",
          title: "¡Solo por hoy!",
          link: "/products?sort=popular",
          btnColor: "text-orange-600",
        },
      ].map(({ bg, emoji, tag, title, link, btnColor }, idx) => (
        <motion.div
          key={`banner-${idx}`}
          whileHover={{ scale: 1.02, y: -4 }}
          className={`bg-gradient-to-r ${bg} rounded-2xl p-5 text-white relative overflow-hidden`}
        >
          <p className="text-xs font-medium opacity-80 mb-1">{tag}</p>
          <h3 className="text-xl font-extrabold mb-3">{title}</h3>
          <Link
            to={link}
            className={`bg-white font-bold text-sm px-4 py-2 rounded-full inline-flex items-center gap-1 hover:scale-105 transition-transform ${btnColor}`}
          >
            Ver ahora <ArrowRight size={13} />
          </Link>
          <span className="absolute right-4 bottom-2 text-6xl opacity-20">
            {emoji}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Stats de confianza ────────────────────────────────────
function TrustStats() {
  const stats = [
    { icon: "🚀", value: "+10,000", label: "Productos" },
    { icon: "😊", value: "+5,000", label: "Clientes felices" },
    { icon: "⭐", value: "4.8/5", label: "Calificación" },
    { icon: "🚚", value: "24-48h", label: "Entrega rápida" },
  ];

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="my-8 bg-white rounded-2xl border border-gray-100 p-6"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map(({ icon, value, label }, i) => (
          <motion.div
            key={`stat-${label}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <span className="text-3xl block mb-2">{icon}</span>
            <p className="text-xl font-extrabold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ── HomePage principal ────────────────────────────────────
export default function HomePage() {
  const { data: featured, isLoading } = useFeaturedProducts();

  // 🔥 Eliminar productos duplicados del array
  const uniqueProducts = featured?.filter((product, index, self) =>
    index === self.findIndex((p) => p.id === product.id)
  ) || [];

  return (
    <div className="bg-gray-50 pt-4">
      <HeroBanner />

      <div className="max-w-[1450px] mx-auto px-3 sm:px-4 lg:px-5 pb-16">
        <FlashSale products={uniqueProducts} />

        <ProductScrollSection
          title="⭐ Productos destacados"
          products={uniqueProducts}
          link="/products?sort=popular"
          isLoading={isLoading}
        />

        <PromoBanners />

        <ProductGridSection
          title="🆕 Nuevos ingresos"
          products={uniqueProducts}
          link="/products?sort=newest"
          isLoading={isLoading}
        />

        <TrustStats />

        <ProductScrollSection
          title="🔥 Más vendidos"
          products={uniqueProducts}
          link="/products?sort=popular"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}