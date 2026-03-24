import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProduct } from "@/api/requests";

export const useUpdateProductMutation = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof updateProduct>[1]) => updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["currentUserProducts"] });
    },
  });
};
