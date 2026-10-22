"use client";

import type { Message as SocketMessage } from "@/lib/contexts/chat";
import type { Message } from "@/types";

import { ArrowLeft, Flag, ImageIcon, Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { useChat, useChatMessages, useCurrentUser } from "@/lib/api/hooks";
import { useChatSocket } from "@/lib/contexts";
import { MODERATION_CENTER_NAME, SUPPORT_CENTER_NAME } from "@/lib/support-display";
import { resolveChatTitle } from "@/lib/chat-title";
import { toCurrency } from "@/lib/format";
import { ReportUserDialog } from "@/components/ReportUserDialog";

const ChatPage = () => {
  const params = useParams<{ chatId: string }>();
  const chatIdNum = Number(params?.chatId);

  const [message, setMessage] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: currentUser } = useCurrentUser();
  const { data: chat, isLoading: isChatLoading } = useChat(chatIdNum);
  const { data: messagesData, isLoading: isMessagesLoading } = useChatMessages(chatIdNum);
  const {
    isConnected,
    joinChat,
    leaveChat,
    markAsRead,
    sendMessage: sendSocketMessage,
    sendTyping,
    socket,
  } = useChatSocket();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Изображение не должно превышать 5 МБ");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        sendSocketMessage(chatIdNum, reader.result);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  // Используем messagesData напрямую и обновляем с помощью useState для новых сообщений
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const allMessages = useMemo(
    () => [...(messagesData?.messages || []), ...newMessages],
    [messagesData?.messages, newMessages],
  );

  // Подключение к чату и подписка на события
  useEffect(() => {
    if (!socket || !isConnected || !chatIdNum) return;

    console.log("Joining chat:", chatIdNum);
    joinChat(chatIdNum);
    markAsRead(chatIdNum);

    // Обработчик новых сообщений
    const handleNewMessage = (data: SocketMessage) => {
      console.log("Received newMessage event:", data);
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
        console.log("Adding new message to state:", newMessage);
        setNewMessages((prev) => [...prev, newMessage]);

        // Помечаем как прочитанное только если это сообщение от собеседника
        if (!isMyMessage) {
          markAsRead(chatIdNum);
        }
      }
    };

    // Обработчик индикатора печати
    const handleUserTyping = (data: { chatId: number; isTyping: boolean; userId: number }) => {
      if (data.chatId === chatIdNum && data.userId !== currentUser?.id) {
        setOtherUserTyping(data.isTyping);
      }
    };

    // Обработчик прочитанных сообщений
    const handleMessagesRead = (data: { chatId: number; readBy: number }) => {
      if (data.chatId === chatIdNum) {
        setNewMessages((prev) =>
          prev.map((msg) => (msg.senderId === currentUser?.id ? { ...msg, isRead: true } : msg)),
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
  }, [socket, isConnected, chatIdNum, currentUser?.id, joinChat, leaveChat, markAsRead]);

  const handleSend = () => {
    if (message.trim() && isConnected) {
      console.log("Sending message:", {
        chatId: chatIdNum,
        content: message.trim(),
        isConnected,
      });
      sendSocketMessage(chatIdNum, message.trim());
      setMessage("");
      sendTyping(chatIdNum, false);
    } else {
      console.warn("Cannot send message:", {
        hasMessage: !!message.trim(),
        isConnected,
      });
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
  const isModerationChat = chat.isModerationChat === true;
  const headerTitle = isModerationChat
    ? MODERATION_CENTER_NAME
    : resolveChatTitle(chat.product?.name, otherUser?.fullName);
  const companionName = isModerationChat ? MODERATION_CENTER_NAME : otherUser?.fullName;

  return (
    <div className="flex h-[calc(100vh-110px)] flex-col overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Хедер чата */}
      <div className="flex flex-shrink-0 items-center gap-4 bg-white px-4 py-3 shadow-sm">
        <Link href={"/profile/messages" as "/profile/messages"}>
          <Button className="h-10 w-10 p-0" variant="ghost">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          {!isModerationChat && chat.product?.image ? (
            <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-200">
              <img
                alt={chat.product.name}
                className="h-full w-full object-cover"
                src={chat.product.image}
              />
            </div>
          ) : null}
          <div>
            <h1 className="text-base font-semibold">{headerTitle}</h1>
            {isModerationChat ? (
              <p className="text-sm text-amber-700">Уведомления по объявлениям — не техподдержка</p>
            ) : chat.product?.price != null ? (
              <p className="text-sm text-blue-600">{toCurrency(chat.product.price)}</p>
            ) : null}
            {!isModerationChat && companionName ? (
              <p className="text-xs text-gray-500">{companionName}</p>
            ) : null}
          </div>
        </div>

        {!isModerationChat ? (
          <div className="ml-auto flex items-center gap-2">
            <Button className="bg-blue-500 px-4 hover:bg-blue-600" onClick={handleShowPhone}>
              {showPhone && otherUser?.phoneNumber ? otherUser.phoneNumber : "Показать номер"}
            </Button>
            {otherUser && (
              <Button
                variant="outline"
                size="sm"
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 border-gray-200"
                title="Пожаловаться на пользователя"
                onClick={() => setIsReportOpen(true)}
              >
                <Flag className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="ml-auto text-right">
            <Link href="/profile/messages/support" className="text-sm text-purple-600 hover:underline">
              Нужна {SUPPORT_CENTER_NAME}? →
            </Link>
          </div>
        )}
      </div>

      {/* Область сообщений */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-6">
        {messages.map((msg) => {
          const isCurrentUser = msg.isFromMe ?? msg.senderId === currentUser?.id;
          const sender = msg.sender || (isCurrentUser ? currentUser : otherUser);
          const senderInitials =
            sender?.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "??";

          const messageText = msg.content || msg.text || "";

          return (
            <div key={msg.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex max-w-[70%] flex-col gap-1 ${isCurrentUser ? "items-end" : "items-start"}`}
              >
                {/* Аватар и имя отправителя для чужих сообщений */}
                {!isCurrentUser && (
                  <div className="mb-1 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-medium text-white">
                      {senderInitials}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{sender?.fullName}</span>
                  </div>
                )}

                {/* Имя для своих сообщений */}
                {isCurrentUser && (
                  <span className="mr-2 text-sm font-medium text-gray-700">{sender?.fullName}</span>
                )}

                {/* Сообщение */}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    isCurrentUser ? "bg-blue-400 text-white" : "bg-white text-gray-800"
                  }`}
                >
                  {/^(https?:\/\/|\/uploads\/).*\.(png|jpg|jpeg|webp|gif)(\?.*)?$/i.test(messageText.trim()) ||
                  messageText.trim().startsWith("data:image/") ? (
                    <a href={messageText} target="_blank" rel="noreferrer" className="block max-w-xs overflow-hidden rounded-lg">
                      <img src={messageText} alt="Вложение" className="max-h-60 rounded-lg object-contain" />
                    </a>
                  ) : (
                    <p className="text-sm whitespace-pre-line">{messageText}</p>
                  )}
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
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-end gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-12 w-12 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            title="Прикрепить изображение"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
          <textarea
            className="flex-1 resize-none rounded-lg bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

      {otherUser && (
        <ReportUserDialog
          targetUserId={otherUser.id}
          targetUserName={otherUser.fullName}
          productId={chat.product?.id}
          open={isReportOpen}
          onOpenChange={setIsReportOpen}
        />
      )}
    </div>
  );
};

export default ChatPage;
