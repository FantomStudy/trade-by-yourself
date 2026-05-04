import { useMutation, useQueryClient } from "@tanstack/react-query";

import { shipDeal } from "@/api/requests";

import { MY_DEALS_QUERY_KEY } from "../queries/useMyDeals";

interface ShipDealParams {
  cdekOrderUuid?: string;
  cdekTrackNumber?: string;
  id: number;
}

export const useShipDealMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: ShipDealParams) => shipDeal(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_DEALS_QUERY_KEY });
    },
  });
};
