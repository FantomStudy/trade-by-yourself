import type { ForgotPasswordData, ForgotPasswordResponse } from "@/api/types";

import { api } from "@/api/instance";

// FIXME: ADD TYPES AND CREATE SCHEMAS
export const forgotPassword = async (data: ForgotPasswordData) =>
  api<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: {
      where: data.where,
      email: data.email,
      phoneNumber: data.phoneNumber,
    },
  });

export const verifyCode = async (code: string) =>
  api<{ userId: number }>("/auth/verify-code", {
    method: "POST",
    query: { code },
  });

export const changePassword = async (data: { userId: number; password: string }) =>
  api<{ message: string }>("/auth/change-password", {
    method: "POST",
    body: data,
  });
