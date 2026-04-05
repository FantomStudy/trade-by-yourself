import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteProduct } from "@/api/requests";

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProducts"] });
    },
  });
};
