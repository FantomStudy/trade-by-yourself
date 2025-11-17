import type {
  Chat,
  ChatDetail,
  MessagesResponse,
  StartChatData,
  StartChatResponse,
} from "@/types";

import { api } from "../instance";

/**
 * Создает новый чат между покупателем и продавцом товара или возвращает существующий
 */
export const chatStart = async (data: StartChatData) =>
  api<StartChatResponse>("/chat/start", {
    body: data,
    method: "POST",
  });

/**
 * Возвращает все чаты пользователя с информацией о собеседниках и последних сообщениях
 */
export const getAllChats = async () => api<Chat[]>("/chat");

/**
 * Возвращает подробную информацию о чате, товаре и собеседнике
 */
export const getChatById = async (chatId: number) =>
  api<ChatDetail>(`/chat/${chatId}`);

/**
 * Возвращает сообщения чата с пагинацией
 */
export const getChatMessages = async (
  chatId: number,
  page: number = 1,
  limit: number = 50,
) => api<MessagesResponse>(`/chat/${chatId}/messages`);
