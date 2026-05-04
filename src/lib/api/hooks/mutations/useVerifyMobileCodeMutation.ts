import type { VerifyMobileCodeData } from "@/api/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { verifyMobileCode } from "@/api/requests";

import { CURRENT_USER_QUERY_KEY } from "../queries/useCurrentUser";

export const useVerifyMobileCodeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VerifyMobileCodeData) => verifyMobileCode(data),
    onSuccess: (data) => {
      if (data.session_id) {
        try {
          document.cookie = `session_id=${data.session_id}; path=/; SameSite=Lax`;
        } catch {}
      }
      if (data.user) {
        queryClient.setQueryData(CURRENT_USER_QUERY_KEY, data.user);
      }
      void queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
  });
};
