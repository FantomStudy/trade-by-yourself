"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { CURRENT_USER_QUERY_KEY } from "@/api/hooks";
import { vkSignIn } from "@/api/requests";
import { VK_OAUTH_STATE_KEY } from "@/lib/auth/vk-oauth";

/**
 * Обмен code на сессию (cookie session_id на бэке).
 * Дедуп по sessionStorage — в Strict Mode effect вызывается дважды, второй вызов тихо выходит (код VK одноразовый).
 */
export function VkCallbackClient() {
  const router = useRouter();
  const search = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const code = search.get("code");
    const state = search.get("state");
    const savedState = localStorage.getItem(VK_OAUTH_STATE_KEY);

    if (!code || !state || state !== savedState) {
      toast.error("Ошибка VK: устарела сессия или подмена state");
      localStorage.removeItem(VK_OAUTH_STATE_KEY);
      router.replace("/");
      return;
    }

    const dedupeKey = `vk_oauth_handled_${code}`;
    if (sessionStorage.getItem(dedupeKey)) {
      return;
    }
    sessionStorage.setItem(dedupeKey, "1");

    void (async () => {
      try {
        await vkSignIn({ code });
        localStorage.removeItem(VK_OAUTH_STATE_KEY);
        await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
        router.replace("/profile");
      } catch {
        sessionStorage.removeItem(dedupeKey);
        toast.error("Не удалось войти через VK");
        localStorage.removeItem(VK_OAUTH_STATE_KEY);
        router.replace("/");
      }
    })();
  }, [router, search, queryClient]);

  return <div>Входим через VK…</div>;
}
