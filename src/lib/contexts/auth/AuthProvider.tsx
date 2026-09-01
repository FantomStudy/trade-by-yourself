"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

import { CURRENT_USER_QUERY_KEY } from "@/api/hooks";
import { getCurrentUserOrNull, getVkOnboardingStatus, getYandexOnboardingStatus } from "@/api/requests";

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
  const { data: onboarding } = useQuery({
    queryKey: ["auth", "vk-onboarding-status", data?.id ?? null],
    queryFn: getVkOnboardingStatus,
    enabled: Boolean(data?.id),
    retry: false,
    staleTime: 15_000,
  });
  const { data: yandexOnboarding } = useQuery({
    queryKey: ["auth", "yandex-onboarding-status", data?.id ?? null],
    queryFn: getYandexOnboardingStatus,
    enabled: Boolean(data?.id),
    retry: false,
    staleTime: 15_000,
  });

  useEffect(() => {
    if (!data?.id) return;
    const path = pathname || "/";
    if (onboarding?.required) {
      if (path.startsWith("/auth/vk/onboarding") || path.startsWith("/auth/vk/callback")) return;
      router.replace(`/auth/vk/onboarding?next=${encodeURIComponent(path)}`);
      return;
    }
    if (yandexOnboarding?.required) {
      if (path.startsWith("/auth/yandex/onboarding") || path.startsWith("/auth/yandex/callback")) return;
      router.replace(`/auth/yandex/onboarding?next=${encodeURIComponent(path)}`);
      return;
    }
  }, [data?.id, onboarding?.required, yandexOnboarding?.required, pathname, router]);

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
