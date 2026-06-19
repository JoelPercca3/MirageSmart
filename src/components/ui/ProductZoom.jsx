import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Utilidades ──────────────────────────────────────────────────────────────

const ZOOM_SCALE = 2;
const HOVER_DELAY_MS = 70;
const SWIPE_THRESHOLD = 50;

function isCached(src) {
  if (!src || typeof window === "undefined") return false;
  const img = new window.Image();
  img.src = src;
  return img.complete && img.naturalWidth > 0;
}

function resolveUrl(img) {
  if (!img) return null;
  return typeof img === "string" ? img : img?.url ?? null;
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

// ─── Hook: preload de imágenes con caché en ref ───────────────────────────────

function useImagePreloader(images, getImageUrl) {
  const [loadedKeys, setLoadedKeys] = useState({});
  const preloadedRef = useRef(new Set());
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Reset cuando cambia el set de imágenes (nueva variante)
  useEffect(() => {
    setLoadedKeys({});
    preloadedRef.current.clear();
  }, [images]);

  const markLoaded = useCallback((key) => {
    if (isMountedRef.current) {
      setLoadedKeys((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
    }
  }, []);

  const preload = useCallback(
    (index) => {
      if (!images?.[index]) return;
      const rawUrl = resolveUrl(images[index]);
      if (!rawUrl) return;

      // ✅ Carga "medium" primero (se ve rápido) y "xl" para zoom
      for (const size of ["medium", "xl"]) {
        const key = `${size}_${index}`;
        if (preloadedRef.current.has(key)) continue;
        preloadedRef.current.add(key);

        const url = getImageUrl(rawUrl, size);

        if (isCached(url)) {
          markLoaded(key);
          continue;
        }

        const el = new window.Image();
        el.onload = () => markLoaded(key);
        el.src = url;
      }
    },
    [images, getImageUrl, markLoaded],
  );

  const checkCached = useCallback(
    (index) => {
      if (!images?.[index]) return;
      const rawUrl = resolveUrl(images[index]);
      if (!rawUrl) return;
      // ✅ Verifica "medium" y "xl"
      for (const size of ["medium", "xl"]) {
        const key = `${size}_${index}`;
        if (!loadedKeys[key] && isCached(getImageUrl(rawUrl, size))) {
          markLoaded(key);
        }
      }
    },
    [images, getImageUrl, loadedKeys, markLoaded],
  );

  return { loadedKeys, preload, checkCached, markLoaded };
}

// ─── Hook: swipe touch ───────────────────────────────────────────────────────

function useSwipe(onSwipeLeft, onSwipeRight) {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        if (dx < 0) onSwipeLeft();
        else onSwipeRight();
      }
      touchStartX.current = null;
      touchStartY.current = null;
    },
    [onSwipeLeft, onSwipeRight],
  );

  return { onTouchStart, onTouchEnd };
}

// ─── Subcomponente: Thumbnail ─────────────────────────────────────────────────

const Thumbnail = memo(function Thumbnail({
  img,
  index,
  selected,
  getImageUrl,
  onHover,
  onLeave,
  onClick,
}) {
  const rawUrl = resolveUrl(img);
  return (
    <button
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
      onClick={() => onClick(index)}
      className={`
        flex-shrink-0 w-[60px] lg:w-[72px] relative overflow-hidden rounded-md
        border-2 transition-all duration-150 focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1
        ${selected
          ? "border-gray-900 shadow-md"
          : "border-gray-200 hover:border-gray-400"
        }
      `}
      style={{ aspectRatio: "3/4" }}
      aria-label={`Ver imagen ${index + 1}`}
      aria-pressed={selected}
    >
      <img
        src={getImageUrl(rawUrl, "thumb")}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      {selected && (
        <span className="absolute inset-0 ring-inset ring-2 ring-gray-900 rounded-md pointer-events-none" />
      )}
    </button>
  );
});

// ─── Subcomponente: NavButton ─────────────────────────────────────────────────

const NavButton = memo(function NavButton({
  direction,
  onClick,
  onMouseEnter,
  onMouseLeave,
  dark = false,
}) {
  const isLeft = direction === "left";
  const Icon = isLeft ? ChevronLeft : ChevronRight;
  const pos = isLeft ? "left-3" : "right-3";
  const label = isLeft ? "Imagen anterior" : "Imagen siguiente";

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        absolute ${pos} top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full
        transition-all duration-150 shadow-lg focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-white
        ${dark
          ? "bg-white/10 hover:bg-white/25 text-white"
          : "bg-white/90 hover:bg-white text-gray-800"
        }
      `}
      aria-label={label}
    >
      <Icon size={20} strokeWidth={2.5} />
    </button>
  );
});

// ─── Subcomponente: FullscreenModal ──────────────────────────────────────────
const FullscreenModal = memo(function FullscreenModal({
  images,
  selectedIndex,
  getImageUrl,
  productName,
  onClose,
  onGoTo,
}) {
  // ✅ Estado para controlar el zoom
  const [isZoomed, setIsZoomed] = useState(false);

  // ✅ Reset zoom al cambiar de imagen
  useEffect(() => {
    setIsZoomed(false);
  }, [selectedIndex]);

  const swipe = useSwipe(
    () => onGoTo(selectedIndex + 1),
    () => onGoTo(selectedIndex - 1),
  );

  const rawUrl = resolveUrl(images[selectedIndex]);

  // ✅ URL según estado
  const imageUrl = isZoomed
    ? getImageUrl(rawUrl, "xl")      // 1350×1800 (zoom)
    : getImageUrl(rawUrl, "large");  // 1000×1333 (normal)

  const showThumbs = images.length > 1 && images.length > 0;

  return createPortal(
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Galería de ${productName}`}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        {...swipe}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 p-2.5 rounded-full transition z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Cerrar galería"
        >
          <X size={20} />
        </button>

        {/* Flechas */}
        {images.length > 1 && (
          <>
            <NavButton
              direction="left"
              dark
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
                onGoTo(selectedIndex - 1);
              }}
            />
            <NavButton
              direction="right"
              dark
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
                onGoTo(selectedIndex + 1);
              }}
            />
          </>
        )}

        {/* ✅ Contenedor principal con flex row para miniaturas a la izquierda */}
        <div className="flex items-center justify-center w-full h-full gap-4 px-24">

          {/* ✅ Miniaturas a la IZQUIERDA */}
          {showThumbs && (
            <div
              className="flex flex-col gap-2.5 overflow-y-auto max-h-[80vh] py-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
              onClick={(e) => e.stopPropagation()}
              style={{
                minWidth: '70px',
                maxWidth: '90px',

              }}
            >
              {images.map((img, i) => {
                const url = resolveUrl(img);
                return (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsZoomed(false);
                      onGoTo(i);
                    }}
                    className={`
                      flex-shrink-0 w-full rounded-md overflow-hidden border-2 transition-all duration-150
                      ${i === selectedIndex
                        ? "border-white scale-105 shadow-lg"
                        : "border-white/25 hover:border-white/60 opacity-70 hover:opacity-100"
                      }
                    `}
                    style={{ aspectRatio: "3/4" }}
                    aria-label={`Ir a imagen ${i + 1}`}
                    aria-current={i === selectedIndex ? "true" : undefined}
                  >
                    <img
                      src={getImageUrl(url, "thumb")}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* ✅ Contenedor de la imagen con scroll */}
          <div
            className={`
              flex items-center justify-center flex-1 h-full
              ${isZoomed ? 'overflow-auto' : 'overflow-hidden'}
            `}
            style={{
              maxHeight: '100vh',
              padding: isZoomed ? '20px' : '0',
              // ✅ Estas 3 líneas ocultan el scrollbar pero mantienen la funcionalidad
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✅ Imagen con zoom adaptable */}
            <motion.img
              key={`fs-${selectedIndex}-${isZoomed}`}
              src={imageUrl}
              alt={`${productName} – ${selectedIndex + 1} de ${images.length}`}
              style={{
                display: 'block',
                WebkitUserSelect: 'none',
                margin: 'auto',
                cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                backgroundColor: 'hsl(0, 0%, 90%)',
                transition: 'background-color 300ms, width 300ms, height 300ms, max-width 300ms, max-height 300ms',
                objectFit: 'contain',
                flexShrink: 0,
                width: isZoomed ? 'auto' : 'auto',
                height: isZoomed ? 'auto' : 'auto',
                maxWidth: isZoomed ? '95vw' : '85vw',
                maxHeight: isZoomed ? 'none' : '90vh',
                minWidth: isZoomed ? '50vw' : 'auto',
                minHeight: isZoomed ? '50vh' : 'auto',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              draggable={false}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(prev => !prev);
              }}
            />
          </div>
        </div>



        {/* Contador */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
          {selectedIndex + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
});
// ─── Componente principal ─────────────────────────────────────────────────────

const ProductZoom = ({ images, getImageUrl, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [fullscreen, setFullscreen] = useState(false);

  const containerRef = useRef(null);
  const hoverTimerRef = useRef(null);
  const rafRef = useRef(null);

  const { loadedKeys, preload, checkCached, markLoaded } = useImagePreloader(
    images,
    getImageUrl,
  );

  // Reset al cambiar variante
  useEffect(() => {
    setSelectedIndex(0);
    setIsHovering(false);
    setZoomPos({ x: 50, y: 50 });
  }, [images]);

  // Lock body scroll en fullscreen
  useEffect(() => {
    if (fullscreen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [fullscreen]);

  // Precarga: imagen actual ± 1
  useEffect(() => {
    if (!images?.length) return;
    const indices = [selectedIndex - 1, selectedIndex, selectedIndex + 1]
      .filter((i) => i >= 0 && i < images.length);
    indices.forEach(preload);
  }, [selectedIndex, images, preload]);

  // Navegación con teclado
  const goTo = useCallback(
    (index) => {
      if (!images?.length) return;
      const next = ((index % images.length) + images.length) % images.length;
      if (next === selectedIndex) return;
      checkCached(next);
      setSelectedIndex(next);
      setZoomPos({ x: 50, y: 50 });
    },
    [images, selectedIndex, checkCached],
  );

  useEffect(() => {
    const handler = (e) => {
      if (!fullscreen) return;
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowLeft") goTo(selectedIndex - 1);
      if (e.key === "ArrowRight") goTo(selectedIndex + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen, selectedIndex, goTo]);

  // ✅ URLs correctas: medium para mostrar, xl para zoom
  const { mediumUrl, largeUrl } = useMemo(() => {
    if (!images?.length) return { mediumUrl: null, largeUrl: null };
    const rawUrl = resolveUrl(images[selectedIndex]);
    return {
      mediumUrl: getImageUrl(rawUrl, "medium"), // imagen principal visible
      largeUrl: getImageUrl(rawUrl, "xl"),     // capa de zoom alta resolución
    };
  }, [images, selectedIndex, getImageUrl]);

  // ✅ Keys correctas para medium y xl
  const isMediumLoaded = !!loadedKeys[`medium_${selectedIndex}`];
  const isLargeLoaded = !!loadedKeys[`xl_${selectedIndex}`];
  const zoomReady = isHovering && isMediumLoaded && isLargeLoaded;

  // Mouse move con rAF
  const handleMouseMove = useCallback(
    (e) => {
      if (!isHovering || !containerRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100);
        const y = clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100);
        setZoomPos({ x, y });
      });
    },
    [isHovering],
  );

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Cursor
  useEffect(() => {
    if (zoomReady) {
      document.body.style.cursor = "zoom-in";
    } else {
      document.body.style.cursor = "";
    }
    return () => {
      document.body.style.cursor = "";
    };
  }, [zoomReady]);

  // Thumbnail hover con debounce
  const handleThumbHover = useCallback(
    (index) => {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = setTimeout(() => goTo(index), HOVER_DELAY_MS);
    },
    [goTo],
  );

  const handleThumbLeave = useCallback(() => {
    clearTimeout(hoverTimerRef.current);
  }, []);

  useEffect(() => {
    return () => clearTimeout(hoverTimerRef.current);
  }, []);

  // Swipe en imagen principal
  const swipe = useSwipe(
    () => goTo(selectedIndex + 1),
    () => goTo(selectedIndex - 1),
  );

  // Zoom background style
  const zoomStyle = useMemo(
    () => ({
      backgroundImage: `url(${largeUrl})`,
      backgroundSize: `${ZOOM_SCALE * 100}%`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
      willChange: "background-position",
    }),
    [largeUrl, zoomPos],
  );

  // ── Fallback sin imágenes ──
  if (!images?.length) {
    return (
      <div
        className="relative w-full bg-gray-100 rounded-xl overflow-hidden"
        style={{ paddingBottom: "133.333%" }}
        role="img"
        aria-label="Sin imagen disponible"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 opacity-40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4-4 4 4 4-6 4 6M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
            />
          </svg>
          <span className="text-sm">Sin imagen</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Fullscreen Modal ── */}
      {fullscreen && (
        <FullscreenModal
          images={images}
          selectedIndex={selectedIndex}
          getImageUrl={getImageUrl}
          productName={productName}
          onClose={() => setFullscreen(false)}
          onGoTo={goTo}
        />
      )}

      {/* ── Galería principal ── */}
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 select-none">

        {/* Miniaturas */}
        {images.length > 1 && (
          <div
            className="flex flex-row lg:flex-col gap-2 lg:w-[72px] overflow-x-auto lg:overflow-y-auto lg:max-h-[560px] pb-1 lg:pb-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            role="tablist"
            aria-label="Imágenes del producto"
          >
            {images.map((img, i) => (
              <Thumbnail
                key={i}
                img={img}
                index={i}
                selected={i === selectedIndex}
                getImageUrl={getImageUrl}
                onHover={handleThumbHover}
                onLeave={handleThumbLeave}
                onClick={goTo}
              />
            ))}
          </div>
        )}

        {/* Imagen principal */}
        <div className="flex-1 flex flex-col min-w-0">
          <div
            ref={containerRef}
            role="img"
            aria-label={`${productName} – imagen ${selectedIndex + 1} de ${images.length}`}
            className={`
              relative w-full bg-white rounded-xl border border-gray-100
              overflow-hidden shadow-sm transition-shadow duration-200
              ${zoomReady ? "shadow-md" : ""}
                  cursor-crosshair  // ← Cursor de cruz (+)

            `}
            style={{ paddingBottom: "133.333%" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => setFullscreen(true)}
            {...swipe}
          >
            {/* Flechas navegación */}
            {images.length > 1 && (
              <>
                <NavButton
                  direction="left"
                  onMouseEnter={() => setIsHovering(false)}
                  onMouseLeave={() => setIsHovering(true)}
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(selectedIndex - 1);
                  }}
                />
                <NavButton
                  direction="right"
                  onMouseEnter={() => setIsHovering(false)}
                  onMouseLeave={() => setIsHovering(true)}
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(selectedIndex + 1);
                  }}
                />
              </>
            )}

            {/* Dots mobile */}
            {images.length > 1 && images.length <= 8 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 lg:hidden">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(i);
                    }}
                    className={`
                      rounded-full transition-all duration-200 focus-visible:outline-none
                      ${i === selectedIndex
                        ? "w-4 h-1.5 bg-gray-800"
                        : "w-1.5 h-1.5 bg-gray-400/70 hover:bg-gray-600"
                      }
                    `}
                    aria-label={`Ir a imagen ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Skeleton / spinner */}
            <AnimatePresence>
              {!isMediumLoaded && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-gray-50"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                >
                  <div className="w-8 h-8 border-[3px] border-gray-200 border-t-gray-400 rounded-full animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Imagen base */}
            <motion.img
              key={`main-${selectedIndex}-${mediumUrl}`}
              src={mediumUrl}
              alt={`${productName} – imagen ${selectedIndex + 1}`}
              className="absolute inset-0 w-full h-full object-contain"
              style={{ opacity: isMediumLoaded ? 1 : 0, transition: "opacity 0.25s" }}
              onLoad={() => markLoaded(`medium_${selectedIndex}`)}
              onError={() => {
                if (largeUrl && largeUrl !== mediumUrl) {
                  markLoaded(`medium_${selectedIndex}`);
                }
              }}
              draggable={false}
              initial={false}
              animate={{ opacity: isMediumLoaded ? 1 : 0 }}
              transition={{ duration: 0.25 }}
            />

            {/* Capa de zoom (solo desktop hover) */}
            {zoomReady && (
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={zoomStyle}
              />
            )}

            {/* Badge "cargando zoom" */}
            <AnimatePresence>
              {isHovering && isMediumLoaded && !isLargeLoaded && (
                <motion.div
                  className="absolute bottom-3 left-3 z-20 bg-black/50 text-white text-[10px] px-2.5 py-1 rounded-full pointer-events-none backdrop-blur-sm"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  aria-live="polite"
                >
                  Cargando zoom…
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hint texto */}

        </div>
      </div>
    </>
  );
};

export default memo(ProductZoom);