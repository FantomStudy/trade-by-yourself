"use client";

import { ArrowLeft, Headphones, Send } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import {
  createSupportTicket,
  getMySupportTickets,
  getSupportTicket,
  sendSupportTicketMessage,
} from "@/lib/api/requests";
import type { SupportTicketMessage } from "@/lib/api/requests";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { SUPPORT_CENTER_NAME, isSupportStaffRole, supportAuthorLabel } from "@/lib/support-display";
import {
  createSupportSocket,
  parseSupportSocketMessage,
  sendSupportSocketEvent,
} from "@/lib/support-socket";

import styles from "./page.module.css";

const SupportChatPage = () => {
  const [message, setMessage] = useState("");
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [messages, setMessages] = useState<SupportTicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ticketIdRef = useRef<number | null>(null);
  const isUnmountedRef = useRef(false);

  // Скролл внутри контейнера сообщений (не всей страницы)
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
    }
  }, []);

  const loadTicket = useCallback(async (id: number) => {
    const ticket = await getSupportTicket(id);
    setTicketId(ticket.id);
    ticketIdRef.current = ticket.id;
    setMessages(ticket.messages ?? []);
  }, []);

  // --- WebSocket ---
  const wsJoinTicket = useCallback((ws: WebSocket, id: number) => {
    if (ws.readyState === WebSocket.OPEN) {
      sendSupportSocketEvent(ws, "joinTicket", { ticketId: id });
    }
  }, []);

  const connectWS = useCallback(() => {
    if (isUnmountedRef.current) return;
    const ws = createSupportSocket();
    wsRef.current = ws;

    ws.onopen = () => {
      if (ticketIdRef.current) wsJoinTicket(ws, ticketIdRef.current);
    };

    ws.onmessage = (event) => {
      const packet = parseSupportSocketMessage(event.data as string);
      if (!packet) return;
      if (packet.event === "newSupportMessage") {
        const payload = packet.data as { ticketId: number; message: SupportTicketMessage };
        if (payload?.message) {
          setMessages((prev) => {
            // Дедупликация по id
            if (prev.some((m) => m.id === payload.message.id)) return prev;
            return [...prev, payload.message];
          });
        }
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      if (!isUnmountedRef.current) {
        reconnectTimerRef.current = setTimeout(connectWS, 2000);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [wsJoinTicket]);

  // Запускаем WS при монтировании
  useEffect(() => {
    isUnmountedRef.current = false;
    connectWS();
    return () => {
      isUnmountedRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connectWS]);

  // Когда ticketId меняется — джойним новый тикет
  useEffect(() => {
    if (ticketId && wsRef.current?.readyState === WebSocket.OPEN) {
      wsJoinTicket(wsRef.current, ticketId);
    }
  }, [ticketId, wsJoinTicket]);

  // Начальная загрузка
  useEffect(() => {
    void (async () => {
      try {
        const list = await getMySupportTickets();
        const open = list.tickets.find((t) => t.status === "OPEN" || t.status === "IN_PROGRESS");
        if (open) await loadTicket(open.id);
      } catch (error) {
        console.warn("Support tickets load:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [loadTicket]);

  // Скролл при новых сообщениях
  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages, scrollToBottom]);

  // --- Отправка ---
  const handleSend = async () => {
    const text = message.trim();
    if (!text || sending) return;
    setSending(true);
    // Оптимистичное: очищаем ввод сразу
    setMessage("");
    try {
      if (ticketId == null) {
        const created = await createSupportTicket(text);
        await loadTicket(created.id);
        // WS подключится автоматически в useEffect выше
      } else {
        await sendSupportTicketMessage(ticketId, text);
        // WS доставит сообщение, но если нет связи — перезагружаем вручную
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          await loadTicket(ticketId);
        }
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось отправить сообщение"));
      // Вернём текст в поле если ошибка
      setMessage(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <Link href="/profile/messages" className={styles.backButton}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-1 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
            <Headphones className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold">{SUPPORT_CENTER_NAME}</h2>
            <p className="text-xs text-gray-500">
              Ответы приходят от единого центра, не от личного профиля сотрудника
            </p>
          </div>
        </div>
      </div>

      <div ref={messagesContainerRef} className={styles.messagesContainer}>
        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">Загрузка...</div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <Headphones className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">Обращение в {SUPPORT_CENTER_NAME}</h3>
            <p className="text-sm text-gray-600">
              Опишите проблему — ответ появится здесь, в этом же чате
            </p>
          </div>
        ) : (
          <div className={styles.messagesList}>
            {messages.map((msg) => {
              const fromStaff = isSupportStaffRole(msg.author?.role?.name);
              const isFromUser = !fromStaff;
              const authorLabel = supportAuthorLabel(msg.author?.role?.name, msg.author?.fullName);
              return (
                <div
                  key={msg.id}
                  className={`${styles.messageWrapper} ${isFromUser ? styles.myMessage : styles.theirMessage}`}
                >
                  <div className={styles.message}>
                    {!isFromUser ? (
                      <p className="mb-1 text-xs font-medium text-purple-700">{authorLabel}</p>
                    ) : null}
                    <p className={styles.messageContent}>{msg.text}</p>
                    <span className={styles.messageTime}>
                      {new Date(msg.sentAt).toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className={styles.inputContainer}>
        <textarea
          className={styles.textarea}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Напишите сообщение в поддержку..."
          rows={1}
        />
        <Button
          className={styles.sendButton}
          disabled={!message.trim() || sending}
          onClick={() => void handleSend()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SupportChatPage;
