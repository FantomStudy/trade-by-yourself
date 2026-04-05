import { useQuery } from "@tanstack/react-query";

import { checkIsAdmin } from "@/api/requests";

export const useIsAdmin = () => {
  return useQuery({
    queryKey: ["auth", "isAdmin"],
    queryFn: checkIsAdmin,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 минут
  });
};
