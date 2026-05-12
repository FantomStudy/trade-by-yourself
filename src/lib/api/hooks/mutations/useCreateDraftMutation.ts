import { useMutation } from "@tanstack/react-query";

import { createDraftProduct } from "@/api/requests";

export const useCreateDraftMutation = () =>
  useMutation({
    mutationFn: createDraftProduct,
  });
