"use client";

import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useMemo, useRef, useState } from "react";

import type { Message as SocketMessage } from "@/lib/contexts/chat";
import type { Message } from "@/types";

import { Button } from "@/components/ui";
import { useChat, useChatMessages, useCurrentUser } from "@/lib/api/hooks";
import { useChatSocket } from "@/lib/contexts";
import { formatPrice } from "@/lib/format";

interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

const ChatPage = ({ params }: ChatPageProps) => {
  const { chatId } = use(params);
  const chatIdNum = Number(chatId);

  const [message, setMessage] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: currentUser } = useCurrentUser();
  const { data: chat, isLoading: isChatLoading } = useChat(chatIdNum);
  const { data: messagesData, isLoading: isMessagesLoading } =
    useChatMessages(chatIdNum);
  const {
    isConnected,
    joinChat,
    leaveChat,
    markAsRead,
    sendMessage: sendSocketMessage,
    sendTyping,
    socket,
  } = useChatSocket();

  // Используем messagesData напрямую и обновляем с помощью useState для новых сообщений
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const allMessages = useMemo(
    () => [...(messagesData?.messages || []), ...newMessages],
    [messagesData?.messages, newMessages],
  );

  // Подключение к чату и подписка на события
  useEffect(() => {
    if (!socket || !isConnected || !chatIdNum) return;

    joinChat(chatIdNum);
    markAsRead(chatIdNum);

    // Обработчик новых сообщений
    const handleNewMessage = (data: SocketMessage) => {
      if (data.chatId === chatIdNum) {
        const isMyMessage = data.senderId === currentUser?.id;
        const newMessage: Message = {
          chatId: data.chatId,
          content: data.content,
          createdAt: data.createdAt,
          id: data.id,
          isRead: false, // false означает "не прочитано получателем"
          senderId: data.senderId,
        };
        setNewMessages((prev) => [...prev, newMessage]);

        // Помечаем как прочитанное только если это сообщение от собеседника
        if (!isMyMessage) {
          markAsRead(chatIdNum);
        }
      }
    };

    // Обработчик индикатора печати
    const handleUserTyping = (data: {
      chatId: number;
      isTyping: boolean;
      userId: number;
    }) => {
      if (data.chatId === chatIdNum && data.userId !== currentUser?.id) {
        setOtherUserTyping(data.isTyping);
      }
    };

    // Обработчик прочитанных сообщений
    const handleMessagesRead = (data: { chatId: number; readBy: number }) => {
      if (data.chatId === chatIdNum) {
        setNewMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === currentUser?.id ? { ...msg, isRead: true } : msg,
          ),
        );
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("messagesRead", handleMessagesRead);
      leaveChat(chatIdNum);
    };
  }, [
    socket,
    isConnected,
    chatIdNum,
    currentUser?.id,
    joinChat,
    leaveChat,
    markAsRead,
  ]);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const handleSend = () => {
    if (message.trim() && isConnected) {
      sendSocketMessage(chatIdNum, message.trim());
      setMessage("");
      sendTyping(chatIdNum, false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Отправляем индикатор печатания
    if (e.target.value.trim() && isConnected) {
      sendTyping(chatIdNum, true);

      // Сбрасываем таймер
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Устанавливаем новый таймер для отключения индикатора
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(chatIdNum, false);
      }, 1000);
    } else if (isConnected) {
      sendTyping(chatIdNum, false);
    }
  };

  const handleShowPhone = () => {
    setShowPhone((prev) => !prev);
  };

  if (isChatLoading || isMessagesLoading) {
    return (
      <div className="flex h-[calc(100vh-110px)] items-center justify-center rounded-lg bg-white shadow-sm">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  if (!chat || !messagesData) {
    return (
      <div className="flex h-[calc(100vh-110px)] items-center justify-center rounded-lg bg-white shadow-sm">
        <p className="text-gray-500">Чат не найден</p>
      </div>
    );
  }

  const messages = allMessages;
  const otherUser = chat.companion || chat.otherUser;

  return (
    <div className="flex h-[calc(100vh-110px)] flex-col overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Хедер чата */}
      <div className="flex flex-shrink-0 items-center gap-4 border-b bg-white px-4 py-3">
        <Link href={"/profile/messages" as any}>
          <Button className="h-10 w-10 p-0" variant="ghost">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-200">
            {chat.product.image && (
              <img
                alt={chat.product.name}
                className="h-full w-full object-cover"
                src={chat.product.image}
              />
            )}
          </div>
          <div>
            <h1 className="text-base font-semibold">{chat.product.name}</h1>
            <p className="text-sm text-blue-600">
              {formatPrice(chat.product.price)}
            </p>
          </div>
        </div>

        <div className="ml-auto">
          <Button
            className="bg-blue-500 px-6 hover:bg-blue-600"
            onClick={handleShowPhone}
          >
            {showPhone && otherUser?.phoneNumber
              ? otherUser.phoneNumber
              : "Показать номер"}
          </Button>
        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-6">
        {messages.map((msg) => {
          const isCurrentUser =
            msg.isFromMe ?? msg.senderId === currentUser?.id;
          const sender =
            msg.sender || (isCurrentUser ? currentUser : otherUser);
          const senderInitials =
            sender?.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "??";

          const messageText = msg.content || msg.text || "";

          return (
            <div
              key={msg.id}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[70%] flex-col gap-1 ${isCurrentUser ? "items-end" : "items-start"}`}
              >
                {/* Аватар и имя отправителя для чужих сообщений */}
                {!isCurrentUser && (
                  <div className="mb-1 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-medium text-white">
                      {senderInitials}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {sender?.fullName}
                    </span>
                  </div>
                )}

                {/* Имя для своих сообщений */}
                {isCurrentUser && (
                  <span className="mr-2 text-sm font-medium text-gray-700">
                    {sender?.fullName}
                  </span>
                )}

                {/* Сообщение */}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    isCurrentUser
                      ? "bg-blue-400 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <p className="text-sm">{messageText}</p>
                </div>

                {/* Время и статус */}
                <div className="flex items-center gap-1 px-2 text-xs text-gray-500">
                  <span>{msg.isRead ? "Просмотрено" : "Не просмотрено"}</span>
                  <span>•</span>
                  <span>
                    {msg.timeString ||
                      new Date(msg.createdAt).toLocaleString("ru-RU", {
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white px-4 py-3 text-gray-500">
              <p className="text-sm">Печатает...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="border-t bg-white p-4">
        <div className="flex items-end gap-3">
          <textarea
            className="flex-1 resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            value={message}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder="Сообщение"
            rows={1}
          />
          <Button
            className="h-12 w-12 rounded-full bg-blue-500 p-0 hover:bg-blue-600"
            disabled={!isConnected || !message.trim()}
            onClick={handleSend}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
