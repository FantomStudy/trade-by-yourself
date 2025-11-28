import type { LoginResponse } from "@/api/types";

import { api } from "@/api/instance";

// With session-based auth, refresh is no longer required on the client.
// Keeping a stub in case of future use.
export const refresh = async () =>
  api<unknown>("/auth/refresh", { method: "POST" });
