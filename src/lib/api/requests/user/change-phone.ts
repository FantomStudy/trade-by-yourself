import { api } from "@/lib/api/instance";

export const requestPhoneChange = async (phone: string): Promise<{ message: string; phone: string }> => {
  return api<{ message: string; phone: string }>("/user/request-phone-change", {
    method: "POST",
    body: { phone },
  });
};

export const confirmPhoneChange = async (code: string): Promise<{ message: string; phoneNumber: string }> => {
  return api<{ message: string; phoneNumber: string }>("/user/confirm-phone-change", {
    method: "POST",
    body: { code },
  });
};
