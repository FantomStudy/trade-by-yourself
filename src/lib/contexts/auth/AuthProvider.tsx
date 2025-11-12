"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useMemo } from "react";

import type { CurrentUser } from "@/types";

import { getCurrentUser } from "@/lib/api";

interface AuthContextType {
  isAuth: boolean;
  isLoading: boolean;
  user: CurrentUser | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export interface AuthProviderProps {
  children: React.ReactNode;
  user?: CurrentUser;
}

export const USER_QUERY_KEY = ["user", "current"];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: USER_QUERY_KEY,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
    queryFn: () => getCurrentUser().then((r) => r.data),
    initialData: () => queryClient.getQueryData(USER_QUERY_KEY),
    throwOnError(error) {
      queryClient.setQueryData(USER_QUERY_KEY, null);
      console.log("[AUTH_PROVIDER] Failed to fetch user:", error);
      return false;
    },
  });

  const isAuth = !!data;

  const value = useMemo(
    () => ({
      isAuth,
      isLoading,
      user: data || null,
    }),
    [data, isAuth, isLoading],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
};
