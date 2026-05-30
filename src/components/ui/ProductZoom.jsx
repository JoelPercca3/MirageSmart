import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

function isCached(src) {
  if (!src || typeof window === "undefined") return false;
  const img = new window.Image();
  img.src = src;
  return img.complete && img.naturalWidth > 0;
}

const ZOOM_SCALE = 2.5;

const ProductZoom = ({ images, getImageUrl, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [fullscreen, setFullscreen] = useState(false);
  const [imgStatus, setImgStatus] = useState({});

  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const preloadedRef = useRef(new Set());
  const hoverTimeoutRef = useRef(null);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  const preloadImage = useCallback(
    (index) => {
      if (!images?.[index]) return;
      const key = `${index}`;
      if (preloadedRef.current.has(key)) return;
      preloadedRef.current.add(key);

      const img = images[index];

      const medUrl = getImageUrl(img.url, "medium");
      const medEl = new window.Image();
      medEl.onload = () =>
        setImgStatus((s) => ({ ...s, [`medium_${index}`]: "loaded" }));
      medEl.src = medUrl;

      const lgUrl = getImageUrl(img.url, "large");
      const lgEl = new window.Image();
      lgEl.onload = () =>
        setImgStatus((s) => ({ ...s, [`large_${index}`]: "loaded" }));
      lgEl.onerror = () =>
        setImgStatus((s) => ({ ...s, [`large_${index}`]: "error" }));
      lgEl.src = lgUrl;

      const thUrl = getImageUrl(img.url, "thumb");
      const thEl = new window.Image();
      thEl.src = thUrl;
    },
    [images, getImageUrl],
  );

  // Precarga imagen actual + adyacentes
  useEffect(() => {
    if (!images?.length) return;
    [selectedIndex - 1, selectedIndex, selectedIndex + 1].forEach((i) => {
      const idx = (i + images.length) % images.length;
      preloadImage(idx);
    });
  }, [selectedIndex, images, preloadImage]);

  const mediumUrl = getImageUrl(images[selectedIndex]?.url, "medium");
  const largeUrl = getImageUrl(images[selectedIndex]?.url, "large");

  useEffect(() => {
    const key = `medium_${selectedIndex}`;
    if (imgStatus[key] === "loaded") return;
    if (isCached(mediumUrl)) {
      setImgStatus((s) => ({ ...s, [key]: "loaded" }));
    } else {
      setImgStatus((s) => ({ ...s, [key]: "loading" }));
    }
  }, [selectedIndex, mediumUrl, imgStatus]);

  const isMediumLoaded = imgStatus[`medium_${selectedIndex}`] === "loaded";
  const isLargeLoaded = imgStatus[`large_${selectedIndex}`] === "loaded";

  const goTo = useCallback(
    (index) => {
      const next = (index + images.length) % images.length;

      const lgUrl = getImageUrl(images[next]?.url, "large");
      if (isCached(lgUrl)) {
        setImgStatus((s) => ({ ...s, [`large_${next}`]: "loaded" }));
      }
      const medUrl = getImageUrl(images[next]?.url, "medium");
      if (isCached(medUrl)) {
        setImgStatus((s) => ({ ...s, [`medium_${next}`]: "loaded" }));
      }

      setSelectedIndex(next);
      setZoomPos({ x: 50, y: 50 });
    },
    [images, getImageUrl],
  );

  // Teclado en fullscreen
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

  // Zoom tracking
  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current || !isZooming) return;
      const rect = containerRef.current.getBoundingClientRect();
      let x = ((e.clientX - rect.left) / rect.width) * 100;
      let y = ((e.clientY - rect.top) / rect.height) * 100;
      x = Math.min(Math.max(x, 0), 100);
      y = Math.min(Math.max(y, 0), 100);
      setZoomPos({ x, y });
    },
    [isZooming],
  );

  const handleMouseDown = useCallback(() => {
    if (isMediumLoaded && isLargeLoaded) setIsDragging(true);
  }, [isMediumLoaded, isLargeLoaded]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = "grabbing";
    } else if (isZooming && isMediumLoaded && isLargeLoaded) {
      document.body.style.cursor = "grab";
    } else {
      document.body.style.cursor = "";
    }
    return () => {
      document.body.style.cursor = "";
    };
  }, [isDragging, isZooming, isMediumLoaded, isLargeLoaded]);

  const handleMediumLoad = useCallback(() => {
    setImgStatus((s) => ({ ...s, [`medium_${selectedIndex}`]: "loaded" }));
  }, [selectedIndex]);

  const handleMediumError = useCallback(() => {
    setImgStatus((s) => ({ ...s, [`medium_${selectedIndex}`]: "error" }));
  }, [selectedIndex]);

  useEffect(() => {
    return () => clearTimeout(hoverTimeoutRef.current);
  }, []);

  return (
    <>
      {/* MODAL FULLSCREEN usando Portal */}
      {fullscreen &&
        createPortal(
          <motion.div
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreen(false)}
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/25 p-3 rounded-full transition z-50"
              aria-label="Cerrar"
            >
              <X size={22} />
            </button>

            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(selectedIndex - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white p-4 rounded-full transition"
                aria-label="Anterior"
              >
                <ChevronLeft size={26} />
              </button>
            )}

            <motion.img
              key={`fs-${selectedIndex}`}
              src={largeUrl}
              alt={`${productName} – imagen ${selectedIndex + 1}`}
              className="max-w-[92vw] max-h-[88vh] object-contain"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.18 }}
              draggable={false}
            />

            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(selectedIndex + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white p-4 rounded-full transition"
                aria-label="Siguiente"
              >
                <ChevronRight size={26} />
              </button>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {selectedIndex + 1} / {images.length}
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(i);
                    }}
                    className={`w-12 h-12 rounded overflow-hidden border-2 transition ${
                      i === selectedIndex
                        ? "border-white"
                        : "border-white/30 hover:border-white/60"
                    }`}
                  >
                    <img
                      src={getImageUrl(img.url, "thumb")}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>,
          document.body,
        )}

      {/* GALERÍA PRINCIPAL */}
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-5 select-none">
        {/* MINIATURAS */}
        {images.length > 1 && (
          <div className="flex flex-row lg:flex-col gap-2 lg:w-[72px] overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {images.map((img, i) => (
              <button
                key={i}
                onMouseEnter={() => {
                  clearTimeout(hoverTimeoutRef.current);
                  hoverTimeoutRef.current = setTimeout(() => goTo(i), 80);
                }}
                onMouseLeave={() => {
                  clearTimeout(hoverTimeoutRef.current);
                }}
                onClick={() => goTo(i)}
                className={`
                  flex-shrink-0 w-[60px] lg:w-[72px] relative overflow-hidden rounded border-2 transition-all duration-150
                  ${
                    i === selectedIndex
                      ? "border-gray-900 shadow-sm"
                      : "border-gray-200 hover:border-gray-400"
                  }
                `}
                style={{ aspectRatio: "3/4" }}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <img
                  src={getImageUrl(img.url, "thumb")}
                  alt={`Miniatura ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        )}

        {/* IMAGEN PRINCIPAL */}
        <div className="flex-1 flex flex-col">
          <div
            ref={containerRef}
            className={`
              relative w-full bg-white rounded-lg border border-gray-100 overflow-hidden
              ${isMediumLoaded && isLargeLoaded ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
            `}
            style={{ paddingBottom: "133.333%" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => {
              setIsZooming(false);
              setIsDragging(false);
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={() => setFullscreen(true)}
          >
            {/* Flechas */}
            {images.length > 1 && (
              <button
                onMouseEnter={() => setIsZooming(false)}
                onMouseLeave={() => setIsZooming(true)}
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(selectedIndex - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition"
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            {images.length > 1 && (
              <button
                onMouseEnter={() => setIsZooming(false)}
                onMouseLeave={() => setIsZooming(true)}
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(selectedIndex + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition"
                aria-label="Imagen siguiente"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Botón ampliar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFullscreen(true);
              }}
              className="absolute bottom-3 right-3 z-20 p-2 bg-black/40 hover:bg-black/65 rounded-full transition shadow-lg"
              aria-label="Ampliar imagen"
            >
              <ZoomIn size={17} className="text-white" />
            </button>

            {/* Skeleton */}
            <AnimatePresence>
              {!isMediumLoaded && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-gray-50"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-9 h-9 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Imagen base */}
            <img
              ref={imgRef}
              key={`main-${selectedIndex}`}
              src={largeUrl}
              alt={productName}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                isMediumLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={handleMediumLoad}
              onError={handleMediumError}
              draggable={false}
            />

            {/* Capa de zoom */}
            {isZooming && isMediumLoaded && isLargeLoaded && (
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  backgroundImage: `url(${largeUrl})`,
                  backgroundSize: `${ZOOM_SCALE * 100}%`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
              />
            )}

            {/* Indicador zoom cargando */}
            {isZooming && isMediumLoaded && !isLargeLoaded && (
              <div className="absolute bottom-3 left-3 z-20 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full pointer-events-none backdrop-blur-sm">
                Cargando zoom…
              </div>
            )}
          </div>

          <p className="text-center text-[11px] text-gray-400 mt-2 leading-relaxed">
            Pasa el cursor para ampliar · Clic para pantalla completa
          </p>
        </div>
      </div>
    </>
  );
};

export default ProductZoom;
