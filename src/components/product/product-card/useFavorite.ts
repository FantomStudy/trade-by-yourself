import { useMutation } from "@tanstack/react-query";

import { addToFavorites, removeFromFavorites } from "@/lib/api";

interface UseFavoriteOptions {
  productId: number;
  onError?: (error: Error) => void;
  onSuccess?: (isLiked: boolean) => void;
}

export const useFavorite = ({
  productId,
  onSuccess,
  onError,
}: UseFavoriteOptions) => {
  // const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ isLiked }: { isLiked: boolean }) => {
      if (isLiked) {
        return addToFavorites(productId);
      } else {
        return removeFromFavorites(productId);
      }
    },
    onSuccess: (_, variables) => {
      onSuccess?.(variables.isLiked);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    toggle: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};
