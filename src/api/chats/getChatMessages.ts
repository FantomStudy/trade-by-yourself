import { api } from "../instance";

export interface ChatMessage {
  id: number;
  chatId: number;
  senderId?: number;
  content?: string;
  text?: string;
  createdAt: string;
  isRead?: boolean;
  isFromMe?: boolean;
  sender?: {
    id: number;
    fullName: string;
    phoneNumber?: string | null;
  } | null;
  timeString?: string;
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
}

export const getChatMessages = (chatId: number) =>
  api<ChatMessagesResponse>(`/chat/${chatId}/messages`);
