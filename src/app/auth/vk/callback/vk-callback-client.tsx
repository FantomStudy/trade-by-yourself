"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { CURRENT_USER_QUERY_KEY } from "@/api/hooks";
import { VK_OAUTH_STATE_KEY } from "@/lib/auth/vk-oauth";

export function VkCallbackClient() {
  const router = useRouter();
  const search = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const code = search.get("code");
    const state = search.get("state");
    const savedState = localStorage.getItem(VK_OAUTH_STATE_KEY);

    if (!code || !state || state !== savedState) {
      router.replace("/login?error=vk_state");
      return;
    }

    void (async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        router.replace("/login?error=vk_signin");
        return;
      }

      const res = await fetch(`${API_URL}/auth/vk/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, state }),
      });

      if (!res.ok) {
        router.replace("/login?error=vk_signin");
        return;
      }

      localStorage.removeItem(VK_OAUTH_STATE_KEY);
      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      router.replace("/profile");
    })();
  }, [queryClient, router, search]);

  return <div>Вход через VK...</div>;
}
