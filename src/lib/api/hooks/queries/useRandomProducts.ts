import { useQuery } from "@tanstack/react-query";

import { getRandomProducts } from "@/api/requests";

export const useRandomProducts = () => {
  return useQuery({
    queryKey: ["random-products"],
    queryFn: getRandomProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
