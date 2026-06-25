import { useMutation, useQueryClient } from "@tanstack/react-query";

import { publishDraft } from "@/api/requests";
import { CURRENT_USER_QUERY_KEY } from "../queries/useCurrentUser";
import { USER_INFO_QUERY_KEY } from "../queries/useUserInfo";

export const usePublishDraftMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishDraft,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      const userId = queryClient.getQueryData<{ id?: number }>(CURRENT_USER_QUERY_KEY)?.id;
      if (userId) {
        void queryClient.invalidateQueries({ queryKey: USER_INFO_QUERY_KEY(userId) });
      }
    },
  });
};
