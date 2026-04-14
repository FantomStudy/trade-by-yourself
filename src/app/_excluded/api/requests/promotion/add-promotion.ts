import { api } from "@/api/instance";

interface AddPromotionData {
  productId: number;
  promotionId: number;
  days: number;
}

export const addPromotion = async (data: AddPromotionData) =>
  api("/promotion/add-promotion", {
    method: "POST",
    body: data,
  });
