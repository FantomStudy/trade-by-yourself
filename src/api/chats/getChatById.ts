import type { ChatCompanion, ChatProduct } from "./getChats";
import { api } from "../instance";

export interface ChatDetail {
  id: number;
  companion?: ChatCompanion;
  otherUser?: ChatCompanion & { phoneNumber?: string | null };
  product: ChatProduct;
}

export const getChatById = (chatId: number) => api<ChatDetail>(`/chat/${chatId}`);

