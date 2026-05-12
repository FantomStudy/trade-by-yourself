"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { CURRENT_USER_QUERY_KEY } from "@/api/hooks";
import { getCurrentUserOrNull } from "@/api/requests";

import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUserOrNull,
    refetchOnMount: true,
  });

  const logout = () => {
    try {
      document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    } catch {}
    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
  };

  const value = useMemo(
    () => ({
      user: data || null,
      logout,
    }),
    [data],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
};
