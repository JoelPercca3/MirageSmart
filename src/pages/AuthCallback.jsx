import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "../components/ui/Spinner.jsx";
import useAuthStore from "../store/useAuthStore.js";
import useCartStore from "../store/useCartStore.js";
import api from "../api/axios.js";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  const { setAuth } = useAuthStore();

  const { loadCartFromLocal, clearLocalCart, setCart } = useCartStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const error = params.get("error");

    if (hasRedirected.current) return;

    if (error) {
      hasRedirected.current = true;
      navigate("/login?error=google_auth_failed", {
        replace: true,
      });
      return;
    }

    if (accessToken && refreshToken) {
      hasRedirected.current = true;

      const processAuth = async () => {
        try {
          // 1. Configurar token
          api.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;

          // 2. Obtener usuario
          const userResponse = await api.get("/auth/me");

          if (!userResponse.data) {
            throw new Error("No se pudo obtener el usuario");
          }

          const userData = userResponse.data;

          console.log("✅ Usuario obtenido:", userData);

          // 3. Guardar auth
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("user", JSON.stringify(userData));

          setAuth(userData, {
            accessToken,
            refreshToken,
          });

          // 4. Esperar actualización del store
          await new Promise((resolve) => setTimeout(resolve, 100));

          // 5. Obtener carrito local
          const localCart = localStorage.getItem("guestCart");

          console.log("📦 Carrito local encontrado:", localCart);

          if (localCart) {
            try {
              const cartData = JSON.parse(localCart);

              const localCartItems = cartData.items || [];

              // ✅ Fusionar carrito
              if (localCartItems.length > 0) {
                console.log("🔄 Fusionando items:", localCartItems);

                await api.post("/cart/merge", {
                  items: localCartItems,
                });

                console.log("✅ Carrito fusionado");

                // ✅ Limpiar localStorage
                clearLocalCart();

                // ✅ Limpiar store local
                setCart({
                  items: [],
                  subtotal: 0,
                  total_items: 0,
                });
              }
            } catch (mergeErr) {
              console.error("❌ Error al fusionar:", mergeErr);
            }
          }

          // 6. Cargar carrito REAL del backend
          try {
            const cartResponse = await api.get("/cart");

            if (cartResponse.data) {
              setCart(cartResponse.data);

              console.log("✅ Carrito final cargado:", cartResponse.data);
            }
          } catch (cartErr) {
            console.error("❌ Error al cargar carrito final:", cartErr);
          }

          // 7. Redireccionar
          navigate("/", {
            replace: true,
          });
        } catch (err) {
          console.error("❌ Error en auth callback:", err);

          navigate("/login", {
            replace: true,
          });
        }
      };

      processAuth();
    } else {
      hasRedirected.current = true;

      navigate("/login", {
        replace: true,
      });
    }
  }, [location, navigate, setAuth, loadCartFromLocal, clearLocalCart, setCart]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
