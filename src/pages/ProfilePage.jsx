import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { User, MapPin, Lock, Bell, Plus, Trash2, Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { userAPI } from "../api/user.api.js";
import useAuthStore from "../store/useAuthStore.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";

const TABS = [
  { id: "perfil", label: "Mi perfil", icon: User },
  { id: "direcciones", label: "Direcciones", icon: MapPin },
  { id: "contrasena", label: "Contraseña", icon: Lock },
  { id: "notificaciones", label: "Notificaciones", icon: Bell },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("perfil");
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Mi cuenta</h1>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar */}
        <aside className="sm:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6 pt-2">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-2xl font-bold text-red-500 mb-2">
                {user?.nombre?.[0]?.toUpperCase()}
              </div>
              <p className="font-semibold text-gray-800 text-sm text-center">
                {user?.nombre}
              </p>
              <p className="text-xs text-gray-400 text-center truncate w-full">
                {user?.email}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    activeTab === id
                      ? "bg-red-50 text-red-500"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Contenido */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "perfil" && (
              <PerfilTab user={user} updateUser={updateUser} />
            )}
            {activeTab === "direcciones" && <DireccionesTab />}
            {activeTab === "contrasena" && <ContrasenaTab />}
            {activeTab === "notificaciones" && <NotificacionesTab />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ── Tab Perfil ────────────────────────────────────────────
function PerfilTab({ user, updateUser }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { nombre: user?.nombre, telefono: user?.telefono || "" },
  });

  const mutation = useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: (res) => {
      updateUser(res.data);
      toast.success("Perfil actualizado");
    },
    onError: (err) => toast.error(err.message || "Error al actualizar"),
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-bold text-gray-800 mb-6">Información personal</h2>
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="flex flex-col gap-4"
      >
        <Input
          label="Nombre completo"
          error={errors.nombre?.message}
          {...register("nombre", { required: "El nombre es requerido" })}
        />
        <Input
          label="Email"
          value={user?.email}
          disabled
          className="bg-gray-50 cursor-not-allowed"
        />
        <Input label="Teléfono" {...register("telefono")} />
        <Button type="submit" loading={mutation.isPending} className="w-fit">
          Guardar cambios
        </Button>
      </form>
    </div>
  );
}

// ── Tab Direcciones ───────────────────────────────────────
function DireccionesTab() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => userAPI.getAddresses(),
    select: (res) => res.data,
  });

  const { register, handleSubmit, reset } = useForm();

  const addMutation = useMutation({
    mutationFn: userAPI.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Dirección agregada");
      setShowForm(false);
      reset();
    },
    onError: (err) => toast.error(err.message || "Error al agregar dirección"),
  });

  const deleteMutation = useMutation({
    mutationFn: userAPI.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Dirección eliminada");
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: userAPI.setDefaultAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-gray-800">Mis direcciones</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={14} /> Agregar
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleSubmit((data) => addMutation.mutate(data))}
          className="bg-gray-50 rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <Input
            label="Nombre destinatario"
            {...register("nombre_destinatario", { required: true })}
          />
          <Input label="Teléfono" {...register("telefono_contacto")} />
          <Input
            label="Dirección"
            className="sm:col-span-2"
            {...register("calle", { required: true })}
          />
          <Input label="Ciudad" {...register("ciudad", { required: true })} />
          <Input
            label="Departamento"
            {...register("departamento", { required: true })}
          />
          <Input label="Código postal" {...register("codigo_postal")} />
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit" size="sm" loading={addMutation.isPending}>
              Guardar
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </Button>
          </div>
        </motion.form>
      )}

      {/* Lista */}
      {addresses?.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">
          No tienes direcciones guardadas
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses?.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start justify-between p-4 border border-gray-100 rounded-xl"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-gray-800">
                    {addr.nombre_destinatario}
                  </p>
                  {addr.es_predeterminada === 1 && (
                    <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
                      Principal
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{addr.calle}</p>
                <p className="text-sm text-gray-500">
                  {addr.ciudad}, {addr.departamento}
                </p>
              </div>
              <div className="flex gap-2">
                {addr.es_predeterminada !== 1 && (
                  <button
                    onClick={() => setDefaultMutation.mutate(addr.id)}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Principal
                  </button>
                )}
                <button
                  onClick={() => deleteMutation.mutate(addr.id)}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2
                    size={14}
                    className="text-gray-400 hover:text-red-500"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab Contraseña ────────────────────────────────────────
function ContrasenaTab() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: userAPI.changePassword,
    onSuccess: () => {
      toast.success("Contraseña actualizada");
      reset();
    },
    onError: (err) => toast.error(err.message || "Error al cambiar contraseña"),
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-bold text-gray-800 mb-6">Cambiar contraseña</h2>
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="flex flex-col gap-4 max-w-sm"
      >
        <Input
          label="Contraseña actual"
          type="password"
          {...register("current_password", { required: "Requerida" })}
          error={errors.current_password?.message}
        />
        <Input
          label="Nueva contraseña"
          type="password"
          {...register("new_password", {
            required: "Requerida",
            minLength: { value: 8, message: "Mínimo 8 caracteres" },
          })}
          error={errors.new_password?.message}
        />
        <Button type="submit" loading={mutation.isPending} className="w-fit">
          Actualizar contraseña
        </Button>
      </form>
    </div>
  );
}

// ── Tab Notificaciones ────────────────────────────────────
function NotificacionesTab() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => userAPI.getNotifications(),
    select: (res) => res.data,
  });

  const queryClient = useQueryClient();
  const markRead = useMutation({
    mutationFn: userAPI.markAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-bold text-gray-800 mb-6">Notificaciones</h2>
      {notifications?.length === 0 ? (
        <div className="text-center py-10">
          <Bell size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No tienes notificaciones</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications?.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.leido && markRead.mutate(notif.id)}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                notif.leido
                  ? "border-gray-100 bg-white"
                  : "border-red-100 bg-red-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <p
                  className={`text-sm font-medium ${notif.leido ? "text-gray-600" : "text-gray-800"}`}
                >
                  {notif.titulo}
                </p>
                {!notif.leido && (
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1" />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">{notif.mensaje}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
