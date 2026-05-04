import { api } from "@/api/instance";

export interface PromotionTariff {
  id: number;
  name: string;
  pricePerDay: number;
}

export const getAllPromotions = async () => api<PromotionTariff[]>("/promotion/all-promotions");
