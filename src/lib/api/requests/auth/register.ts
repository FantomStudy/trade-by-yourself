import type { RegisterData, RegisterResponse } from "@/api/types";

import { api } from "@/api/instance";

export const register = async (data: RegisterData) =>
  api<RegisterResponse>("/auth/sign-up", { method: "POST", body: data });
