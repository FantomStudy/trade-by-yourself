import { api } from "@/api/instance";

export const removeFromFavorites = async (productId: number) =>
  api(`/product/remove-from-favorites/${productId}`, {
    method: "DELETE",
  });
