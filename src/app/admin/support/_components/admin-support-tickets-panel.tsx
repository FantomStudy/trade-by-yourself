"use client";

import { MessageSquare, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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

import styles from "../support.module.css";

const MOD_ROLES = new Set(["SENIOR_MODERATOR", "ADMIN", "SUPERADMIN"]);

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

  const refreshTickets = useCallback(async () => {
    const data = await getAllSupportTickets();
    setTickets(data.tickets ?? []);
  }, []);

  const loadMessages = useCallback(async (ticketId: number) => {
    const ticket = await getSupportTicket(ticketId);
    setMessages(ticket.messages ?? []);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        await refreshTickets();
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Не удалось загрузить обращения"));
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshTickets]);

  const openTicket = async (ticketId: number) => {
    setSelectedId(ticketId);
    try {
      await loadMessages(ticketId);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось открыть обращение"));
    }
  };

  const handleReply = async () => {
    if (selectedId == null || !reply.trim() || sending) return;
    setSending(true);
    try {
      await sendSupportTicketMessage(selectedId, reply.trim());
      setReply("");
      await loadMessages(selectedId);
      await refreshTickets();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось отправить ответ"));
    } finally {
      setSending(false);
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

        <div className="flex min-h-[320px] flex-col">
          {selectedId == null ? (
            <p className="p-6 text-sm text-gray-500">Выберите обращение слева</p>
          ) : (
            <>
              <div className={`${styles.messagesContainer} flex-1`}>
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
