import { useMutation, useQueryClient } from "@tanstack/react-query";

import { payDeal } from "@/api/requests";

import { MY_DEALS_QUERY_KEY } from "../queries/useMyDeals";

export const usePayDealMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => payDeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_DEALS_QUERY_KEY });
    },
  });
};
