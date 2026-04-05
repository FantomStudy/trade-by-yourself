"use client";

import type { SupportMessage } from "@/lib/support-chat";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCurrentUser } from "@/api/hooks";
import { Button } from "@/components/ui/Button";
import {
  addSupportMessage,
  getSupportMessages,
  markSupportMessagesAsRead,
} from "@/lib/support-chat";
import styles from "./page.module.css";

const SupportChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<SupportMessage[]>(() => getSupportMessages());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    // Помечаем сообщения как прочитанные для пользователя
    markSupportMessagesAsRead(true);

    const handleUpdate = () => {
      setMessages(getSupportMessages());
    };

    window.addEventListener("supportMessageAdded", handleUpdate);
    window.addEventListener("supportMessagesRead", handleUpdate);

    return () => {
      window.removeEventListener("supportMessageAdded", handleUpdate);
      window.removeEventListener("supportMessagesRead", handleUpdate);
    };
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;

    addSupportMessage(message.trim(), true, currentUser?.id, currentUser?.fullName);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatContainer}>
      {/* Шапка */}
      <div className={styles.header}>
        <Link href="/profile/messages" className={styles.backButton}>
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="flex flex-1 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
            <MessageSquare className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold">Техническая поддержка</h2>
            <p className="text-xs text-gray-500">Команда поддержки</p>
          </div>
        </div>
      </div>

      {/* Сообщения */}
      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">Начните диалог</h3>
            <p className="text-sm text-gray-600">Задайте вопрос нашей команде поддержки</p>
          </div>
        ) : (
          <div className={styles.messagesList}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageWrapper} ${
                  msg.isFromUser ? styles.myMessage : styles.theirMessage
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
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Форма отправки */}
      <div className={styles.inputContainer}>
        <textarea
          className={styles.textarea}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Напишите сообщение..."
          rows={1}
        />
        <Button className={styles.sendButton} disabled={!message.trim()} onClick={handleSend}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SupportChatPage;
