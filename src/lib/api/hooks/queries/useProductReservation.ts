import type { QueryHookOptions } from "./types";
import type { ProductReservationInfo } from "@/types";

import { useQuery } from "@tanstack/react-query";

import { getProductReservation } from "@/api/requests";

export const PRODUCT_RESERVATION_QUERY_KEY = (productId: number) => [
  "reservation",
  "product",
  productId,
];

export const useProductReservation = (
  productId?: number,
  options?: QueryHookOptions<ProductReservationInfo>,
) => {
  return useQuery({
    queryKey: PRODUCT_RESERVATION_QUERY_KEY(productId ?? 0),
    queryFn: () => getProductReservation(productId ?? 0),
    enabled: Boolean(productId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};
