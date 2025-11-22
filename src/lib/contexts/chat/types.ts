import type { Socket } from "socket.io-client";

export interface Message {
  id: number;
  chatId: number;
  content: string;
  createdAt: string;
  senderId: number;
  sender: {
    id: number;
    fullName: string;
  };
  product?: {
    id: number;
    name: string;
    image?: string;
    price: number;
  };
}

export interface NewChatMessage {
  chatId: number;
  message: Message;
  product: {
    id: number;
    name: string;
    image?: string;
    price: number;
  };
}

export interface TypingData {
  chatId: number;
  isTyping: boolean;
  userId: number;
}

export interface MessagesReadData {
  chatId: number;
  readBy: number;
}

export interface ChatSocketContextType {
  isConnected: boolean;
  socket: Socket | null;
  joinChat: (chatId: number) => void;
  leaveChat: (chatId: number) => void;
  markAsRead: (chatId: number) => void;
  sendMessage: (chatId: number, content: string) => void;
  sendTyping: (chatId: number, isTyping: boolean) => void;
}
