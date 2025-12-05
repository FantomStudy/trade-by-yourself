import { useMutation, useQueryClient } from "@tanstack/react-query";

import { moderateProduct } from "@/api/requests";

export const useModerateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      status,
    }: {
      productId: number;
      status: "APPROVED" | "DENIDED";
    }) => moderateProduct(productId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productsToModerate"] });
    },
  });
};
