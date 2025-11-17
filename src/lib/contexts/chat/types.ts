import type { Socket } from "socket.io-client";

export interface Message {
  chatId: number;
  content: string;
  createdAt: string;
  id: number;
  sender: {
    fullName: string;
    id: number;
  };
  senderId: number;
}

export interface NewChatMessage {
  chatId: number;
  message: Message;
  product: {
    id: number;
    image?: string;
    name: string;
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
  joinChat: (chatId: number) => void;
  leaveChat: (chatId: number) => void;
  markAsRead: (chatId: number) => void;
  sendMessage: (chatId: number, content: string) => void;
  sendTyping: (chatId: number, isTyping: boolean) => void;
  socket: Socket | null;
}
