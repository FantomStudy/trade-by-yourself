import type { Category } from "@/types/category";
import { api } from "../instance";

export const getCategories = async () => {
  return api<Category[]>("/category/find-all");
};
