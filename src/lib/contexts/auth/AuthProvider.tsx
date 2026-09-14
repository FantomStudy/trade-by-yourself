"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

import { CURRENT_USER_QUERY_KEY } from "@/api/hooks";
import { getCurrentUserOrNull, getVkOnboardingStatus } from "@/api/requests";

import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUserOrNull,
    refetchOnMount: true,
  });
  const isSyntheticVk = Boolean(
    data?.phoneNumber?.toUpperCase().startsWith("VK_") ||
    data?.email?.toLowerCase().endsWith("@oauth.local")
  );

  const { data: onboarding } = useQuery({
    queryKey: ["auth", "vk-onboarding-status", data?.id ?? null],
    queryFn: getVkOnboardingStatus,
    enabled: Boolean(data?.id) && isSyntheticVk,
    retry: false,
    staleTime: 15_000,
  });

  useEffect(() => {
    if (!data?.id) return;
    const path = pathname || "/";
    if (onboarding?.required && isSyntheticVk) {
      if (path.startsWith("/auth/vk/onboarding") || path.startsWith("/auth/vk/callback")) return;
      router.replace(`/auth/vk/onboarding?next=${encodeURIComponent(path)}`);
      return;
    }
    // Use the requireYandexOnboarding flag from /auth/me directly — it is
    // computed by the backend based on OAuth identity + phone verification status.
    // This is more reliable than the isSyntheticYandex heuristic, which breaks
    // after phone verification (phone prefix changes from YANDEX_xxx to a real number).
    if (data?.requireYandexOnboarding) {
      if (path.startsWith("/auth/yandex/onboarding") || path.startsWith("/auth/yandex/callback")) return;
      router.replace(`/auth/yandex/onboarding?next=${encodeURIComponent(path)}`);
      return;
    }
  }, [data?.id, data?.requireYandexOnboarding, isSyntheticVk, onboarding?.required, pathname, router]);

  const logout = useCallback(() => {
    try {
      document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    } catch {}
    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user: data || null,
      logout,
    }),
    [data, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
};
