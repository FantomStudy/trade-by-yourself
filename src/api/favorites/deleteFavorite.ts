import { api } from "../instance";

export const deleteFavorite = (id: number) =>
  api<unknown>(`/product/remove-from-favorites/${id}`, { method: "DELETE" });
