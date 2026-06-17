import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell, Package, Settings, Truck, X, CheckCheck, ArrowRight,
    Flame, Zap, Megaphone,  // 📢 Megáfono para default
} from "lucide-react";
import { Link } from "react-router-dom";
import { notificationAPI } from "../../api/notification.api.js";
import { timeAgo } from "../../utils/formatDate.js";

const TIPO_CONFIG = {
    pedido: {
        icon: Package,
        gradient: "from-blue-500 to-indigo-600",
        border: "border-l-blue-500",
        bg: "bg-blue-50",
        badge: "bg-blue-100 text-blue-700",
        badgeText: "📦 PEDIDO",
    },
    promo: {
        icon: Flame,
        gradient: "from-red-600 to-orange-500",
        border: "border-l-red-500",
        bg: "bg-gradient-to-r from-red-50 to-orange-50",
        badge: "bg-red-100 text-red-700",
        badgeText: "🔥 PROMOCIÓN",
    },
    sistema: {
        icon: Settings,
        gradient: "from-gray-500 to-gray-700",
        border: "border-l-gray-400",
        bg: "bg-gray-50",
        badge: "bg-gray-100 text-gray-600",
        badgeText: "⚙️ SISTEMA",
    },
    envio: {
        icon: Truck,
        gradient: "from-emerald-500 to-teal-600",
        border: "border-l-emerald-500",
        bg: "bg-emerald-50",
        badge: "bg-emerald-100 text-emerald-700",
        badgeText: "🚚 ENVÍO",
    },
    oferta: {
        icon: Zap,
        gradient: "from-amber-500 to-yellow-500",
        border: "border-l-amber-500",
        bg: "bg-amber-50",
        badge: "bg-amber-100 text-amber-700",
        badgeText: "⚡ OFERTA FLASH",
    },
    // 👉 Ícono llamativo para tipos vacíos/desconocidos
    default: {
        icon: Megaphone,  // 📢 Megáfono
        gradient: "from-purple-500 to-pink-500",
        border: "border-l-purple-500",
        bg: "bg-gradient-to-r from-purple-50 to-pink-50",
        badge: "bg-purple-100 text-purple-700",
        badgeText: "📢 NOVEDAD",
    },
};

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ["notifications"],
        queryFn: notificationAPI.getAll,
        refetchInterval: 30000,
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

    const getConfig = (tipo) => {
        if (!tipo || tipo === "") return TIPO_CONFIG.default;
        return TIPO_CONFIG[tipo] ?? TIPO_CONFIG.default;
    };

    return (
        <div className="relative" ref={ref}>
            <motion.button
                onClick={() => setOpen((o) => !o)}
                whileTap={{ scale: 0.9 }}
                className="relative p-2.5 hover:bg-gray-100 rounded-xl transition"
                aria-label="Notificaciones"
            >
                <Bell size={22} className={open ? "text-red-500" : "text-gray-700"} />
                <AnimatePresence>
                    {unread > 0 && (
                        <motion.span
                            key={unread}
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.3, 1] }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm shadow-red-300"
                        >
                            {unread > 9 ? "9+" : unread}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-[390px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Bell size={16} className="text-red-500" />
                                <span className="font-bold text-gray-800 text-sm">Notificaciones</span>
                                {unread > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {unread} nuevas
                                    </span>
                                )}
                            </div>
                            {unread > 0 && (
                                <button
                                    onClick={() => markAllRead.mutate()}
                                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold transition"
                                >
                                    <CheckCheck size={13} />
                                    Leer todo
                                </button>
                            )}
                        </div>

                        <div className="max-h-[460px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-14 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                        <Bell size={30} className="text-gray-200" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-500">Sin notificaciones</p>
                                    <p className="text-xs text-gray-400 mt-1">Te avisaremos cuando haya novedades</p>
                                </div>
                            ) : (
                                notifications.map((notif) => {
                                    const cfg = getConfig(notif.tipo);
                                    const Icon = cfg.icon;

                                    return (
                                        <div key={notif.id} className="border-b border-gray-50 last:border-0">
                                            <div
                                                className={`
                                                    group relative flex gap-3 px-4 py-3.5 cursor-pointer
                                                    border-l-4 transition-all duration-150
                                                    ${!notif.leido ? cfg.border : "border-l-transparent"}
                                                    ${!notif.leido ? cfg.bg : "hover:bg-gray-50"}
                                                `}
                                                onClick={() => handleNotifClick(notif)}
                                            >
                                                <div
                                                    className={`
                                                        w-11 h-11 rounded-xl bg-gradient-to-br ${cfg.gradient}
                                                        flex items-center justify-center flex-shrink-0 shadow-md
                                                        transition-transform group-hover:scale-105 duration-200
                                                    `}
                                                >
                                                    <Icon size={20} className="text-white" strokeWidth={1.8} />
                                                </div>

                                                <div className="flex-1 min-w-0 pr-6">
                                                    {!notif.leido && (
                                                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${cfg.badge}`}>
                                                            {cfg.badgeText}
                                                        </span>
                                                    )}

                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-sm leading-snug ${!notif.leido ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                                                            {notif.titulo}
                                                        </p>
                                                        <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap mt-0.5">
                                                            {timeAgo(notif.created_at)}
                                                        </span>
                                                    </div>

                                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                                                        {notif.mensaje}
                                                    </p>

                                                    {(notif.tipo === "promo" || notif.tipo === "oferta") && notif.url_accion && !notif.leido && (
                                                        <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-orange-600">
                                                            {notif.tipo === "promo" ? "Ver promoción" : "Ver oferta"} <ArrowRight size={11} />
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotif.mutate(notif.id);
                                                    }}
                                                    className="absolute right-3 top-3 p-1 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-center">
                                <Link
                                    to="/orders"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold transition"
                                >
                                    Ver mis pedidos <ArrowRight size={12} />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}