"use client";

import type { SupportMessage } from "@/api/chats";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  addSupportMessage,
  getSupportMessages,
  markSupportMessagesAsRead,
} from "@/api/chats";
import { Button } from "@/components/ui";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import styles from "./page.module.css";

const SupportChatPage = () => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  const { data: messages = [] } = useQuery<SupportMessage[]>({
    queryKey: ["supportMessages"],
    queryFn: getSupportMessages,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (payload: { content: string; userId?: number; userName?: string }) =>
      addSupportMessage(payload.content, true, payload.userId, payload.userName),
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["supportMessages"] });
    },
  });

  useEffect(() => {
    markSupportMessagesAsRead(true);
    queryClient.invalidateQueries({ queryKey: ["supportMessages"] });

    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["supportMessages"] });
    };

    window.addEventListener("supportMessageAdded", handleUpdate);
    window.addEventListener("supportMessagesRead", handleUpdate);

    return () => {
      window.removeEventListener("supportMessageAdded", handleUpdate);
      window.removeEventListener("supportMessagesRead", handleUpdate);
    };
  }, [queryClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const content = message.trim();
    if (!content) {
      return;
    }

    sendMessageMutation.mutate({
      content,
      userId: currentUser?.id,
      userName: currentUser?.fullName,
    });
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
          <ArrowLeft className={styles.backIcon} />
        </Link>

        <div className={styles.headerContent}>
          <div className={styles.supportAvatar}>
            <MessageSquare className={styles.supportIcon} />
          </div>
          <div className={styles.headerText}>
            <h2 className={styles.title}>Техническая поддержка</h2>
            <p className={styles.subtitle}>Команда поддержки</p>
          </div>
        </div>
      </div>

      {/* Сообщения */}
      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrap}>
              <MessageSquare className={styles.emptyIcon} />
            </div>
            <h3 className={styles.emptyTitle}>Начните диалог</h3>
            <p className={styles.emptyDescription}>Задайте вопрос нашей команде поддержки</p>
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
          onKeyDown={handleKeyPress}
          placeholder="Напишите сообщение..."
          rows={1}
        />
        <Button
          className={styles.sendButton}
          disabled={!message.trim() || sendMessageMutation.isPending}
          onClick={handleSend}
        >
          <Send className={styles.sendIcon} />
        </Button>
      </div>
    </div>
  );
};

export default SupportChatPage;
