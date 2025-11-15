import { addToFavorites, removeFromFavorites } from "@/api/requests";
import { useMutation } from "@tanstack/react-query";

export const useFavoriteMutation = (productId: number) => {
  return useMutation({
    mutationFn: async ({ isLiked }: { isLiked: boolean }) => {
      if (isLiked) {
        await addToFavorites(productId);
        return true;
      } else {
        await removeFromFavorites(productId);
        return false;
      }
    },
  });
};
