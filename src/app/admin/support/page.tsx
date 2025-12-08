"use client";

import type { Chat } from "@/types";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Typography } from "@/components/ui";
import { useChats } from "@/lib/api/hooks";
import { useChatSocket } from "@/lib/contexts";
import { formatPrice } from "@/lib/format";

const SupportPage = () => {
  const { data: initialChats, isLoading } = useChats();
  const [chats, setChats] = useState<Chat[]>([]);
  const { socket, isConnected } = useChatSocket();

  // Инициализация чатов
  useEffect(() => {
    if (initialChats) {
      setChats(initialChats);
    }
  }, [initialChats]);

  // Обработка новых сообщений через WebSocket
  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log("Support chat: listening for new messages");

    const handleNewMessage = (data: any) => {
      console.log("Received message:", data);

      // Обновляем список чатов
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.id === data.chatId) {
            return {
              ...chat,
              lastMessage: {
                content: data.content,
                createdAt: data.createdAt,
                formattedDate: data.timeString || new Date().toLocaleString(),
                isFromMe: false,
                isRead: false,
              },
              unreadCount: (chat.unreadCount || 0) + 1,
              lastActivity: data.createdAt,
            };
          }
          return chat;
        });
      });

      // Если это уведомление о модерации, показываем в консоли
      if (data.isModeration) {
        console.log("📨 Moderation notification:", {
          chatId: data.chatId,
          content: data.content,
          sender: data.sender,
        });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, isConnected]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Typography className="text-3xl font-bold">Чат поддержки</Typography>
          <Typography className="mt-2 text-gray-600">
            Общение с пользователями и поддержка
          </Typography>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <Typography className="text-center text-gray-500">
            Загрузка чатов...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography className="text-3xl font-bold">Чат поддержки</Typography>
        <Typography className="mt-2 text-gray-600">
          Общение с пользователями и поддержка
        </Typography>
        <div className="mt-2 flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
          />
          <Typography className="text-sm text-gray-500">
            {isConnected ? "Подключено" : "Отключено"}
          </Typography>
          {chats.length > 0 && (
            <>
              <span className="text-gray-300">•</span>
              <Typography className="text-sm text-gray-500">
                Всего чатов: {chats.length}
              </Typography>
            </>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        {chats.length === 0 ? (
          <div className="p-6">
            <Typography className="text-center text-gray-500">
              Нет активных чатов
            </Typography>
          </div>
        ) : (
          <div className="divide-y">
            {chats.map((chat) => {
              const hasUnread = (chat.unreadCount || 0) > 0;
              const isModeration =
                chat.lastMessage?.content?.includes("модерацией") ||
                chat.lastMessage?.content?.includes("❌") ||
                chat.lastMessage?.content?.includes("✅");

              return (
                <Link
                  href={`/profile/messages/${chat.id}`}
                  key={chat.id}
                  className="block transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start gap-4 p-4">
                    {/* Изображение товара */}
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                      {chat.product.image && (
                        <img
                          alt={chat.product.name}
                          className="h-full w-full object-cover"
                          src={chat.product.image}
                        />
                      )}
                    </div>

                    {/* Информация о чате */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <Typography className="truncate font-semibold">
                            {chat.companion.fullName}
                          </Typography>
                          <Typography className="truncate text-sm text-gray-600">
                            {chat.product.name}
                          </Typography>
                        </div>
                        <Typography className="text-xs text-gray-400">
                          {chat.lastMessage?.formattedDate ||
                            new Date(chat.lastActivity).toLocaleDateString(
                              "ru-RU",
                            )}
                        </Typography>
                      </div>

                      <div className="flex items-center gap-2">
                        <Typography className="text-sm text-blue-600">
                          {formatPrice(chat.product.price)}
                        </Typography>
                        {isModeration && (
                          <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                            ⚠️ Модерация
                          </span>
                        )}
                      </div>

                      {/* Последнее сообщение */}
                      {chat.lastMessage && (
                        <div
                          className={`mt-2 rounded p-2 ${
                            isModeration
                              ? "border-l-4 border-yellow-400 bg-yellow-50"
                              : "bg-gray-50"
                          }`}
                        >
                          <Typography
                            className={`line-clamp-2 text-sm ${
                              hasUnread
                                ? "font-semibold text-gray-900"
                                : "text-gray-600"
                            } ${isModeration ? "text-yellow-900" : ""}`}
                          >
                            {chat.lastMessage.content}
                          </Typography>
                        </div>
                      )}

                      {/* Счетчик непрочитанных */}
                      {hasUnread && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {chat.unreadCount}
                          </span>
                          <Typography className="text-xs text-red-600">
                            непрочитанных
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportPage;
