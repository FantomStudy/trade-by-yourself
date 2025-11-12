import type { Product } from "@/types";

import { api } from "../instance";

//FIXME: ADD TYPES
export const getFavoritesProducts = async () =>
  api.get<Product[]>("/product/my-favorites");

export const removeFromFavorites = async (productId: number) =>
  api.delete<unknown>(`/product/remove-from-favorites/${productId}`);

export const addToFavorites = async (productId: number) =>
  api.post<unknown>(`/product/add-to-favorites/${productId}`);
