import type { LoginResponse } from "@/api/types";

import { api } from "@/api/instance";

export const refresh = async () =>
  api<LoginResponse>("/auth/refresh", { method: "POST" });
