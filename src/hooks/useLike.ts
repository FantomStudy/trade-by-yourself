import { useMutation } from "@tanstack/react-query";
import { addFavorite } from "@/api/favorites/addFavorite";
import { deleteFavorite } from "@/api/favorites/deleteFavorite";

export const useLike = (productId: number) =>
  useMutation({
    mutationFn: async (isLiked: boolean) => {
      if (isLiked) {
        await addFavorite(productId);
      } else {
        await deleteFavorite(productId);
      }
    },
  });
