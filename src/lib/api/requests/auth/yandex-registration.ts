import { api } from "@/api/instance";

/** Ответ /auth/yandex/sign-in, когда аккаунта ещё нет и нужна регистрация по SMS. */
export interface YandexSignInResponse {
  message?: string;
  requirePhoneRegistration?: boolean;
  registrationTicket?: string;
  user?: {
    id: number;
    email: string;
    fullName: string;
    phoneNumber: string;
    profileType: string;
    photo: string | null;
  };
}

export interface YandexRegistrationStatus {
  pending: boolean;
  email: string;
  fullName: string;
  phoneNumber: string;
  codeSent: boolean;
}

export const getYandexRegistrationStatus = async (registrationTicket: string) =>
  api<YandexRegistrationStatus>("/auth/yandex/register/status", {
    query: { ticket: registrationTicket },
  });

export const yandexRegistrationSendCode = async (registrationTicket: string, phoneNumber: string) =>
  api<{ message: string; phoneNumber: string }>("/auth/yandex/register/send-code", {
    method: "POST",
    body: { registrationTicket, phoneNumber },
  });

export const yandexRegistrationVerifyCode = async (registrationTicket: string, code: string) =>
  api<YandexSignInResponse>("/auth/yandex/register/verify-code", {
    method: "POST",
    body: { registrationTicket, code },
  });
