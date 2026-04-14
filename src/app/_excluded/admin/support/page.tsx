"use client";

import type { SupportMessage } from "@/lib/support-chat";
import type { Chat } from "@/types";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useChats } from "@/api/hooks";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useChatSocket } from "@/lib/contexts";
import { formatPrice } from "@/lib/format";
import {
  addSupportMessage,
  getAdminUnreadCount,
  getSupportMessages,
  markSupportMessagesAsRead,
} from "@/lib/support-chat";
import { MobileHeader } from "../_components/admin-sidebar";
import styles from "./support.module.css";

const SupportPage = () => {
  const { data: initialChats, isLoading } = useChats();
  const [chats, setChats] = useState<Chat[]>([]);
  const { socket, isConnected } = useChatSocket();
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [supportUnread, setSupportUnread] = useState(0);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Инициализация чатов
  useEffect(() => {
    if (initialChats) {
      setChats(initialChats);
    }
  }, [initialChats]);

  // Загрузка сообщений тех поддержки
  useEffect(() => {
    const updateSupport = () => {
      setSupportMessages(getSupportMessages());
      setSupportUnread(getAdminUnreadCount());
    };

    updateSupport();

    window.addEventListener("supportMessageAdded", updateSupport);
    window.addEventListener("supportMessagesRead", updateSupport);

    return () => {
      window.removeEventListener("supportMessageAdded", updateSupport);
      window.removeEventListener("supportMessagesRead", updateSupport);
    };
  }, []);

  const handleSendSupport = () => {
    if (!message.trim()) return;

    addSupportMessage(message.trim(), false);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendSupport();
    }
  };

  const openSupportChat = () => {
    setShowSupportChat(true);
    markSupportMessagesAsRead(false);
  };

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
        <MobileHeader title="Чат поддержки" />
        <div>
          <Typography className="text-xl font-bold sm:text-3xl">Чат поддержки</Typography>
          <Typography className="mt-2 text-gray-600">
            Общение с пользователями и поддержка
          </Typography>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <Typography className="text-center text-gray-500">Загрузка чатов...</Typography>
        </div>
      </div>
    );
  }

  // Если открыт чат тех поддержки
  if (showSupportChat) {
    return (
      <div className="space-y-6">
        <MobileHeader title="Техническая поддержка" />
        <div className={styles.chatContainer}>
          {/* Шапка */}
          <div className={styles.header}>
            <button className={styles.backButton} onClick={() => setShowSupportChat(false)}>
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex flex-1 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold">Техническая поддержка</h2>
                <p className="text-xs text-gray-500">Сообщения пользователей</p>
              </div>
            </div>
          </div>

          {/* Сообщения */}
          <div className={styles.messagesContainer}>
            {supportMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">Нет сообщений</h3>
                <p className="text-sm text-gray-600">Сообщения от пользователей появятся здесь</p>
              </div>
            ) : (
              <div className={styles.messagesList}>
                {supportMessages.map((msg) => (
                  <div key={msg.id}>
                    {msg.isFromUser && (
                      <div className="mb-1 text-xs text-gray-500 text-left ml-2">
                        {msg.userName || "Пользователь"} (ID: {msg.userId || "N/A"})
                      </div>
                    )}
                    <div
                      className={`${styles.messageWrapper} ${
                        msg.isFromUser ? styles.theirMessage : styles.myMessage
                      }`}
                    >
                      <div className={styles.message}>
                        <p className={styles.messageContent}>{msg.content}</p>
                        <span className={styles.messageTime}>
                          {new Date(msg.createdAt).toLocaleTimeString("ru-RU", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Форма отправки */}
          <div className={styles.inputContainer}>
            <textarea
              className={styles.textarea}
              placeholder="Ответить пользователю..."
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              className={styles.sendButton}
              disabled={!message.trim()}
              onClick={handleSendSupport}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MobileHeader title="Чат поддержки" />
      <div>
        <Typography className="text-xl font-bold sm:text-3xl">Чат поддержки</Typography>
        <Typography className="mt-2 text-gray-600">Общение с пользователями и поддержка</Typography>
        <div className="mt-2 flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <Typography className="text-sm text-gray-500">
            {isConnected ? "Подключено" : "Отключено"}
          </Typography>
          {chats.length > 0 && (
            <>
              <span className="text-gray-300">•</span>
              <Typography className="text-sm text-gray-500">Всего чатов: {chats.length}</Typography>
            </>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        {chats.length === 0 && supportUnread === 0 ? (
          <div className="p-6">
            <Typography className="text-center text-gray-500">Нет активных чатов</Typography>
          </div>
        ) : (
          <div className="divide-y">
            {/* Чат тех поддержки - всегда первый если есть сообщения */}
            {(supportMessages.length > 0 || supportUnread > 0) && (
              <button
                className="block w-full text-left transition-colors hover:bg-gray-50"
                onClick={openSupportChat}
              >
                <div className="flex items-start gap-4 p-4 border-2 border-purple-200">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-purple-100 flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-purple-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <Typography className="truncate font-semibold">
                          Техническая поддержка
                        </Typography>
                        <Typography className="truncate text-sm text-purple-600">
                          Сообщения от пользователей
                        </Typography>
                      </div>
                    </div>

                    {supportMessages.length > 0 && (
                      <div className="mt-2 rounded bg-purple-50 p-2">
                        <Typography className="line-clamp-2 text-sm text-gray-600">
                          {supportMessages.at(-1)?.content}
                        </Typography>
                      </div>
                    )}

                    {supportUnread > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white">
                          {supportUnread}
                        </span>
                        <Typography className="text-xs text-purple-600">непрочитанных</Typography>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )}

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
                            new Date(chat.lastActivity).toLocaleDateString("ru-RU")}
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
                              hasUnread ? "font-semibold text-gray-900" : "text-gray-600"
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
                          <Typography className="text-xs text-red-600">непрочитанных</Typography>
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
