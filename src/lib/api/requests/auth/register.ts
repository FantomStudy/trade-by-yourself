import type { RegisterData, RegisterResponse } from "@/api/types";

import { api } from "@/api/instance";

export const register = async (data: RegisterData) => {
  const { where, ...bodyData } = data;
  return api<RegisterResponse>(`/auth/sign-up?where=${where}`, {
    method: "POST",
    body: bodyData,
  });
};
