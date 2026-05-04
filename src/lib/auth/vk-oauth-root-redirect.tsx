"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { VK_OAUTH_STATE_KEY } from "./vk-oauth";

/**
 * Если VK_OAUTH_REDIRECT_URI = корень (https://torguisam.ru), после OAuth приходят code/state на `/`.
 * Перекидываем на `/auth/vk/callback`, где обмен code на сессию (единая логика).
 */
export function VkOAuthRootRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    if (pathname !== "/") return;
    const code = search.get("code");
    const state = search.get("state");
    if (!code || !state) return;
    if (localStorage.getItem(VK_OAUTH_STATE_KEY) !== state) return;

    const next = new URLSearchParams({ code, state });
    router.replace(`/auth/vk/callback?${next.toString()}`);
  }, [pathname, router, search]);

  return null;
}
