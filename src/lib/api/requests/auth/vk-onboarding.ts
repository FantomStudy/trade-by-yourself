import { api } from "@/api/instance";

export interface VkOnboardingStatus {
  required: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  email: string;
  phoneNumber: string;
}

export const getVkOnboardingStatus = async () =>
  api<VkOnboardingStatus>("/auth/vk/onboarding/status");

export const vkOnboardingStartEmail = async (email: string) =>
  api<{ message: string }>("/auth/vk/onboarding/start-email", {
    method: "POST",
    body: { email },
  });

export const vkOnboardingVerifyEmail = async (code: string) =>
  api<{ message: string }>(`/auth/vk/onboarding/verify-email?code=${encodeURIComponent(code)}`, {
    method: "POST",
  });

export const vkOnboardingStartPhone = async (phoneNumber: string) =>
  api<{ message: string }>("/auth/vk/onboarding/start-phone", {
    method: "POST",
    body: { phoneNumber },
  });

export const vkOnboardingVerifyPhone = async (code: string) =>
  api<{ message: string }>(`/auth/vk/onboarding/verify-phone?code=${encodeURIComponent(code)}`, {
    method: "POST",
  });
