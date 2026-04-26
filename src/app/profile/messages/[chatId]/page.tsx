"use client";

import type { ChangeEvent, KeyboardEvent } from "react";
import type { ChatMessage } from "@/api/chats";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { getChatById, getChatMessages } from "@/api/chats";
import { Button } from "@/components/ui";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatPrice } from "@/lib/format";
import styles from "./page.module.css";

interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

const ChatPage = ({ params }: ChatPageProps) => {
  const { chatId } = use(params);
  const chatIdNum = Number(chatId);
  const isValidChatId = Number.isInteger(chatIdNum) && chatIdNum > 0;

  const [message, setMessage] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: currentUser } = useCurrentUser();
  const { data: chat, isLoading: isChatLoading } = useQuery({
    enabled: isValidChatId,
    queryFn: () => getChatById(chatIdNum),
    queryKey: ["chat", chatIdNum],
  });
  const { data: messagesData, isLoading: isMessagesLoading } = useQuery({
    enabled: isValidChatId,
    queryFn: () => getChatMessages(chatIdNum),
    queryKey: ["chat", chatIdNum, "messages"],
  });

  // Используем messagesData напрямую и обновляем с помощью useState для новых сообщений
  const [newMessages, setNewMessages] = useState<ChatMessage[]>([]);
  const allMessages = useMemo(() => {
    const merged = [...(messagesData?.messages ?? []), ...newMessages];
    const knownIds = new Set<number>();

    return merged.filter((msg) => {
      if (knownIds.has(msg.id)) {
        return false;
      }

      knownIds.add(msg.id);
      return true;
    });
  }, [messagesData?.messages, newMessages]);

  const handleSend = () => {
    const content = message.trim();

    if (content) {
      console.log("Отправка сообщения:", {
        chatId: chatIdNum,
        content,
      });

      const localMessage: ChatMessage = {
        chatId: chatIdNum,
        content,
        createdAt: new Date().toISOString(),
        id: Date.now(),
        isFromMe: true,
        isRead: false,
        sender: currentUser
          ? {
              fullName: currentUser.fullName,
              id: currentUser.id,
            }
          : null,
        senderId: currentUser?.id,
      };

      setNewMessages((prev) => [...prev, localMessage]);
      setMessage("");
    } else {
      console.warn("Невозможно отправить сообщение:", {
        hasMessage: !!content,
      });
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleShowPhone = () => {
    setShowPhone((prev) => !prev);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  if (isChatLoading || isMessagesLoading) {
    return (
      <div className={styles.loadingState}>
        <p className={styles.loadingText}>Загрузка...</p>
      </div>
    );
  }

  if (!chat || !messagesData) {
    return (
      <div className={styles.loadingState}>
        <p className={styles.loadingText}>Чат не найден</p>
      </div>
    );
  }

  const messages = allMessages;
  const otherUser = chat.companion || chat.otherUser;
  const otherUserPhone = chat.otherUser?.phoneNumber;

  return (
    <div className={styles.page}>
      {/* Хедер чата */}
      <div className={styles.header}>
        <Link href="/profile/messages" className={styles.backButton}>
          <ArrowLeft className={styles.backIcon} />
        </Link>

        <div className={styles.productInfo}>
          <div className={styles.productImage}>
            {chat.product.image && (
              <Image
                alt={chat.product.name}
                className={styles.productImageItem}
                width={48}
                height={48}
                src={chat.product.image}
              />
            )}
          </div>
          <div className={styles.productDetails}>
            <h1 className={styles.productName}>{chat.product.name}</h1>
            <p className={styles.productPrice}>{formatPrice(chat.product.price)}</p>
          </div>
        </div>

        <Button className={styles.showPhoneButton} onClick={handleShowPhone}>
          {showPhone && otherUserPhone ? otherUserPhone : "Показать номер"}
        </Button>
      </div>

      {/* Область сообщений */}
      <div className={styles.messagesArea}>
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
            <div
              key={msg.id}
              className={`${styles.messageWrapper} ${isCurrentUser ? styles.messageWrapperOwn : styles.messageWrapperOther}`}
            >
              <div
                className={`${styles.messageContent} ${isCurrentUser ? styles.messageContentOwn : styles.messageContentOther}`}
              >
                {/* Аватар и имя отправителя для чужих сообщений */}
                {!isCurrentUser && (
                  <div className={styles.senderInfo}>
                    <div className={styles.senderAvatar}>{senderInitials}</div>
                    <span className={styles.senderName}>{sender?.fullName}</span>
                  </div>
                )}

                {/* Имя для своих сообщений */}
                {isCurrentUser && (
                  <span className={`${styles.senderName} ${styles.senderNameOwn}`}>
                    {sender?.fullName}
                  </span>
                )}

                {/* Сообщение */}
                <div
                  className={`${styles.messageBubble} ${
                    isCurrentUser ? styles.messageBubbleOwn : styles.messageBubbleOther
                  }`}
                >
                  <p className={styles.messageText}>{messageText}</p>
                </div>

                {/* Время и статус */}
                <div className={styles.messageStatus}>
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
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <textarea
            className={styles.textarea}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyPress}
            placeholder="Сообщение"
            rows={1}
          />
          <Button className={styles.sendButton} disabled={!message.trim()} onClick={handleSend}>
            <Send className={styles.sendIcon} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
