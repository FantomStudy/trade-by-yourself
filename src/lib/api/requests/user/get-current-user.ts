import type { CurrentUser } from "@/types";

import { FetchError } from "ofetch";

import { api } from "@/api/instance";

export const getCurrentUser = async () => api<CurrentUser>("/auth/me");

/** Для RSC и префетча: без сессии или при блокировке не бросаем, чтобы не ронять страницу */
export async function getCurrentUserOrNull(): Promise<CurrentUser | null> {
  try {
    return await getCurrentUser();
  } catch (err) {
    if (err instanceof FetchError && (err.response?.status === 401 || err.response?.status === 403)) {
      if (typeof window !== "undefined") {
        try {
          document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
          document.cookie = "ws_session_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        } catch {}
      }
      return null;
    }
    throw err;
  }
}
