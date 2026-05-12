import type { QueryHookOptions } from "./types";
import type { Deal } from "@/types";

import { useQuery } from "@tanstack/react-query";

import { getMyDeals } from "@/api/requests";

export const MY_DEALS_QUERY_KEY = ["deals", "my"];

export const useMyDeals = (options?: QueryHookOptions<Deal[]>) => {
  return useQuery({
    queryKey: MY_DEALS_QUERY_KEY,
    queryFn: getMyDeals,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};
