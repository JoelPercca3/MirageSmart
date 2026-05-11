import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button.jsx";

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <p className="text-8xl font-extrabold text-red-500">404</p>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          Página no encontrada
        </h1>
        <p className="text-gray-500 mt-2 mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link to="/">
          <Button size="lg">Volver al inicio</Button>
        </Link>
      </motion.div>
    </div>
  );
}
