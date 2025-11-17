import { useQuery } from "@tanstack/react-query";

import type { Chat, ChatDetail, MessagesResponse } from "@/types";

import type { QueryHookOptions } from "./types";

import { getAllChats, getChatById, getChatMessages } from "../../requests";

export const CHATS_QUERY_KEY = ["chats"];
export const CHAT_QUERY_KEY = (chatId: number) => ["chat", chatId];
export const CHAT_MESSAGES_QUERY_KEY = (
  chatId: number,
  page: number,
  limit: number,
) => ["chat", chatId, "messages", page, limit];

/**
 * Хук для получения всех чатов пользователя
 */
export const useChats = (options?: QueryHookOptions<Chat[]>) => {
  return useQuery({
    gcTime: 5 * 60 * 1000,
    queryFn: getAllChats,
    queryKey: CHATS_QUERY_KEY,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

/**
 * Хук для получения детальной информации о чате
 */
export const useChat = (
  chatId: number,
  options?: QueryHookOptions<ChatDetail>,
) => {
  return useQuery({
    enabled: !!chatId,
    gcTime: 5 * 60 * 1000,
    queryFn: () => getChatById(chatId),
    queryKey: CHAT_QUERY_KEY(chatId),
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

/**
 * Хук для получения сообщений чата с пагинацией
 */
export const useChatMessages = (
  chatId: number,
  page: number = 1,
  limit: number = 50,
  options?: QueryHookOptions<MessagesResponse>,
) => {
  return useQuery({
    enabled: !!chatId,
    gcTime: 5 * 60 * 1000,
    queryFn: () => getChatMessages(chatId, page, limit),
    queryKey: CHAT_MESSAGES_QUERY_KEY(chatId, page, limit),
    staleTime: 30 * 1000,
    ...options,
  });
};
