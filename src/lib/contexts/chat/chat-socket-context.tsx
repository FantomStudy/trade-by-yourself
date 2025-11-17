"use client";

import type { PropsWithChildren } from "react";
import type { Socket } from "socket.io-client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io } from "socket.io-client";

import type { ChatSocketContextType } from "./types";

import { useAuth } from "../auth";

const ChatSocketContext = createContext<ChatSocketContextType | null>(null);

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_WS_URL || "ws://localhost:3000/chat";

export const ChatSocketProvider = ({ children }: PropsWithChildren) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    console.log("Initializing WebSocket connection to:", SOCKET_URL);

    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true, // Отправляет cookies автоматически
    });

    socketInstance.on("connect", () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const joinChat = useCallback(
    (chatId: number) => {
      if (socket?.connected) {
        socket.emit("joinChat", { chatId });
      }
    },
    [socket],
  );

  const leaveChat = useCallback(
    (chatId: number) => {
      if (socket?.connected) {
        socket.emit("leaveChat", { chatId });
      }
    },
    [socket],
  );

  const sendMessage = useCallback(
    (chatId: number, content: string) => {
      if (socket?.connected) {
        socket.emit("sendMessage", { chatId, content });
      }
    },
    [socket],
  );

  const sendTyping = useCallback(
    (chatId: number, isTyping: boolean) => {
      if (socket?.connected) {
        socket.emit("typing", { chatId, isTyping });
      }
    },
    [socket],
  );

  const markAsRead = useCallback(
    (chatId: number) => {
      if (socket?.connected) {
        socket.emit("markAsRead", { chatId });
      }
    },
    [socket],
  );

  const value: ChatSocketContextType = useMemo(
    () => ({
      isConnected,
      joinChat,
      leaveChat,
      markAsRead,
      sendMessage,
      sendTyping,
      socket,
    }),
    [
      isConnected,
      joinChat,
      leaveChat,
      markAsRead,
      sendMessage,
      sendTyping,
      socket,
    ],
  );

  return <ChatSocketContext value={value}>{children}</ChatSocketContext>;
};

export const useChatSocket = () => {
  const context = use(ChatSocketContext);
  if (!context) {
    throw new Error("useChatSocket must be used within ChatSocketProvider");
  }
  return context;
};
