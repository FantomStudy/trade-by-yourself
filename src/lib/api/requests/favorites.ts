import type { Product } from "@/types";

import { api } from "../instance";

export const getFavoritesProducts = async () =>
  api<Product[]>("/product/my-favorites");

export const removeFromFavorites = async (productId: number) =>
  api(`/product/remove-from-favorites/${productId}`, {
    method: "DELETE",
  });

export const addToFavorites = async (productId: number) =>
  api(`/product/add-to-favorites/${productId}`, { method: "POST" });
