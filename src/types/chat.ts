import type { User } from "./user";

export interface Message {
  id: number;
  chatId?: number;
  content?: string;
  createdAt: string;
  isFromMe?: boolean;
  isRead: boolean;
  readAt?: string | null;
  senderId: number;
  text?: string;
  timeString?: string;
  sender?: {
    id: number;
    fullName: string;
  };
}

export interface Chat {
  id: number;
  createdAt: string;
  lastActivity: string;
  unreadCount?: number;
  companion: {
    id: number;
    avatar?: string | null;
    fullName: string;
    phoneNumber: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    formattedDate: string;
    isFromMe: boolean;
    isRead: boolean;
  };
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
  };
}

export interface ChatDetail {
  id: number;
  buyer?: User;
  buyerId?: number;
  createdAt: string;
  isUserBuyer: boolean;
  otherUser?: User;
  productId?: number;
  seller?: User;
  sellerId?: number;
  unreadCount: number;
  companion: {
    id: number;
    fullName: string;
    phoneNumber: string;
    role: "buyer" | "seller";
  };
  product: {
    id: number;
    name: string;
    description?: string;
    image?: string;
    price: number;
  };
}

export interface MessagesResponse {
  hasMore: boolean;
  limit: number;
  messages: Message[];
  page: number;
  total: number;
}

export interface SendMessageData {
  chatId: number;
  text: string;
}

export interface StartChatData {
  productId: number;
}

export interface StartChatResponse {
  id?: number;
  chatId?: number;
  isNew?: boolean;
}
