"use client";

import { MessageSquare, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import {
  getAllSupportTickets,
  getSupportTicket,
  sendSupportTicketMessage,
} from "@/lib/api/requests";
import type { SupportTicket, SupportTicketMessage } from "@/lib/api/requests";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { SUPPORT_CENTER_NAME } from "@/lib/support-display";
import {
  createSupportSocket,
  parseSupportSocketMessage,
  sendSupportSocketEvent,
} from "@/lib/support-socket";

import styles from "../support.module.css";

const POLL_MS = 2000;
const MOD_ROLES = new Set(["SENIOR_MODERATOR", "ADMIN", "SUPERADMIN", "MODERATOR"]);

function isSupportStaff(role?: string | null) {
  return role != null && MOD_ROLES.has(role);
}

export function AdminSupportTicketsPanel() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<SupportTicketMessage[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedIdRef = useRef<number | null>(null);
  const unmountedRef = useRef(false);

  const refreshTickets = useCallback(async () => {
    const data = await getAllSupportTickets();
    if (!unmountedRef.current) setTickets(data.tickets ?? []);
  }, []);

  const loadMessages = useCallback(async (ticketId: number) => {
    const ticket = await getSupportTicket(ticketId);
    if (!unmountedRef.current) setMessages(ticket.messages ?? []);
  }, []);

  // Мёрж новых WS-сообщений
  const mergeMessage = useCallback((msg: SupportTicketMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }, []);

  // --- WebSocket ---
  const tryJoin = useCallback((ws: WebSocket) => {
    if (ws.readyState === WebSocket.OPEN && selectedIdRef.current) {
      sendSupportSocketEvent(ws, "joinTicket", { ticketId: selectedIdRef.current });
    }
  }, []);

  const connectWS = useCallback(() => {
    if (unmountedRef.current) return;
    const ws = createSupportSocket();
    wsRef.current = ws;

    ws.onopen = () => tryJoin(ws);

    ws.onmessage = (event) => {
      const packet = parseSupportSocketMessage(event.data as string);
      if (!packet) return;
      if (packet.event === "newSupportMessage") {
        const payload = packet.data as { ticketId: number; message: SupportTicketMessage };
        if (payload?.message) mergeMessage(payload.message);
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      if (!unmountedRef.current) reconnectRef.current = setTimeout(connectWS, 2500);
    };

    ws.onerror = () => ws.close();
  }, [tryJoin, mergeMessage]);

  useEffect(() => {
    unmountedRef.current = false;
    connectWS();
    return () => {
      unmountedRef.current = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connectWS]);

  // Скролл вниз при новых сообщениях (только контейнер, не вся страница)
  useEffect(() => {
    requestAnimationFrame(() => {
      const el = messagesContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, [messages]);

  // Начальная загрузка
  useEffect(() => {
    void (async () => {
      try {
        await refreshTickets();
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Не удалось загрузить обращения"));
      } finally {
        if (!unmountedRef.current) setLoading(false);
      }
    })();
  }, [refreshTickets]);

  // Polling тикетов (каждые 15 сек — список не так критичен)
  useEffect(() => {
    const interval = setInterval(() => {
      void refreshTickets().catch(() => {});
    }, 15_000);
    return () => clearInterval(interval);
  }, [refreshTickets]);

  // Polling сообщений выбранного тикета (каждые 4 сек)
  useEffect(() => {
    if (!selectedId) return;
    const interval = setInterval(() => {
      void loadMessages(selectedId).catch(() => {});
    }, POLL_MS);
    return () => clearInterval(interval);
  }, [selectedId, loadMessages]);

  const openTicket = async (ticketId: number) => {
    selectedIdRef.current = ticketId;
    setSelectedId(ticketId);
    setMessages([]);
    // Джойним WS-рум
    if (wsRef.current) tryJoin(wsRef.current);
    try {
      await loadMessages(ticketId);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось открыть обращение"));
    }
  };

  const handleReply = async () => {
    if (selectedId == null || !reply.trim() || sending) return;
    setSending(true);
    const text = reply.trim();
    setReply("");
    try {
      await sendSupportTicketMessage(selectedId, text);
      // Мгновенная перезагрузка после отправки
      await loadMessages(selectedId);
      await refreshTickets();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось отправить ответ"));
      setReply(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleReply();
    }
  };

  if (loading) {
    return <Typography className="text-gray-500">Загрузка обращений...</Typography>;
  }

  return (
    <div className="rounded-lg border border-purple-200 bg-white shadow-sm">
      <div className="border-b p-4">
        <Typography className="text-lg font-semibold">Техническая поддержка</Typography>
        <Typography className="text-sm text-gray-500">
          Пользователь видит ответы как «{SUPPORT_CENTER_NAME}». Слева — реальные имена для работы оператора.
        </Typography>
      </div>

      <div className="grid gap-0 md:grid-cols-[280px_1fr]">
        {/* Список тикетов */}
        <div className="max-h-[480px] overflow-y-auto border-r">
          {tickets.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">Обращений пока нет</p>
          ) : (
            tickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                className={`block w-full border-b p-3 text-left hover:bg-gray-50 ${
                  selectedId === ticket.id ? "bg-purple-50" : ""
                }`}
                onClick={() => void openTicket(ticket.id)}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                  <span className="truncate font-medium">{ticket.user?.fullName ?? "Пользователь"}</span>
                </div>
                <p className="mt-1 truncate text-xs text-gray-500">{ticket.subject}</p>
                <p className="text-xs text-gray-400">{ticket.status}</p>
              </button>
            ))
          )}
        </div>

        {/* Переписка */}
        <div className="flex min-h-[320px] flex-col">
          {selectedId == null ? (
            <p className="p-6 text-sm text-gray-500">Выберите обращение слева</p>
          ) : (
            <>
              <div ref={messagesContainerRef} className={`${styles.messagesContainer} flex-1`}>
                <div className={styles.messagesList}>
                  {messages.map((msg) => {
                    const fromStaff = isSupportStaff(msg.author?.role?.name);
                    return (
                      <div
                        key={msg.id}
                        className={`${styles.messageWrapper} ${fromStaff ? styles.myMessage : styles.theirMessage}`}
                      >
                        <div className={styles.message}>
                          <p className="text-xs text-gray-500">{msg.author?.fullName}</p>
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
                </div>
              </div>
              <div className={styles.inputContainer}>
                <textarea
                  className={styles.textarea}
                  placeholder={`Ответ от имени «${SUPPORT_CENTER_NAME}»...`}
                  rows={2}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button disabled={!reply.trim() || sending} onClick={() => void handleReply()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
