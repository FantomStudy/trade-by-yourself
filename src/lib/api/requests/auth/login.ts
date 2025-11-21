import type { LoginData, LoginResponse } from "@/api/types";

import { api } from "@/api/instance";

export const login = async (data: LoginData) =>
  api<LoginResponse>("/auth/sign-in", {
    method: "POST",
    body: data,
  });
