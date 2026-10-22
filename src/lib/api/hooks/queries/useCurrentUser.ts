import type { QueryHookOptions } from "./types";
import type { CurrentUser } from "@/types";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUserOrNull } from "../../requests";

export const CURRENT_USER_QUERY_KEY = ["user", "current"];

export const useCurrentUser = (options?: QueryHookOptions<CurrentUser | null>) => {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUserOrNull,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};
