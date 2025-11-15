"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { CURRENT_USER_QUERY_KEY } from "@/api/hooks";
import { getCurrentUser } from "@/api/requests";

import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
    refetchOnMount: true,
    throwOnError: () => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
      return false;
    },
  });

  const value = useMemo(
    () => ({
      user: data || null,
    }),
    [data],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
};
