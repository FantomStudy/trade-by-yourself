import { api } from "../../instance";

export interface SupportTicketUser {
  id: number;
  fullName: string;
  email: string;
}

export interface SupportTicketMessage {
  id: number;
  ticketId: number;
  authorId: number;
  text: string;
  sentAt: string;
  author: SupportTicketUser & { role?: { name: string } | null };
}

export interface SupportTicket {
  id: number;
  theme: string;
  subject: string;
  status: string;
  priority: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: SupportTicketUser;
  lastMessage?: {
    id: number;
    text: string;
    sentAt: string;
    authorId: number;
    author: SupportTicketUser;
  } | null;
  messages?: SupportTicketMessage[];
}

export interface SupportTicketsResponse {
  tickets: SupportTicket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getMySupportTickets = async () =>
  api<SupportTicketsResponse>("/support/tickets/my", {
    query: { limit: 50 },
    cache: "no-store",
  });

export const getAllSupportTickets = async () =>
  api<SupportTicketsResponse>("/support/tickets/all", {
    query: { limit: 100 },
    cache: "no-store",
  });

export const getSupportTicket = async (ticketId: number) =>
  api<SupportTicket>(`/support/tickets/${ticketId}`, { cache: "no-store" });
