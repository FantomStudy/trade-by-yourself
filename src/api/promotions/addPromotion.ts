import { api } from "../instance";

export interface AddPromotionPayload {
  productId: number;
  promotionId: number;
  days: number;
}

export const addPromotion = (data: AddPromotionPayload) =>
  api("/promotion/add-promotion", {
    method: "POST",
    body: data,
  });

