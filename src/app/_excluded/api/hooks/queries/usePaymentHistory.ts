import type { QueryHookOptions } from "./types";
import type { Payment } from "@/api/requests";

import { useQuery } from "@tanstack/react-query";

import { getPaymentHistory } from "@/api/requests";

export const PAYMENT_HISTORY_QUERY_KEY = ["payment", "history"];

export const usePaymentHistory = (options?: QueryHookOptions<Payment[]>) => {
  return useQuery({
    queryKey: PAYMENT_HISTORY_QUERY_KEY,
    queryFn: getPaymentHistory,
    staleTime: 30 * 1000, // 30 секунд
    gcTime: 5 * 60 * 1000, // 5 минут
    ...options,
  });
};
