import { api } from "@/lib/api/instance";

export const sendVerifyEmail = async (): Promise<{ message: string }> => {
  return api<{ message: string }>("/user/verify-email", {
    method: "POST",
  });
};

export const verifyEmailCode = async (code: string): Promise<{ message: string }> => {
  return api<{ message: string }>(`/user/verify-code?code=${encodeURIComponent(code)}`, {
    method: "POST",
    data: { code },
  });
};
