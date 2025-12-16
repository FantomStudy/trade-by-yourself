import type { RequestOptions } from "../../../_lib/utils/fetcher";

import { fetcher } from "../../../_lib/utils/fetcher";

/**
 * TODO: Добавить returnType
 */
const addFavorite = async (id: number, options?: RequestOptions) =>
  fetcher<unknown>(`/product/add-to-favorites/${id}`, {
    ...options,
    method: "POST",
  });

/**
 * TODO: Добавить returnType
 */
const removeFavorite = async (id: number, options?: RequestOptions) =>
  fetcher<unknown>(`/product/remove-from-favorites/${id}`, {
    ...options,
    method: "DELETE",
  });

export const toggleFavorite = async (productId: number, nextLiked: boolean) => {
  if (nextLiked) {
    await addFavorite(productId);
  } else {
    await removeFavorite(productId);
  }

  return nextLiked;
};
