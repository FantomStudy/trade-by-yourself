import type { Category } from "@/types";

import { api } from "@/api/instance";

export const getCategoryById = async (categoryId: number) => {
  api<Category>(`/category/find-by-id/${categoryId}`);
};
