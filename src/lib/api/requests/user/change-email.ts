import { api } from "@/lib/api/instance";

export const requestEmailChange = async (email: string): Promise<{ message: string; email: string }> => {
  return api<{ message: string; email: string }>("/user/request-email-change", {
    method: "POST",
    body: { email },
  });
};

export const confirmEmailChange = async (code: string): Promise<{ message: string; email: string }> => {
  return api<{ message: string; email: string }>("/user/confirm-email-change", {
    method: "POST",
    body: { code },
  });
};

