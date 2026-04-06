import type { ForgotPasswordData, ForgotPasswordResponse } from "@/api/types";

import { api } from "@/api/instance";

// FIXME: ADD TYPES AND CREATE SCHEMAS
export const forgotPassword = async (data: ForgotPasswordData) =>
  api<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: data,
  });

export const verifyCode = async (code: string) =>
  api<ForgotPasswordResponse>("/auth/verify-code", {
    method: "POST",
    query: { code },
  });

export const changePassword = async (data: unknown) =>
  api<unknown>("/auth/change-password", {
    method: "POST",
    body: data as BodyInit,
  });
