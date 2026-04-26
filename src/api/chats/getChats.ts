import { api } from "../instance";

export interface ChatCompanion {
  id: number;
  fullName: string;
}

export interface ChatProduct {
  id: number;
  name: string;
  price: number;
  image?: string | null;
}

export interface ChatLastMessage {
  id: number;
  content: string;
  createdAt: string;
}

export interface Chat {
  id: number;
  unreadCount?: number;
  companion: ChatCompanion;
  product: ChatProduct;
  lastMessage?: ChatLastMessage | null;
}

export const getChats = () => api<Chat[]>("/chat");
