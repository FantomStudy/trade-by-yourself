import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { RegisterData } from "@/lib/api";

import { register } from "@/lib/api";

import { USER_QUERY_KEY } from "../../../lib/contexts/auth/AuthProvider";

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: RegisterData) =>
      register(credentials).then((r) => r.data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: USER_QUERY_KEY });
    },
  });
};
