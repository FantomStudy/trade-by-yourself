import type { PromotionTariff } from "@/types";

import { apiGet, apiPost } from "./api";

export const getTariffs = () => apiGet<PromotionTariff[]>("/promotion/all-promotions");

export const activatePromotion = (payload: { productId: number; promotionId: number; days: number }) =>
  apiPost<{ message: string; promotion: unknown }>("/promotion/add-promotion", payload);
