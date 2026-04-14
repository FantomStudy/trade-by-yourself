import type { ModerationFilter } from "@/types";

import { useQuery } from "@tanstack/react-query";

import { getProductsToModerate } from "@/api/requests";

export const useProductsToModerate = (filter: ModerationFilter = "ALL", page: number = 1) => {
  return useQuery({
    queryKey: ["productsToModerate", filter, page],
    queryFn: () => getProductsToModerate(filter, page),
  });
};
