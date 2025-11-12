import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { LoginData } from "@/lib/api";

import { login } from "@/lib/api";

import { USER_QUERY_KEY } from "../../../lib/contexts/auth/AuthProvider";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginData) =>
      login(credentials).then((r) => r.data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: USER_QUERY_KEY });
    },
  });
};
