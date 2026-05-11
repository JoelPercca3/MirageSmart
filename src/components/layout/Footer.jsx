import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div>
            <span className="text-2xl font-extrabold text-white">
              Mirage<span className="text-red-400">Mart</span>
            </span>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Tu tienda online favorita. Los mejores productos al mejor precio,
              directo a tu puerta.
            </p>
            <div className="flex gap-3 mt-4">
              {["FB", "IG", "YT"].map((red, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 bg-gray-800 hover:bg-red-500 rounded-lg transition text-xs font-bold"
                >
                  {red}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Comprar</h4>
            <div className="flex flex-col gap-2 text-sm">
              {[
                ["Todos los productos", "/products"],
                ["Ofertas del día", "/products?sort=popular"],
                ["Nuevos ingresos", "/products?sort=newest"],
                ["Más vendidos", "/products?sort=popular"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  to={href}
                  className="hover:text-red-400 transition"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Mi cuenta</h4>
            <div className="flex flex-col gap-2 text-sm">
              {[
                ["Mi perfil", "/profile"],
                ["Mis pedidos", "/orders"],
                ["Favoritos", "/wishlist"],
                ["Iniciar sesión", "/login"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  to={href}
                  className="hover:text-red-400 transition"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-red-400 flex-shrink-0" />
                <span>soporte@miragemart.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-red-400 flex-shrink-0" />
                <span>+51 999 999 999</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-red-400 flex-shrink-0" />
                <span>Lima, Perú</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} MirageMart. Todos los derechos reservados.
      </div>
    </footer>
  );
}
