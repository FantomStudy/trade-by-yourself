import { api } from "@/api/instance";

export const addToFavorites = async (productId: number) =>
  api(`/product/add-to-favorites/${productId}`, { method: "POST" });
