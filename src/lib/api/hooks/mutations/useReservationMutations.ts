import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cancelReservation, createReservation } from "@/api/requests";

import { MY_RESERVATIONS_QUERY_KEY } from "../queries/useMyReservations";
import { PRODUCT_RESERVATION_QUERY_KEY } from "../queries/useProductReservation";

export const useCreateReservationMutation = (productId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_RESERVATIONS_QUERY_KEY });
      if (productId) {
        queryClient.invalidateQueries({ queryKey: PRODUCT_RESERVATION_QUERY_KEY(productId) });
      }
    },
  });
};

export const useCancelReservationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      cancelReservation(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_RESERVATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["reservation", "product"] });
    },
  });
};
