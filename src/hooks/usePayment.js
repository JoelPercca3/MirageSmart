import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { paymentAPI } from "../api/payment.api.js";
import useAuthStore from "../store/useAuthStore.js";

const CULQI_PUBLIC_KEY = "pk_test_GaUvfZ7kWlZpZdKR";

export const useCulqiPayment = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const chargeMutation = useMutation({
    mutationFn: paymentAPI.createCharge,
    onSuccess: (res) => {
      toast.success("¡Pago exitoso! 🎉");
      navigate(`/order-success/${res.data.order_id}`);
    },
    onError: (err) => {
      toast.error(err.message || "Error al procesar el pago");
      setLoading(false);
    },
  });

  const openCulqi = (order) => {
    if (!window.Culqi) {
      toast.error("Error al cargar Culqi. Recarga la página.");
      return;
    }

    setLoading(true);

    // Configurar llave pública
    window.Culqi.publicKey = CULQI_PUBLIC_KEY;

    // Configurar settings SIN el campo order
    window.Culqi.settings({
      title: "MirageMart",
      currency: "PEN",
      amount: Math.round(Number(order.total) * 100),
    });

    // Configurar opciones adicionales
    window.Culqi.options({
      lang: "auto",
      installments: false,
      modal: true,
      container: null,
      paymentMethods: {
        tarjeta: true,
        yape: false,
        billetera: false,
        bancaMovil: false,
        agente: false,
        cuotealo: false,
      },
      style: {
        logo: "https://res.cloudinary.com/diotg5xa0/image/upload/v1/miragemart/logo.png",
        bannerColor: "#ef4444",
        buttonBackground: "#ef4444",
        menuColor: "#ef4444",
        linksColor: "#ef4444",
        priceColor: "#ef4444",
      },
    });

    // Callback cuando Culqi retorna el token
    window.culqi = () => {
      if (window.Culqi.token) {
        const token = window.Culqi.token;
        window.Culqi.close();

        chargeMutation.mutate({
          order_id: order.id,
          token_id: token.id,
          email: user?.email || token.email,
        });
      } else if (window.Culqi.error) {
        const errMsg =
          window.Culqi.error.merchant_message ||
          window.Culqi.error.user_message ||
          "Error en el pago";
        toast.error(errMsg);
        setLoading(false);
      }
    };

    window.Culqi.open();
  };

  return { openCulqi, loading: loading || chargeMutation.isPending };
};
