import { api } from "@/api/instance";

export interface YandexOnboardingStatus {
  required: boolean;
  isPhoneVerified: boolean;
  phoneNumber: string;
  email: string;
}

export const getYandexOnboardingStatus = async () =>
  api<YandexOnboardingStatus>("/auth/yandex/onboarding/status");

export const yandexOnboardingStartPhone = async (phoneNumber: string) =>
  api<{ message: string }>("/auth/yandex/onboarding/start-phone", {
    method: "POST",
    body: { phoneNumber },
  });

export const yandexOnboardingVerifyPhone = async (code: string) =>
  api<{ message: string }>(`/auth/yandex/onboarding/verify-phone?code=${encodeURIComponent(code)}`, {
    method: "POST",
  });
