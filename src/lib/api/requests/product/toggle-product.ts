import { api } from "../../instance";

export interface ToggleProductResponse {
  message: string;
  isHide?: boolean;
  renewed?: boolean;
  paid?: boolean;
  cost?: number;
  bonusDeducted?: number;
  balanceDeducted?: number;
  expiresAt?: string;
}

export const toggleProduct = async (productId: number) =>
  api<ToggleProductResponse>(`/product/toggle-product/${productId}`, {
    method: "PUT",
  });

