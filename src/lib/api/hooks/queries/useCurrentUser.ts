import { useQuery } from "@tanstack/react-query";

import type { CurrentUser } from "@/types";

import type { QueryHookOptions } from "./types";

import { getCurrentUser } from "../../requests";

export const CURRENT_USER_QUERY_KEY = ["user", "current"];

export const useCurrentUser = (options?: QueryHookOptions<CurrentUser>) => {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};
