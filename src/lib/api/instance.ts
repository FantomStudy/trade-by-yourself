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
    if (options.headers instanceof Headers) {
      options.headers.set("cookie", cookieHeader);
    }
  },
  onResponse: ({ response }) => {
    updateServerTimeOffset(response.headers.get("date"));
  },
  // onResponseError: async ({ response }) => {
  //   if (response.status === 401 && !isServer()) {
  //     try {
  //       document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  //     } catch {}
  //     const { getQueryClient } = await import("@/lib/get-query-client");
  //     const { CURRENT_USER_QUERY_KEY } = await import("@/lib/api/hooks/queries/useCurrentUser");
  //     const queryClient = getQueryClient();
  //     queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
  //   }
  // },
});
