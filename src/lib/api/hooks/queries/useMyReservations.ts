import type { QueryHookOptions } from "./types";
import type { Reservation } from "@/types";

import { useQuery } from "@tanstack/react-query";

import { getMyReservations } from "@/api/requests";

export const MY_RESERVATIONS_QUERY_KEY = ["reservations", "my"];

export const useMyReservations = (options?: QueryHookOptions<Reservation[]>) => {
  return useQuery({
    queryKey: MY_RESERVATIONS_QUERY_KEY,
    queryFn: getMyReservations,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};
