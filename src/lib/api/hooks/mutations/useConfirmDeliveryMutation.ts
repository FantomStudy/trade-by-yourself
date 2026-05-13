import { useMutation, useQueryClient } from "@tanstack/react-query";

import { confirmDealDelivery } from "@/api/requests";

import { MY_DEALS_QUERY_KEY } from "../queries/useMyDeals";

export const useConfirmDeliveryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dealId: number) => confirmDealDelivery(dealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_DEALS_QUERY_KEY });
    },
  });
};
