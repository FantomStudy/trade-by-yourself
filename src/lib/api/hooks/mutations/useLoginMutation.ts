import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { LoginData } from "../../types";

import { login } from "../../requests";
import { CURRENT_USER_QUERY_KEY } from "../queries/useCurrentUser";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginData) => login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, data.user);
    },
  });
};
