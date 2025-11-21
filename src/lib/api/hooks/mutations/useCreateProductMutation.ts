import { useMutation } from "@tanstack/react-query";

import { createProduct } from "@/api/requests";

// TODO: изменить мутацию по аналогии с Login
export const useCreateProductMutation = () => {
  return useMutation({
    mutationFn: createProduct,
  });
};
