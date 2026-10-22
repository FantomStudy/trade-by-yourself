import { api } from "../../instance";

import type { SupportTicket } from "./get-my-tickets";

export const createSupportTicket = async (
  message: string,
  subject = "Обращение в поддержку",
  theme = "OTHER",
  priority = "MEDIUM"
) =>
  api<SupportTicket>("/support/tickets", {
    body: {
      theme,
      subject,
      message,
      priority,
    },
    method: "POST",
  });

export const sendSupportTicketMessage = async (ticketId: number, text: string) =>
  api(`/support/tickets/${ticketId}/messages`, {
    body: { text },
    method: "POST",
  });
