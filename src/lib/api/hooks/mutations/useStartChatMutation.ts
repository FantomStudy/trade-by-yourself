import type { StartChatData } from "@/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { chatStart } from "../../requests";
import { CHATS_QUERY_KEY } from "../queries/useChats";

export const useStartChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StartChatData) => chatStart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    },
  });
};
