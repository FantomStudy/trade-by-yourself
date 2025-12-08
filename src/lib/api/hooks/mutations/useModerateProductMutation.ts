import { useMutation, useQueryClient } from "@tanstack/react-query";

import { moderateProduct } from "@/api/requests";

export const useModerateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      status,
      reason,
    }: {
      productId: number;
      status: "APPROVED" | "DENIDED";
      reason?: string;
    }) => moderateProduct(productId, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productsToModerate"] });
    },
  });
};
