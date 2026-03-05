import { api } from "../instance";

export const removeFavorite = async (id: number) =>
  api<unknown>(`/product/remove-from-favorites/${id}`, { method: "DELETE" });
