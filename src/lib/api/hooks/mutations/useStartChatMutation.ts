import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { StartChatData } from "@/types";

import { chatStart } from "../../requests";
import { CHATS_QUERY_KEY } from "../queries/useChats";

/**
 * Хук для создания нового чата или получения существующего
 */
export const useStartChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StartChatData) => chatStart(data),
    onSuccess: () => {
      // Инвалидируем список чатов для обновления
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    },
  });
};
