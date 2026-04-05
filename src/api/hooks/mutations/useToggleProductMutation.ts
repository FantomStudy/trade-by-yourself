import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toggleProduct } from "@/api/requests";

export const useToggleProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProducts"] });
    },
  });
};
