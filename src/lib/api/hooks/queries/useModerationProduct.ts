import { useQuery } from "@tanstack/react-query";

import { getModerationProduct } from "@/api/requests";

export const useModerationProduct = (id: number | null) => {
  return useQuery({
    queryKey: ["moderationProduct", id],
    queryFn: () => getModerationProduct(id!),
    enabled: id !== null,
  });
};
