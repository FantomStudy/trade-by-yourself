import type { Category } from "@/types/category";
import { api } from "../instance";

export const getCategory = async (slug?: string) => {
  return api<Category>(`/category/slug/${slug}`);
};
