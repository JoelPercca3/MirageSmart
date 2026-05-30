import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";
import { userAPI } from "../../api/user.api.js";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import toast from "react-hot-toast";
import {
  getDepartamentos,
  getProvincias,
  getDistritos,
} from "../../data/ubicaciones.js";

export default function AddressModal({ isOpen, onClose, onAddressAdded }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre_destinatario: "",
    telefono_contacto: "",
    departamento: "",
    provincia: "",
    distrito: "",
    calle: "",
    referencia: "",
    codigo_postal: "",
    es_predeterminada: false,
  });

  const [departamentosList, setDepartamentosList] = useState([]);
  const [provinciasList, setProvinciasList] = useState([]);
  const [distritosList, setDistritosList] = useState([]);

  // Cargar departamentos
  useEffect(() => {
    if (isOpen) {
      const deps = getDepartamentos();
      setDepartamentosList(deps);
    }
  }, [isOpen]);

  // Actualizar provincias cuando cambia departamento
  useEffect(() => {
    if (formData.departamento) {
      const provs = getProvincias(formData.departamento);
      setProvinciasList(provs);
      setFormData((prev) => ({ ...prev, provincia: "", distrito: "" }));
      setDistritosList([]);
    }
  }, [formData.departamento]);

  // Actualizar distritos cuando cambia provincia
  useEffect(() => {
    if (formData.departamento && formData.provincia) {
      const dists = getDistritos(formData.departamento, formData.provincia);
      setDistritosList(dists);
      setFormData((prev) => ({ ...prev, distrito: "" }));
    }
  }, [formData.provincia, formData.departamento]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre_destinatario.trim()) {
      toast.error("Ingresa el nombre del destinatario");
      return;
    }
    if (!formData.telefono_contacto.trim()) {
      toast.error("Ingresa un teléfono de contacto");
      return;
    }
    if (!formData.departamento) {
      toast.error("Selecciona un departamento");
      return;
    }
    if (!formData.provincia) {
      toast.error("Selecciona una provincia");
      return;
    }
    if (!formData.distrito) {
      toast.error("Selecciona un distrito");
      return;
    }
    if (!formData.calle.trim()) {
      toast.error("Ingresa la dirección completa");
      return;
    }

    setLoading(true);
    try {
      const addressData = {
        nombre_destinatario: formData.nombre_destinatario,
        telefono_contacto: formData.telefono_contacto,
        departamento: formData.departamento,
        provincia: formData.provincia,
        distrito: formData.distrito,
        calle: formData.calle,
        referencia: formData.referencia || null,
        codigo_postal: formData.codigo_postal || null,
        es_predeterminada: formData.es_predeterminada ? 1 : 0,
        pais: "Perú",
      };

      await userAPI.createAddress(addressData);
      toast.success("Dirección agregada correctamente");
      onAddressAdded();
      onClose();
      resetForm();
    } catch (error) {
      toast.error(error.message || "Error al agregar dirección");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre_destinatario: "",
      telefono_contacto: "",
      departamento: "",
      provincia: "",
      distrito: "",
      calle: "",
      referencia: "",
      codigo_postal: "",
      es_predeterminada: false,
    });
    setProvinciasList([]);
    setDistritosList([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-red-500" />
                <h2 className="text-lg font-bold text-gray-800">
                  Agregar dirección
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre_destinatario"
                    value={formData.nombre_destinatario}
                    onChange={handleChange}
                    placeholder="Ej: Joel Pérez"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-red-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telefono_contacto"
                    value={formData.telefono_contacto}
                    onChange={handleChange}
                    placeholder="Ej: 999 999 999"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-red-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Departamento */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Departamento <span className="text-red-500">*</span>
                </label>
                <select
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-red-400 focus:outline-none"
                  required
                >
                  <option value="">Selecciona un departamento</option>
                  {departamentosList.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>

              {/* Provincia */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Provincia <span className="text-red-500">*</span>
                </label>
                <select
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  disabled={!formData.departamento}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-red-400 focus:outline-none disabled:bg-gray-100"
                  required
                >
                  <option value="">Selecciona una provincia</option>
                  {provinciasList.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              {/* Distrito */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Distrito <span className="text-red-500">*</span>
                </label>
                <select
                  name="distrito"
                  value={formData.distrito}
                  onChange={handleChange}
                  disabled={!formData.provincia}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-red-400 focus:outline-none disabled:bg-gray-100"
                  required
                >
                  <option value="">Selecciona un distrito</option>
                  {distritosList.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dirección */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="calle"
                  value={formData.calle}
                  onChange={handleChange}
                  placeholder="Ingresa calle y número / Mz / Lote / Urb"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-red-400 focus:outline-none"
                  required
                />
              </div>

              {/* Código Postal */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Código Postal (opcional)
                </label>
                <input
                  type="text"
                  name="codigo_postal"
                  value={formData.codigo_postal}
                  onChange={handleChange}
                  placeholder="Ej: 15001"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-red-400 focus:outline-none"
                />
              </div>

              {/* Referencia */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Referencia (opcional)
                </label>
                <input
                  type="text"
                  name="referencia"
                  value={formData.referencia}
                  onChange={handleChange}
                  placeholder="Ej: Depto. 101, casa 3, cerca al parque"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-red-400 focus:outline-none"
                />
              </div>

              {/* Checkbox */}
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="es_predeterminada"
                  checked={formData.es_predeterminada}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                />
                <label className="text-sm text-gray-600">
                  Guardar como dirección principal
                </label>
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  loading={loading}
                >
                  Guardar dirección
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
