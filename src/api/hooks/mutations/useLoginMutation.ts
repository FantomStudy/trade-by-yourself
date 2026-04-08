import type { LoginData, LoginResponse } from "../../types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "../../requests";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginData) => login(credentials),
    onSuccess: (data: LoginResponse) => {
      try {
        // Persist session_id in a cookie so it is sent with requests
        // Cookie is accessible client-side; server attaches cookies automatically in api instance
        document.cookie = `session_id=${data.session_id}; path=/; SameSite=Lax`;
      } catch {}
      queryClient.setQueryData(["user", "current"], data.user);
    },
  });
};
