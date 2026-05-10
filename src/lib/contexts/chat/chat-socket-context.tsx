"use client";

import type { PropsWithChildren } from "react";

import type { ChatSocketContextType, ChatSocketLike, Message } from "./types";
import type { ChatEventName } from "@/lib/chat-socket";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CHATS_QUERY_KEY } from "@/lib/api/hooks/queries/useChats";
import { createChatSocket, parseChatSocketMessage, sendChatSocketEvent } from "@/lib/chat-socket";

import { useAuth } from "../auth";

const ChatSocketContext = createContext<ChatSocketContextType | null>(null);

const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
};

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
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<Map<ChatEventName, Set<(payload: any) => void>>>(new Map());

  useEffect(() => {
    if (user) void requestNotificationPermission();
  }, [user]);

  const emitLocal = useCallback((event: ChatEventName, payload: any) => {
    const set = listenersRef.current.get(event);
    if (!set) return;
    for (const cb of set) cb(payload);
  }, []);

  const socketLike = useMemo<ChatSocketLike>(
    () => ({
      on: (event, callback) => {
        const existing = listenersRef.current.get(event) ?? new Set();
        existing.add(callback);
        listenersRef.current.set(event, existing);
      },
      off: (event, callback) => {
        const existing = listenersRef.current.get(event);
        if (!existing) return;
        existing.delete(callback);
      },
    }),
    [],
  );

  useEffect(() => {
    if (!user) {
      if (wsRef.current) wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
      return;
    }

    const ws = createChatSocket();
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      const packet = parseChatSocketMessage(event.data);
      if (!packet) return;

      if (packet.event === "newMessage") {
        const data = packet.data as Message;
        if (data.senderId !== user.id) {
          const isWindowFocused = document.hasFocus();
          const isOnChatPage = window.location.pathname.includes(
            `/profile/messages/${data.chatId}`,
          );
          if (!isWindowFocused || !isOnChatPage) showNotification(data);
        }
      }

      if (packet.event === "newChatMessage") {
        void queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
      }

      emitLocal(packet.event, packet.data);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [emitLocal, queryClient, user]);

  const joinChat = useCallback((chatId: number) => {
    const ws = wsRef.current;
    if (!ws) return;
    sendChatSocketEvent(ws, "joinChat", { chatId });
  }, []);

  const leaveChat = useCallback((chatId: number) => {
    const ws = wsRef.current;
    if (!ws) return;
    sendChatSocketEvent(ws, "leaveChat", { chatId });
  }, []);

  const sendMessage = useCallback((chatId: number, content: string) => {
    const ws = wsRef.current;
    if (!ws) return;
    sendChatSocketEvent(ws, "sendMessage", { chatId, content });
  }, []);

  const sendTyping = useCallback((chatId: number, isTyping: boolean) => {
    const ws = wsRef.current;
    if (!ws) return;
    sendChatSocketEvent(ws, "typing", { chatId, isTyping });
  }, []);

  const markAsRead = useCallback((chatId: number) => {
    const ws = wsRef.current;
    if (!ws) return;
    sendChatSocketEvent(ws, "markAsRead", { chatId });
  }, []);

  const value: ChatSocketContextType = useMemo(
    () => ({
      isConnected,
      joinChat,
      leaveChat,
      markAsRead,
      sendMessage,
      sendTyping,
      socket: socketLike,
    }),
    [isConnected, joinChat, leaveChat, markAsRead, sendMessage, sendTyping, socketLike],
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
