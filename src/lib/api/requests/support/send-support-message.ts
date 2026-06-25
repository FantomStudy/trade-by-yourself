import { api } from "../../instance";

import type { SupportTicket } from "./get-my-tickets";

export const createSupportTicket = async (message: string, subject = "Обращение в поддержку") =>
  api<SupportTicket>("/support/tickets", {
    body: {
      theme: "OTHER",
      subject,
      message,
      priority: "MEDIUM",
    },
    method: "POST",
  });

export const sendSupportTicketMessage = async (ticketId: number, text: string) =>
  api(`/support/tickets/${ticketId}/messages`, {
    body: { text },
    method: "POST",
  });
