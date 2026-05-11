import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useForgotPassword } from "../hooks/useAuth.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

const schema = z.object({
  email: z.string().email("Email inválido"),
});

export default function ForgotPasswordPage() {
  const forgot = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => forgot.mutate(data.email);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <ShoppingBag size={32} className="text-red-500" />
            <span className="text-3xl font-extrabold">
              Mirage<span className="text-red-500">Mart</span>
            </span>
          </Link>
          <p className="text-gray-500 mt-2 text-sm">
            Recupera el acceso a tu cuenta
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {forgot.isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📧</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                ¡Email enviado!
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Si el email existe, recibirás un enlace para restablecer tu
                contraseña.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Volver al login
                </Button>
              </Link>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <p className="text-sm text-gray-600">
                Ingresa tu email y te enviaremos un enlace para restablecer tu
                contraseña.
              </p>

              <Input
                label="Email"
                type="email"
                placeholder="tucorreo@email.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={forgot.isPending}
              >
                Enviar enlace
              </Button>
            </form>
          )}
        </div>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} /> Volver al login
        </Link>
      </motion.div>
    </div>
  );
}
