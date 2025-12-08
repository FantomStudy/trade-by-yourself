import { api } from "../../instance";

export const moderateProduct = async (
  productId: number,
  status: "APPROVED" | "DENIDED",
  reason?: string,
) => {
  const url = reason
    ? `/product/moderate-product/${productId}?status=${status}&reason=${encodeURIComponent(reason)}`
    : `/product/moderate-product/${productId}?status=${status}`;

  return api(url, {
    method: "PUT",
  });
};
