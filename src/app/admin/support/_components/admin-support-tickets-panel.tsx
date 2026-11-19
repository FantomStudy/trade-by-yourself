"use client";

import { CheckCheck, Image as ImageIcon, MessageSquare, Plus, Search, Send, User as UserIcon, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Typography,
} from "@/components/ui";
import { Button } from "@/components/ui/Button";
import {
  findAllUsers,
  getAllSupportTickets,
  getSupportTicket,
  markSupportTicketRead,
  sendSupportTicketMessage,
  startAdminSupportTicket,
} from "@/lib/api/requests";
import type { SupportTicket, SupportTicketMessage } from "@/lib/api/requests";
import type { User } from "@/types";
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

  // Состояние диалога создания нового чата
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserForChat, setSelectedUserForChat] = useState<User | null>(null);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [startingChat, setStartingChat] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedIdRef = useRef<number | null>(null);
  const unmountedRef = useRef(false);
  const lastMsgCountRef = useRef(0);

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
          scrollToBottom(true);
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
    if (!unmountedRef.current) {
      setMessages(ticket.messages ?? []);
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, unreadCount: 0 } : t))
      );
    }
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

  // Скролл вниз (force=true — всегда принудительно, иначе только если пользователь уже внизу)
  const scrollToBottom = useCallback((force = false) => {
    requestAnimationFrame(() => {
      const el = messagesContainerRef.current;
      if (!el) return;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
      if (force || isAtBottom) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    const isFirst = lastMsgCountRef.current === 0 && messages.length > 0;
    if (messages.length !== lastMsgCountRef.current) {
      lastMsgCountRef.current = messages.length;
      scrollToBottom(isFirst);
    }
  }, [messages, scrollToBottom]);

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
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, unreadCount: 0 } : t))
    );
    lastMsgCountRef.current = 0;
    setMessages([]);
    // Джойним WS-рум
    if (wsRef.current) tryJoin(wsRef.current);
    try {
      void markSupportTicketRead(ticketId).catch(() => {});
      await loadMessages(ticketId);
      scrollToBottom(true);
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
      scrollToBottom(true);
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

  // Загрузка пользователей при открытии модалки создания чата
  useEffect(() => {
    if (isNewChatOpen && allUsers.length === 0) {
      setUsersLoading(true);
      void findAllUsers()
        .then((data) => {
          if (!unmountedRef.current) setAllUsers(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          toast.error("Не удалось загрузить список пользователей");
        })
        .finally(() => {
          if (!unmountedRef.current) setUsersLoading(false);
        });
    }
  }, [isNewChatOpen, allUsers.length]);

  // Поиск пользователей по имени, номеру телефона, email, ID
  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return allUsers.slice(0, 30);
    return allUsers
      .filter((u) => {
        const name = (u.fullName ?? "").toLowerCase();
        const phone = (u.phoneNumber ?? "").toLowerCase();
        const email = (u.email ?? "").toLowerCase();
        const idStr = String(u.id);
        return name.includes(q) || phone.includes(q) || email.includes(q) || idStr === q;
      })
      .slice(0, 50);
  }, [allUsers, userSearch]);

  const handleStartChatWithUser = async (targetUser: User, msgText?: string) => {
    if (startingChat) return;
    setStartingChat(true);
    try {
      // Ищем, есть ли уже активный тикет в текущем списке тикетов
      const existing = tickets.find(
        (t) => t.userId === targetUser.id && t.status !== "CLOSED"
      );

      // Если чат уже есть и нет начального сообщения — просто открываем его
      if (existing && !msgText?.trim()) {
        setIsNewChatOpen(false);
        setSelectedUserForChat(null);
        setUserSearch("");
        setNewChatMessage("");
        await openTicket(existing.id);
        toast.info(`Открыт чат с ${targetUser.fullName || targetUser.phoneNumber}`);
        return;
      }

      // Вызываем бэкенд: создаст новый тикет или использует существующий + отправит сообщение
      const res = await startAdminSupportTicket({
        userId: targetUser.id,
        message: msgText?.trim() || undefined,
      });

      setIsNewChatOpen(false);
      setSelectedUserForChat(null);
      setUserSearch("");
      setNewChatMessage("");

      await refreshTickets();
      if (res?.id) {
        await openTicket(res.id);
        toast.success(
          existing
            ? "Сообщение отправлено, чат открыт"
            : `Чат с ${targetUser.fullName || targetUser.phoneNumber} открыт`
        );
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось начать чат"));
    } finally {
      setStartingChat(false);
    }
  };

  if (loading) {
    return <Typography className="text-gray-500">Загрузка обращений...</Typography>;
  }

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[520px] flex-col overflow-hidden rounded-lg border border-purple-200 bg-white shadow-sm">
      <div className="flex-shrink-0 border-b p-4 flex items-center justify-between gap-4">
        <div>
          <Typography className="text-lg font-semibold">Техническая поддержка</Typography>
          <Typography className="text-sm text-gray-500">
            Пользователь видит ответы как «{SUPPORT_CENTER_NAME}». Слева — реальные имена для работы оператора.
          </Typography>
        </div>
        <button
          type="button"
          onClick={() => setIsNewChatOpen(true)}
          className="shrink-0 hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Написать пользователю</span>
        </button>
      </div>

      <div className="grid flex-1 min-h-0 overflow-hidden md:grid-cols-[280px_1fr]">
        {/* Список тикетов */}
        <div className={`h-full overflow-y-auto border-r ${selectedId != null ? "hidden md:block" : "block"}`}>
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-gray-50/95 px-3 py-2 backdrop-blur">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Обращения</span>
            <button
              type="button"
              onClick={() => setIsNewChatOpen(true)}
              className="flex items-center gap-1 rounded bg-purple-600 px-2 py-1 text-xs font-medium text-white shadow-sm hover:bg-purple-700 transition-colors"
              title="Написать пользователю"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Написать</span>
            </button>
          </div>

          {tickets.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500 mb-2">Обращений пока нет</p>
              <button
                type="button"
                onClick={() => setIsNewChatOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800"
              >
                <Plus className="h-3.5 w-3.5" />
                Начать первый чат
              </button>
            </div>
          ) : (
            tickets.map((ticket) => {
              const unread = (selectedId === ticket.id || readTicketIds.has(ticket.id)) ? 0 : (ticket.unreadCount ?? 0);
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
        <div className={`flex h-full min-h-0 flex-col overflow-hidden ${selectedId == null ? "hidden md:flex" : "flex"}`}>
          {selectedId != null && (
            <div className="flex md:hidden items-center gap-2 border-b p-2 bg-gray-50">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="flex items-center gap-1 text-sm font-semibold text-purple-700 hover:text-purple-900"
              >
                ← Назад к обращениям
              </button>
            </div>
          )}
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

      {/* Модальное окно выбора пользователя и начала чата */}
      <Dialog
        open={isNewChatOpen}
        onOpenChange={(open) => {
          setIsNewChatOpen(open);
          if (!open) {
            setSelectedUserForChat(null);
            setUserSearch("");
            setNewChatMessage("");
          }
        }}
      >
        <DialogContent className="max-w-lg p-0 overflow-hidden sm:rounded-xl">
          <div className="border-b p-4 pb-3">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-900">
                Написать пользователю
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 mt-1">
                Найдите пользователя по имени, телефону или email. Если чат с ним уже существует, откроется текущая переписка.
              </DialogDescription>
            </DialogHeader>

            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Поиск по имени, номеру телефона, email..."
                className="w-full rounded-lg border border-gray-200 pl-9 pr-9 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                autoFocus
              />
              {userSearch && (
                <button
                  type="button"
                  onClick={() => setUserSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Список найденных пользователей */}
          <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100">
            {usersLoading ? (
              <div className="p-8 text-center text-sm text-gray-500">Загрузка пользователей...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                {userSearch ? "Пользователи не найдены" : "Список пользователей пуст"}
              </div>
            ) : (
              filteredUsers.map((user) => {
                const existing = tickets.find(
                  (t) => t.userId === user.id && t.status !== "CLOSED"
                );
                const isSelected = selectedUserForChat?.id === user.id;

                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      if (selectedUserForChat?.id === user.id) {
                        setSelectedUserForChat(null);
                      } else {
                        setSelectedUserForChat(user);
                      }
                    }}
                    className={`flex items-center justify-between p-3 cursor-pointer transition-colors hover:bg-purple-50/60 ${
                      isSelected ? "bg-purple-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {user.photo ? (
                        <img
                          src={user.photo}
                          alt={user.fullName || "Аватар"}
                          className="h-10 w-10 rounded-full object-cover shrink-0 bg-gray-100 border border-gray-200"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                          {(user.fullName?.[0] || user.phoneNumber?.[1] || "U").toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium text-sm text-gray-900">
                            {user.fullName || "Без имени"}
                          </p>
                          {existing && (
                            <span className="shrink-0 rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700 border border-green-200">
                              Есть чат
                            </span>
                          )}
                        </div>
                        <p className="truncate text-xs text-gray-500">
                          {user.phoneNumber} {user.email ? `• ${user.email}` : ""}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={startingChat}
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleStartChatWithUser(user);
                      }}
                      className={`shrink-0 ml-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        existing
                          ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
                      }`}
                    >
                      {existing ? "Открыть чат" : "Начать чат"}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Панель ввода первого сообщения (если выбран конкретный пользователь) */}
          {selectedUserForChat && (
            <div className="border-t bg-gray-50/90 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600 font-medium">
                  Сообщение для:{" "}
                  <span className="text-purple-700 font-semibold">
                    {selectedUserForChat.fullName || selectedUserForChat.phoneNumber}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedUserForChat(null)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Снять выбор
                </button>
              </div>
              <textarea
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                placeholder="Текст первого сообщения (необязательно, можно отправить сразу в чате)..."
                rows={2}
                className="w-full rounded-md border border-gray-200 p-2 text-xs focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForChat(null)}
                  disabled={startingChat}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={() => void handleStartChatWithUser(selectedUserForChat, newChatMessage)}
                  disabled={startingChat}
                  className="rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-purple-700 disabled:opacity-50"
                >
                  {startingChat ? "Открытие..." : "Перейти в чат"}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
