// src/components/orders/OrderReviewButton.jsx
import { useState } from "react";
import { Star, Upload, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { reviewAPI } from "../../api/review.api.js";
import { uploadAPI } from "../../api/upload.api.js";
import Modal from "../ui/Modal.jsx";
import Button from "../ui/Button.jsx";

export default function OrderReviewButton({ orderId, productId, productName, productImage, hasReviewed }) {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [previews, setPreviews] = useState([]);   // ← URLs blob para mostrar preview
    const [files, setFiles] = useState([]);          // ← File objects reales para subir
    const [uploading, setUploading] = useState(false);
    const queryClient = useQueryClient();

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await uploadAPI.uploadReview(formData);
        return res.data.url;
    };

    const mutation = useMutation({
        mutationFn: async (data) => {
            // Subir todos los File objects a Cloudinary
            const uploadedUrls = [];
            for (const file of data.imagenes) {
                const url = await uploadImage(file);
                uploadedUrls.push(url);
            }
            return reviewAPI.create({
                ...data,
                imagenes: uploadedUrls,
            });
        },
        onSuccess: () => {
            toast.success("¡Gracias por tu reseña!");
            setIsOpen(false);
            setRating(0);
            setTitle("");
            setComment("");
            setPreviews([]);
            setFiles([]);
            queryClient.invalidateQueries(["orders"]);
            queryClient.invalidateQueries(["product", productId]);
            queryClient.invalidateQueries(["reviews", productId]);
        },
        onError: (err) => toast.error(err.message || "Error al enviar reseña"),
    });

    const handleImageUpload = (e) => {
        const selected = Array.from(e.target.files);
        if (!selected.length) return;

        if (files.length + selected.length > 5) {
            toast.error("Máximo 5 imágenes por reseña");
            return;
        }

        // ✅ Guardar File objects Y blob URLs por separado
        setFiles((prev) => [...prev, ...selected]);
        setPreviews((prev) => [...prev, ...selected.map((f) => URL.createObjectURL(f))]);

        // Limpiar el input para permitir volver a seleccionar los mismos archivos
        e.target.value = "";
    };

    const removeImage = (index) => {
        // Revocar el blob URL para liberar memoria
        URL.revokeObjectURL(previews[index]);
        setPreviews((prev) => prev.filter((_, i) => i !== index));
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
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
            order_id: orderId,
            calificacion: rating,
            titulo: title || "Mi experiencia",
            comentario: comment,
            imagenes: files, // ✅ File objects reales, no blob URLs
        });
    };

    const handleClose = () => {
        // Limpiar blob URLs al cerrar
        previews.forEach((url) => URL.revokeObjectURL(url));
        setIsOpen(false);
        setRating(0);
        setTitle("");
        setComment("");
        setPreviews([]);
        setFiles([]);
    };

    if (hasReviewed) {
        return (
            <div className="text-xs text-green-600 font-medium px-3 py-1.5 rounded-lg bg-green-50">
                ✓ Ya reseñado
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition"
            >
                Dejar reseña
            </button>

            <Modal isOpen={isOpen} onClose={handleClose} title="Dejar reseña" size="md">
                <div className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
                    {/* Producto */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        {productImage && (
                            <img src={productImage} alt={productName} className="w-12 h-12 object-cover rounded-lg" />
                        )}
                        <div>
                            <p className="text-sm font-medium text-gray-800">{productName}</p>
                            <p className="text-xs text-gray-500">Pedido #{orderId}</p>
                        </div>
                    </div>

                    {/* Calificación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                        className={`${(hoverRating || rating) >= star
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                            } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            {rating === 1 && "⭐ Muy malo"}
                            {rating === 2 && "⭐⭐ Malo"}
                            {rating === 3 && "⭐⭐⭐ Regular"}
                            {rating === 4 && "⭐⭐⭐⭐ Bueno"}
                            {rating === 5 && "⭐⭐⭐⭐⭐ Excelente"}
                        </p>
                    </div>

                    {/* Título */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título (opcional)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej: Excelente producto"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-400"
                        />
                    </div>

                    {/* Comentario */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tu opinión <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Comparte tu experiencia con este producto..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-400 resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">
                            {comment.length}/1000 caracteres
                        </p>
                    </div>

                    {/* Fotos */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fotos (opcional, máximo 5)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {previews.map((src, idx) => (
                                <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group">
                                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {previews.length < 5 && (
                                <label className="cursor-pointer">
                                    <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-red-400 transition bg-gray-50">
                                        {uploading ? (
                                            <div className="animate-spin w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full" />
                                        ) : (
                                            <>
                                                <Upload size={16} className="text-gray-400" />
                                                <span className="text-[10px] text-gray-400">Subir</span>
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
                        <p className="text-xs text-gray-400">
                            {files.length > 0 ? `${files.length} imagen(es) seleccionada(s)` : "Puedes subir hasta 5 fotos de tu producto"}
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleSubmit} loading={mutation.isPending}>
                            Enviar reseña
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}