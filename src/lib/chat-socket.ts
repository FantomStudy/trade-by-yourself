import type { ManagerOptions, SocketOptions } from "socket.io-client";

import { io } from "socket.io-client";

import { API_BASE_URL } from "@/lib/api/instance";

/**
 * Только long-polling (как у тебя в гайде для стабильной локалки с go-socket.io).
 * В .env: NEXT_PUBLIC_CHAT_SOCKET_POLLING_ONLY=true
 */
const POLLING_ONLY =
  process.env.NEXT_PUBLIC_CHAT_SOCKET_POLLING_ONLY === "true" ||
  process.env.NEXT_PUBLIC_CHAT_SOCKET_POLLING_ONLY === "1";

/**
 * Сокет с того же origin, что страница (нужен rewrite /socket.io → бэк в next.config).
 * В .env: NEXT_PUBLIC_CHAT_SOCKET_RELATIVE=true — лечит xhr poll error из‑за CORS между портами.
 */
const SOCKET_RELATIVE =
  process.env.NEXT_PUBLIC_CHAT_SOCKET_RELATIVE === "true" ||
  process.env.NEXT_PUBLIC_CHAT_SOCKET_RELATIVE === "1";

/** Общие опции под googollee/go-socket.io: namespace /chat, path /socket.io, cookie session_id. */
export function getChatSocketClientOptions(): Partial<ManagerOptions & SocketOptions> {
  return {
    path: "/socket.io",
    withCredentials: true,
    // Сначала polling — меньше сюрпризов с handshake на Go; потом можно websocket.
    transports: POLLING_ONLY ? ["polling"] : ["polling", "websocket"],
  };
}

/** Namespace URL: либо полный к API, либо относительный `/chat` под прокси Next. */
export function getChatSocketUrl(): string {
  return SOCKET_RELATIVE ? "/chat" : `${API_BASE_URL}/chat`;
}

/** Один инстанс на namespace `/chat`. */
export function createChatSocket() {
  return io(getChatSocketUrl(), getChatSocketClientOptions());
}
