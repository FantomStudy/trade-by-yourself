"use client";

import type { PropsWithChildren } from "react";
import type { Socket } from "socket.io-client";

import type { ChatSocketContextType, Message } from "./types";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io } from "socket.io-client";

import { useAuth } from "../auth";

const ChatSocketContext = createContext<ChatSocketContextType | null>(null);

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_WS_URL || "ws://localhost:3000/chat";

// Функция для запроса разрешения на уведомления
const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Browser doesn't support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

// Функция для показа уведомления
const showNotification = (message: Message) => {
  if (Notification.permission !== "granted") return;

  const productName = message.product?.name;
  const title = productName
    ? `${message.sender.fullName} (${productName})`
    : message.sender.fullName;

  const notification = new Notification(title, {
    body: message.content,
    icon: message.product?.image || "/logo.png",
    badge: message.product?.image || "/logo.png",
    tag: `chat-${message.chatId}`,
    requireInteraction: false,
  });

  notification.onclick = () => {
    window.focus();
    window.location.href = `/profile/messages/${message.chatId}`;
    notification.close();
  };
};

export const ChatSocketProvider = ({ children }: PropsWithChildren) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  // Запрос разрешения на уведомления при монтировании
  useEffect(() => {
    if (user) {
      requestNotificationPermission();
    }
  }, [user]);

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
      withCredentials: true,
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

    // Глобальный обработчик новых сообщений для уведомлений
    socketInstance.on("newMessage", (data: Message) => {
      // Показываем уведомление только если это не ваше сообщение
      // и если окно неактивно или вы не на странице этого чата
      if (data.senderId !== user.id) {
        const isWindowFocused = document.hasFocus();
        const isOnChatPage = window.location.pathname.includes(
          `/profile/messages/${data.chatId}`,
        );

        // Показываем уведомление если окно неактивно или вы на другой странице
        if (!isWindowFocused || !isOnChatPage) {
          showNotification(data);
        }
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
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
