import { ofetch } from "ofetch";

import { isServer } from "../is-server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("API_URL is not defined");
}

export const api = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  onRequest: async ({ options }) => {
    if (!isServer()) return;

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    if (cookieStore) {
      options.headers.append("cookie", cookieStore.toString());
    }
  },
  onResponseError: async ({ response }) => {
    if (response.status === 401 && !isServer()) {
      try {
        document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      } catch {}
      const { getQueryClient } = await import("@/lib/get-query-client");
      const { CURRENT_USER_QUERY_KEY } = await import("@/lib/api/hooks/queries/useCurrentUser");
      const queryClient = getQueryClient();
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
    }
  },
});
