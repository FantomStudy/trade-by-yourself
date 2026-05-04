import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cancelDeal } from "@/api/requests";

import { MY_DEALS_QUERY_KEY } from "../queries/useMyDeals";
import { MY_RESERVATIONS_QUERY_KEY } from "../queries/useMyReservations";

export const useCancelDealMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dealId: number) => cancelDeal(dealId),
    onSuccess: () => {
      // После отмены обновляем сделки и резервы, чтобы UI не зависал в старом состоянии.
      queryClient.invalidateQueries({ queryKey: MY_DEALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_RESERVATIONS_QUERY_KEY });
    },
  });
};
