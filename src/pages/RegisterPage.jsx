import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { useRegister } from "../hooks/useAuth.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

const schema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
    .regex(/[0-9]/, "Debe tener al menos un número"),
  telefono: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los Términos y Condiciones",
  }),
});

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const onSubmit = (data) => {
    // Eliminamos acceptTerms del envío al backend
    const { acceptTerms, ...userData } = data;
    registerMutation.mutate(userData);
  };

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
          <p className="text-gray-500 mt-2 text-sm">Crea tu cuenta gratis</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input
              label="Nombre completo"
              type="text"
              placeholder="Tu nombre"
              error={errors.nombre?.message}
              {...register("nombre")}
            />

            <Input
              label="Email"
              type="email"
              placeholder="tucorreo@email.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Teléfono (opcional)"
              type="tel"
              placeholder="+51 999 999 999"
              error={errors.telefono?.message}
              {...register("telefono")}
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPass ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
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

            {/* Requisitos de contraseña */}
            <ul className="text-xs text-gray-400 space-y-1 -mt-2">
              <li>• Mínimo 8 caracteres</li>
              <li>• Al menos una mayúscula</li>
              <li>• Al menos un número</li>
            </ul>

            {/* ✅ CHECKBOX DE TÉRMINOS - AGREGAR AQUÍ */}
            <div className="mt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                  {...register("acceptTerms")}
                />
                <span className="text-xs text-gray-600">
                  Acepto los{" "}
                  <Link to="/terminos" className="text-red-500 hover:underline">
                    Términos y Condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link
                    to="/privacidad"
                    className="text-red-500 hover:underline"
                  >
                    Política de Privacidad
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              loading={registerMutation.isPending}
            >
              Crear cuenta
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">¿Ya tienes cuenta?</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <Link to="/login">
            <Button variant="outline" size="lg" className="w-full">
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
