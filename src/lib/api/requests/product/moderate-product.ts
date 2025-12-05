import { api } from "../../instance";

export const moderateProduct = async (
  productId: number,
  status: "APPROVED" | "DENIDED",
) =>
  api(`/product/moderate-product/${productId}?status=${status}`, {
    method: "PUT",
  });
