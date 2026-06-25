import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProduct } from "@/api/requests";
import { CURRENT_USER_QUERY_KEY } from "../queries/useCurrentUser";
import { USER_INFO_QUERY_KEY } from "../queries/useUserInfo";

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (_data, _vars, _ctx) => {
      void queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
    onSettled: (_data, _err, _vars, _ctx) => {
      const userId = queryClient.getQueryData<{ id?: number }>(CURRENT_USER_QUERY_KEY)?.id;
      if (userId) {
        void queryClient.invalidateQueries({ queryKey: USER_INFO_QUERY_KEY(userId) });
      }
    },
  });
};
