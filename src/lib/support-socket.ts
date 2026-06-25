import { API_BASE_URL } from "@/lib/api/instance";

export type SupportEventName =
  | "newSupportMessage"
  | "joinedTicket"
  | "error";

type WSOutgoingEvent = "joinTicket" | "leaveTicket" | "sendSupportMessage";

interface WSIncoming<T = unknown> {
  event: SupportEventName;
  data: T;
}

interface WSOutgoing<T = unknown> {
  event: WSOutgoingEvent;
  data: T;
}

export function getSupportSocketUrl(): string {
  const httpUrl = new URL(API_BASE_URL);
  const wsProtocol = httpUrl.protocol === "https:" ? "wss:" : "ws:";
  const sid = getSessionIdFromCookie();
  const query = sid ? `?session_id=${encodeURIComponent(sid)}` : "";
  return `${wsProtocol}//${httpUrl.host}/ws/support${query}`;
}

export function createSupportSocket(): WebSocket {
  return new WebSocket(getSupportSocketUrl());
}

export function parseSupportSocketMessage(raw: string): WSIncoming | null {
  try {
    const parsed = JSON.parse(raw) as WSIncoming;
    if (!parsed || typeof parsed.event !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function sendSupportSocketEvent<T>(ws: WebSocket, event: WSOutgoingEvent, data: T) {
  if (ws.readyState !== WebSocket.OPEN) return;
  const payload: WSOutgoing<T> = { event, data };
  ws.send(JSON.stringify(payload));
}

function getSessionIdFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith("ws_session_id=") || item.startsWith("session_id="));
  if (!cookie) return null;
  const value = cookie.startsWith("ws_session_id=")
    ? cookie.slice("ws_session_id=".length)
    : cookie.slice("session_id=".length);
  return value ? decodeURIComponent(value) : null;
}
