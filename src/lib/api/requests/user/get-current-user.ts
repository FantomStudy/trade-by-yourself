import type { CurrentUser } from "@/types";

import { FetchError } from "ofetch";

import { api } from "@/api/instance";

export const getCurrentUser = async () => api<CurrentUser>("/auth/me");

/** Для RSC и префетча: без сессии не бросаем, чтобы не ронять страницу */
export async function getCurrentUserOrNull(): Promise<CurrentUser | null> {
  try {
    return await getCurrentUser();
  } catch (err) {
    if (err instanceof FetchError && err.response?.status === 401) {
      return null;
    }
    throw err;
  }
}
