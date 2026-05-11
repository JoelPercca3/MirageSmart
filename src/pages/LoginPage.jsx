import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { useLogin } from "../hooks/useAuth.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => login.mutate(data);

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
            Inicia sesión en tu cuenta
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <Input
              label="Email"
              type="email"
              placeholder="tucorreo@email.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPass ? "text" : "password"}
                placeholder="Tu contraseña"
                error={errors.password?.message}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-red-500 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={login.isPending}
            >
              Iniciar sesión
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">¿No tienes cuenta?</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <Link to="/register">
            <Button variant="outline" size="lg" className="w-full">
              Crear cuenta gratis
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Al iniciar sesión aceptas nuestros{" "}
          <a href="#" className="underline hover:text-gray-600">
            Términos y condiciones
          </a>
        </p>
      </motion.div>
    </div>
  );
}
