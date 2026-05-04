"use client";

import type { PropsWithChildren } from "react";
import type { Socket } from "socket.io-client";

import type { ChatSocketContextType, Message } from "./types";

import { useQueryClient } from "@tanstack/react-query";
import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";
import { CHATS_QUERY_KEY } from "@/lib/api/hooks/queries/useChats";
import { createChatSocket, getChatSocketUrl } from "@/lib/chat-socket";

import { useAuth } from "../auth";

const ChatSocketContext = createContext<ChatSocketContextType | null>(null);

/** Ответ ack от Go: joinChat / sendMessage / markAsRead */
type SocketAck = { success?: boolean; message?: string } | undefined;

function logAckFailed(op: string, ack: SocketAck) {
  if (ack && ack.success === false && ack.message) {
    console.warn(`[chat socket] ${op}:`, ack.message);
  }
}

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
    tag: message.product?.name || `chat-${message.chatId}`,
    requireInteraction: false,
  });

  notification.onclick = () => {
    window.focus();
    window.location.href = `/profile/messages/${message.chatId}`;
    notification.close();
  };
};

export const ChatSocketProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
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

    // Тот же хост, что REST: session_id уходит в handshake благодаря withCredentials (см. chat-socket.ts).
    const socketInstance = createChatSocket();

    socketInstance.on("connect", () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error: Error) => {
      const url = getChatSocketUrl();
      console.error("Chat Socket connect_error:", error?.message ?? error, { url });
      if (process.env.NODE_ENV === "development") {
        console.info(
          "[chat] Если xhr poll error: проверь Network → запрос к /socket.io; на бэке CORS с credentials для origin фронта. Либо в .env: NEXT_PUBLIC_CHAT_SOCKET_RELATIVE=true и NEXT_PUBLIC_CHAT_SOCKET_POLLING_ONLY=true (прокси через Next, см. next.config rewrites).",
        );
      }
      setIsConnected(false);
    });

    // Глобальный обработчик новых сообщений для уведомлений
    socketInstance.on("newMessage", (data: Message) => {
      // Показываем уведомление только если это не ваше сообщение
      // и если окно неактивно или вы не на странице этого чата
      if (data.senderId !== user.id) {
        const isWindowFocused = document.hasFocus();
        const isOnChatPage = window.location.pathname.includes(`/profile/messages/${data.chatId}`);

        // Показываем уведомление если окно неактивно или вы на другой странице
        if (!isWindowFocused || !isOnChatPage) {
          showNotification(data);
        }
      }
    });

    // Событие для списка чатов (сайдбар / «Сообщения»)
    socketInstance.on("newChatMessage", () => {
      void queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user, queryClient]);

  const joinChat = useCallback(
    (chatId: number) => {
      if (socket?.connected) {
        socket.emit("joinChat", { chatId }, (ack: SocketAck) => logAckFailed("joinChat", ack));
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
        socket.emit(
          "sendMessage",
          { chatId, content },
          (ack: SocketAck) => logAckFailed("sendMessage", ack),
        );
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
        socket.emit("markAsRead", { chatId }, (ack: SocketAck) => logAckFailed("markAsRead", ack));
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
    [isConnected, joinChat, leaveChat, markAsRead, sendMessage, sendTyping, socket],
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
