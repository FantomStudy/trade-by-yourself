import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  cancelReservationByBuyer,
  cancelReservationBySeller,
  createReservation,
  extendReservation,
} from "@/api/requests";

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

export const useExtendReservationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: extendReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_RESERVATIONS_QUERY_KEY });
    },
  });
};

export const useCancelReservationByBuyerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelReservationByBuyer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_RESERVATIONS_QUERY_KEY });
    },
  });
};

export const useCancelReservationBySellerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      cancelReservationBySeller(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_RESERVATIONS_QUERY_KEY });
    },
  });
};
