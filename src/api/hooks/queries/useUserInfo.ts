import type { QueryHookOptions } from "./types";
import type { User } from "@/types";

import { useQuery } from "@tanstack/react-query";

import { getUserInfo } from "@/api/requests";

export const USER_INFO_QUERY_KEY = (userId: number) => ["user", "info", userId];

export const useUserInfo = (userId: number | undefined, options?: QueryHookOptions<User>) => {
  return useQuery({
    queryKey: USER_INFO_QUERY_KEY(userId ?? 0),
    queryFn: () => getUserInfo(userId!),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 секунд
    gcTime: 5 * 60 * 1000, // 5 минут
    ...options,
  });
};
