import { useQuery } from "@tanstack/react-query";

import { getProductsToModerate } from "@/api/requests";

export const useProductsToModerate = () => {
  return useQuery({
    queryKey: ["productsToModerate"],
    queryFn: getProductsToModerate,
  });
};
