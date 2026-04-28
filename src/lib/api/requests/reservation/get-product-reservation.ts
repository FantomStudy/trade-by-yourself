import type { ProductReservationInfo } from "@/types";

import { api } from "@/api/instance";

export const getProductReservation = async (productId: number) =>
  api<ProductReservationInfo>(`/reservations/product/${productId}`);
