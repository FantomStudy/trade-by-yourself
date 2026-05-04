import { api } from "@/api/instance";

export const vkSignIn = async (body: { code: string }) =>
  api<unknown>("/auth/vk/sign-in", {
    method: "POST",
    body,
  });
