import { ofetch } from "ofetch";
import { updateServerTimeOffset } from "../server-time-offset";

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = RAW_BASE_URL?.trim()
  // Защита от случайных кавычек в .env, чтобы запросы не уходили в относительный путь.
  .replace(/^['"]+|['"]+$/g, "")
  .replace(/\/+$/g, "");

if (!BASE_URL) {
  throw new Error("API_URL is not defined");
}

/** База REST и Socket.IO (namespace `/chat`) — один хост с `NEXT_PUBLIC_API_URL`. */
export const API_BASE_URL = BASE_URL;

export const api = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  onRequest: async ({ options }) => {
    if (typeof window !== "undefined") return;

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const all = cookieStore.getAll();
    if (all.length === 0) return;

    const cookieHeader = all.map((c) => `${c.name}=${encodeURIComponent(c.value)}`).join("; ");
    const headers = new Headers(options.headers);
    headers.set("cookie", cookieHeader);
    options.headers = headers;
  },
  onResponse: ({ response }) => {
    updateServerTimeOffset(response.headers.get("date"));
  },
  onResponseError: async ({ request, response }) => {
    if (typeof window === "undefined") return;
    const isBanned = response.status === 403 && response._data?.code === "USER_BANNED";
    const reqUrl = typeof request === "string" ? request : request?.url || "";
    const isAuthMe = reqUrl.includes("/auth/me");
    if ((response.status === 401 && isAuthMe) || isBanned) {
      if (isBanned) {
        try {
          document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
          document.cookie = "ws_session_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        } catch {}
      }
      try {
        const { getQueryClient } = await import("@/lib/get-query-client");
        const { CURRENT_USER_QUERY_KEY } = await import("@/lib/api/hooks/queries/useCurrentUser");
        const queryClient = getQueryClient();
        queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
      } catch {}
      if (isBanned) {
        try {
          const { toast } = await import("sonner");
          toast.error("Ваш аккаунт заблокирован");
        } catch {}
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    }
  },
});
