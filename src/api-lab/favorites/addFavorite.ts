import { api } from "../instance";

export const addFavorite = async (id: number) =>
  api<unknown>(`/product/add-to-favorites/${id}`, { method: "POST" });
