import { useMutation } from "@tanstack/react-query";

import { addFavorite } from "@/api-lab/favorites/addFavorite";
import { removeFavorite } from "@/api-lab/favorites/removeFavorite";

export const useFavoriteMutation = (productId: number) => {
  return useMutation({
    mutationFn: async ({ isLiked }: { isLiked: boolean }) => {
      if (isLiked) {
        await addFavorite(productId);
        return true;
      } else {
        await removeFavorite(productId);
        return false;
      }
    },
  });
};
