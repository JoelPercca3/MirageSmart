import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { wishlistAPI } from "../api/wishlist.api.js";
import useAuthStore from "../store/useAuthStore.js";

export const useWishlist = () => {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistAPI.getWishlist(),
    select: (res) => res.data,
    enabled: !!token,
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => wishlistAPI.toggle(productId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(
        res.data.in_wishlist
          ? "❤️ Agregado a favoritos"
          : "Eliminado de favoritos",
      );
    },
    onError: (err) =>
      toast.error(err.message || "Error al actualizar favoritos"),
  });
};
