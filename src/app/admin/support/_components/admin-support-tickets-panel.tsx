"use client";

import { CheckCheck, Image as ImageIcon, MessageSquare, Send } from "lucide-react";
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
import { fixMojibake } from "@/lib/fix-mojibake";
import {
  SUPPORT_CENTER_NAME,
  formatSupportMessagePreview,
  isImageMessage,
} from "@/lib/support-display";
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
  const [readTicketIds, setReadTicketIds] = useState<Set<number>>(new Set());
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedIdRef = useRef<number | null>(null);
  const unmountedRef = useRef(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedId) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Изображение не должно превышать 5 МБ");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        const dataUrl = reader.result;
        setSending(true);
        try {
          await sendSupportTicketMessage(selectedId, dataUrl);
          await loadMessages(selectedId);
          scrollToBottom();
          await refreshTickets();
        } catch (error) {
          toast.error(getApiErrorMessage(error, "Не удалось отправить изображение"));
        } finally {
          setSending(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsDataURL(file);
  };

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
    if (!ws) return;
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

    ws.onerror = () => {
      try { ws.close(); } catch {}
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
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = messagesContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedId, scrollToBottom]);

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
    setReadTicketIds((prev) => new Set(prev).add(ticketId));
    setMessages([]);
    // Джойним WS-рум
    if (wsRef.current) tryJoin(wsRef.current);
    try {
      await loadMessages(ticketId);
      scrollToBottom();
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
      scrollToBottom();
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
    <div className="flex h-[calc(100vh-220px)] min-h-[520px] flex-col overflow-hidden rounded-lg border border-purple-200 bg-white shadow-sm">
      <div className="flex-shrink-0 border-b p-4">
        <Typography className="text-lg font-semibold">Техническая поддержка</Typography>
        <Typography className="text-sm text-gray-500">
          Пользователь видит ответы как «{SUPPORT_CENTER_NAME}». Слева — реальные имена для работы оператора.
        </Typography>
      </div>

      <div className="grid flex-1 min-h-0 overflow-hidden md:grid-cols-[280px_1fr]">
        {/* Список тикетов */}
        <div className="h-full overflow-y-auto border-r">
          {tickets.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">Обращений пока нет</p>
          ) : (
            tickets.map((ticket) => {
              const unread = readTicketIds.has(ticket.id) ? 0 : (ticket.unreadCount ?? 0);
              const lastMsgIsStaff = ticket.lastMessage
                ? isSupportStaff((ticket.lastMessage.author as any)?.role?.name) ||
                  ticket.lastMessage.authorId !== ticket.userId
                : false;

              return (
                <button
                  key={ticket.id}
                  type="button"
                  className={`block w-full border-b p-3 text-left transition-colors hover:bg-gray-50 ${
                    selectedId === ticket.id ? "bg-purple-50" : ""
                  }`}
                  onClick={() => void openTicket(ticket.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare className="h-4 w-4 shrink-0 text-purple-600" />
                      <span className="truncate font-medium text-sm text-gray-900">
                        {ticket.user?.fullName ?? "Пользователь"}
                      </span>
                    </div>
                    {unread > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-purple-600 px-1.5 text-[11px] font-bold text-white shadow-sm">
                        {unread}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-1 text-xs text-gray-500">
                    <p className="truncate flex items-center gap-1 min-w-0 flex-1">
                      {lastMsgIsStaff && (
                        <CheckCheck className="inline h-3.5 w-3.5 shrink-0 text-blue-500" />
                      )}
                      <span className="truncate">
                        {formatSupportMessagePreview(ticket.lastMessage?.text) || fixMojibake(ticket.subject)}
                      </span>
                    </p>
                    <span className="shrink-0 text-[10px] text-gray-400">
                      {ticket.status}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Переписка */}
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          {selectedId == null ? (
            <p className="p-6 text-sm text-gray-500">Выберите обращение слева</p>
          ) : (
            <>
              <div ref={messagesContainerRef} className={`${styles.messagesContainer} min-h-0 flex-1 overflow-y-auto`}>
                <div className={styles.messagesList}>
                  {messages.map((msg) => {
                    const fromStaff = isSupportStaff(msg.author?.role?.name);
                    const isImg = isImageMessage(msg.text);
                    return (
                      <div
                        key={msg.id}
                        className={`${styles.messageWrapper} ${fromStaff ? styles.myMessage : styles.theirMessage}`}
                      >
                        <div className={styles.message}>
                          <p className="text-xs text-gray-500">{msg.author?.fullName}</p>
                          {isImg ? (
                            <a
                              href={msg.text}
                              target="_blank"
                              rel="noreferrer"
                              className="block max-w-xs overflow-hidden rounded-lg my-1"
                            >
                              <img
                                src={msg.text}
                                alt="Вложение"
                                className="max-h-60 rounded-lg object-contain bg-black/5"
                              />
                            </a>
                          ) : (
                            <p className={styles.messageContent}>{fixMojibake(msg.text)}</p>
                          )}
                          <div className={styles.messageTime}>
                            <span>
                              {new Date(msg.sentAt).toLocaleTimeString("ru-RU", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {fromStaff && (
                              <CheckCheck className="inline h-3.5 w-3.5 shrink-0 text-white/90" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={styles.inputContainer}>
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
                  disabled={sending}
                  className={styles.attachButton}
                  title="Прикрепить изображение"
                >
                  <ImageIcon className="h-5 w-5" />
                </button>
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
