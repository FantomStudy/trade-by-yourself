import { api } from "@/api/instance";

export interface VkOAuthUrlResponse {
  url: string;
}

export const getVkOAuthUrl = async (state: string) =>
  api<VkOAuthUrlResponse>(`/auth/vk/url?state=${encodeURIComponent(state)}`);
