import { useMutation } from "@tanstack/react-query";

import { addToFavorites, removeFromFavorites } from "@/api/requests";

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
