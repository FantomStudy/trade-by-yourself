import type { QueryHookOptions } from "./types";
import type { Deal } from "@/types";

import { useQuery } from "@tanstack/react-query";

import { getMyDeals } from "@/api/requests";

export const MY_DEALS_QUERY_KEY = ["deals", "my"];

export const useMyDeals = (options?: QueryHookOptions<Deal[]>) => {
  return useQuery({
    queryKey: MY_DEALS_QUERY_KEY,
    queryFn: getMyDeals,
    staleTime: 0,          // всегда обновляем при refetch — нужно для статуса CDEK
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false, // не сбрасываем при переключении вкладки
    ...options,
  });
};
