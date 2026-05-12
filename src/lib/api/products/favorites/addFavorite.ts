import { api } from "@/api/instance";

export const addFavorite = (id: number) =>
  api<unknown>(`/product/add-to-favorites/${id}`, { method: "POST" });
