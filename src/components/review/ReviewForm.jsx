// src/components/review/ReviewForm.jsx
import { useState } from "react";
import { Star, Image, X, Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { reviewAPI } from "../../api/review.api.js";
import Button from "../ui/Button.jsx";
import useAuthStore from "../../store/useAuthStore.js";

export default function ReviewForm({ productId, productName, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const token = useAuthStore((s) => s.token);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data) => reviewAPI.create(data),
        onSuccess: () => {
            toast.success("¡Gracias por tu reseña! Será publicada tras moderación.");
            setRating(0);
            setTitle("");
            setComment("");
            setImages([]);
            queryClient.invalidateQueries(["reviews", productId]);
            queryClient.invalidateQueries(["product", productId]);
            if (onSuccess) onSuccess();
        },
        onError: (err) => {
            const message = err.response?.data?.message || "Error al enviar reseña";
            toast.error(message);
        },
    });

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            toast.error("Máximo 5 imágenes por reseña");
            return;
        }

        setUploading(true);
        setTimeout(() => {
            const newImages = files.map((f) => URL.createObjectURL(f));
            setImages((prev) => [...prev, ...newImages]);
            setUploading(false);
        }, 1000);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.error("Inicia sesión para dejar una reseña");
            return;
        }
        if (rating === 0) {
            toast.error("Por favor selecciona una calificación");
            return;
        }
        if (!comment.trim()) {
            toast.error("Por favor escribe un comentario");
            return;
        }

        mutation.mutate({
            product_id: productId,
            calificacion: rating,
            titulo: title || "Mi experiencia",
            comentario: comment,
            imagenes: images,
        });
    };

    if (!token) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-8 text-center dark:bg-gray-800 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 mb-3">Inicia sesión para dejar una reseña</p>
                <Button onClick={() => (window.location.href = "/login")}>
                    Iniciar sesión
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-8 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                ✍️ Deja tu reseña
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl dark:bg-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Calificando: <span className="font-medium">{productName}</span>
                    </p>
                </div>

                {/* Calificación con estrellas - VERSIÓN DARK */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tu calificación <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    size={28}
                                    className={
                                        (hoverRating || rating) >= star
                                            ? "fill-gray-800 text-gray-800 dark:fill-gray-300 dark:text-gray-300"
                                            : "text-gray-300 dark:text-gray-600"
                                    }
                                />
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {rating === 1 && "⭐ Muy malo"}
                        {rating === 2 && "⭐⭐ Malo"}
                        {rating === 3 && "⭐⭐⭐ Regular"}
                        {rating === 4 && "⭐⭐⭐⭐ Bueno"}
                        {rating === 5 && "⭐⭐⭐⭐⭐ Excelente"}
                    </p>
                </div>

                {/* Título */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Título de tu reseña (opcional)
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ej: Excelente producto, lo recomiendo"
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 dark:bg-gray-700 dark:text-gray-100"
                    />
                </div>

                {/* Comentario */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tu opinión <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Comparte tu experiencia con este producto..."
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 dark:bg-gray-700 dark:text-gray-100 resize-none"
                    />
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
                        {comment.length}/1000 caracteres
                    </p>
                </div>

                {/* Imágenes */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fotos (opcional, máximo 5)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        {images.length < 5 && (
                            <label className="cursor-pointer">
                                <div className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center hover:border-red-400 transition dark:hover:border-red-500">
                                    {uploading ? (
                                        <div className="animate-spin w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full" />
                                    ) : (
                                        <>
                                            <Upload size={16} className="text-gray-400 dark:text-gray-500" />
                                            <span className="text-[10px] text-gray-400 dark:text-gray-500">Subir</span>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        loading={mutation.isPending}
                        disabled={rating === 0 || !comment.trim()}
                    >
                        Enviar reseña
                    </Button>
                </div>

                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
                    Al enviar una reseña, aceptas nuestras{" "}
                    <a href="/terms" className="text-red-500 hover:underline">
                        políticas de reseñas
                    </a>
                </p>
            </form>
        </div>
    );
}