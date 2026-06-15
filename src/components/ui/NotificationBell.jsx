// src/components/ui/NotificationBell.jsx
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Package, Tag, Settings, Truck, Gift, Sparkles, X, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { notificationAPI } from "../../api/notification.api.js";
import { timeAgo } from "../../utils/formatDate.js";

// Avatares únicos con gradientes personalizados
const TIPO_AVATAR = {
    pedido: {
        icon: Package,
        gradient: "from-blue-500 to-indigo-600",
        bg: "bg-gradient-to-br",
    },
    promo: {
        icon: Gift,
        gradient: "from-orange-500 to-red-500",
        bg: "bg-gradient-to-br",
    },
    sistema: {
        icon: Settings,
        gradient: "from-gray-500 to-gray-700",
        bg: "bg-gradient-to-br",
    },
    envio: {
        icon: Truck,
        gradient: "from-emerald-500 to-teal-600",
        bg: "bg-gradient-to-br",
    },
    oferta: {
        icon: Sparkles,
        gradient: "from-amber-500 to-yellow-600",
        bg: "bg-gradient-to-br",
    },
};

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ["notifications"],
        queryFn: notificationAPI.getAll,
        refetchInterval: 30_000,
        select: (res) => res.data,
    });

    const notifications = data?.notifications ?? [];
    const unread = data?.unread ?? 0;

    const markRead = useMutation({
        mutationFn: notificationAPI.markAsRead,
        onSuccess: () => queryClient.invalidateQueries(["notifications"]),
    });

    const markAllRead = useMutation({
        mutationFn: notificationAPI.markAllRead,
        onSuccess: () => queryClient.invalidateQueries(["notifications"]),
    });

    const deleteNotif = useMutation({
        mutationFn: notificationAPI.delete,
        onSuccess: () => queryClient.invalidateQueries(["notifications"]),
    });

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    const handleNotifClick = (notif) => {
        if (!notif.leido) markRead.mutate(notif.id);
        setOpen(false);
    };

    return (
        <div className="relative" ref={ref}>
            <motion.button
                onClick={() => setOpen((o) => !o)}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="Notificaciones"
            >
                <Bell size={20} className="text-gray-600" />

                <AnimatePresence>
                    {unread > 0 && (
                        <motion.span
                            key={unread}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-xs"
                        >
                            {unread > 9 ? "9+" : unread}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-[380px] bg-white rounded-xl shadow-lg z-50 overflow-hidden border border-gray-100"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
                            <div className="flex items-center gap-2">
                                <Bell size={16} className="text-gray-700" />
                                <span className="font-semibold text-gray-800 text-sm">Notificaciones</span>
                                {unread > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                        {unread} nuevas
                                    </span>
                                )}
                            </div>
                            {unread > 0 && (
                                <button
                                    onClick={() => markAllRead.mutate()}
                                    className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
                                >
                                    <CheckCheck size={12} />
                                    Leer todo
                                </button>
                            )}
                        </div>

                        <div className="max-h-[460px] overflow-y-auto divide-y divide-gray-50">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                        <Bell size={28} className="text-gray-300" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">Sin notificaciones</p>
                                    <p className="text-xs text-gray-400 mt-1">Te avisaremos cuando haya novedades</p>
                                </div>
                            ) : (
                                notifications.map((notif) => {
                                    const tipoAvatar = TIPO_AVATAR[notif.tipo] ?? TIPO_AVATAR.sistema;
                                    const IconAvatar = tipoAvatar.icon;

                                    const content = (
                                        <div
                                            className={`
                                                group flex gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-150 cursor-pointer relative
                                                ${!notif.leido ? "bg-gradient-to-r from-red-50/30 to-transparent" : ""}
                                            `}
                                            onClick={() => handleNotifClick(notif)}
                                        >
                                            {!notif.leido && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-brand-400 to-brand-600 rounded-r-full" />
                                            )}

                                            {/* Avatar con gradiente único - sin imagen de Temu */}
                                            <div className={`w-11 h-11 rounded-xl ${tipoAvatar.bg} ${tipoAvatar.gradient} flex items-center justify-center flex-shrink-0 shadow-md transition-transform group-hover:scale-105 duration-200`}>
                                                <IconAvatar size={20} className="text-white" strokeWidth={1.5} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-0.5">
                                                    <p className={`text-sm ${!notif.leido ? "font-semibold text-gray-800" : "font-medium text-gray-700"}`}>
                                                        {notif.titulo}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap">
                                                        {timeAgo(notif.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                                    {notif.mensaje}
                                                </p>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotif.mutate(notif.id);
                                                }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    );

                                    return (
                                        <div key={notif.id} className="relative">
                                            {notif.url_accion ? (
                                                <Link to={notif.url_accion} onClick={() => handleNotifClick(notif)}>
                                                    {content}
                                                </Link>
                                            ) : content}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/30">
                                <Link
                                    to="/orders"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors w-full"
                                >
                                    Ver todos mis pedidos
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}