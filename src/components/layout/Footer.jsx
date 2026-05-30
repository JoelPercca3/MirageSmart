import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight, Heart } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="text-white text-center sm:text-left">
              <h3 className="text-xl font-extrabold">📧 Suscríbete y ahorra</h3>
              <p className="text-sm opacity-90 mt-1">
                Recibe ofertas exclusivas y novedades antes que nadie
              </p>
            </div>
            <form
              className="flex gap-2 w-full sm:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="tucorreo@email.com"
                className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl text-gray-800 text-sm outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="bg-white text-red-500 font-bold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition flex items-center gap-1.5 whitespace-nowrap"
              >
                Suscribirse <ArrowRight size={14} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/">
              <span className="text-2xl font-extrabold">
                <span className="text-red-400">Mirage</span>
                <span className="text-white">Mart</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Tu tienda online favorita. Los mejores productos al mejor precio,
              directo a tu puerta.
            </p>
            <div className="flex gap-3 mt-4">
              {["FB", "IG", "TK", "YT"].map((red) => (
                <motion.a
                  key={red}
                  href="#"
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-9 h-9 bg-gray-800 hover:bg-red-500 rounded-xl flex items-center justify-center text-xs font-bold transition-colors"
                >
                  {red}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Comprar */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Comprar
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                ["Todos los productos", "/products"],
                ["Ofertas del día", "/products?sort=popular"],
                ["Nuevos ingresos", "/products?sort=newest"],
                ["Más vendidos", "/products?sort=popular"],
                ["Categorías", "/products"],
              ].map(([label, href], i) => (
                <Link
                  key={i}
                  to={href}
                  className="text-sm text-gray-400 hover:text-red-400 transition flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 bg-gray-600 group-hover:bg-red-400 rounded-full transition" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mi cuenta */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Mi cuenta
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                ["Mi perfil", "/profile"],
                ["Mis pedidos", "/orders"],
                ["Favoritos", "/wishlist"],
                ["Iniciar sesión", "/login"],
                ["Crear cuenta", "/register"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  to={href}
                  className="text-sm text-gray-400 hover:text-red-400 transition flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 bg-gray-600 group-hover:bg-red-400 rounded-full transition" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Contacto
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { icon: Mail, text: "soporte@miragemart.com" },
                { icon: Phone, text: "+51 999 999 999" },
                { icon: MapPin, text: "Lima, Perú" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2.5 text-sm text-gray-400"
                >
                  <div className="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-red-400" />
                  </div>
                  {text}
                </div>
              ))}
            </div>

            {/* Métodos de pago */}
            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-medium">
                Pagos seguros
              </p>
              <div className="flex gap-2 flex-wrap">
                {["VISA", "MC", "AMEX", "YAPE"].map((p) => (
                  <span
                    key={p}
                    className="bg-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded-lg font-bold"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom */}
      <div className="border-t border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            © {new Date().getFullYear()} MirageMart. Hecho con
            <Heart size={12} className="text-red-500 fill-red-500 mx-0.5" />
            en Perú
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/terminos"
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              Términos y Condiciones
            </Link>
            <Link
              to="/privacidad"
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              Política de Privacidad
            </Link>
            <Link
              to="/cookies"
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              Política de Cookies
            </Link>
            <Link
              to="/reembolsos"
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              Cambios y Devoluciones
            </Link>
            <Link
              to="/libro-reclamaciones"
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              Libro de Reclamaciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
