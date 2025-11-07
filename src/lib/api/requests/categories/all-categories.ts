import type { Category } from "@/types";

import { api } from "../../instance";

export const getAllCategories = async () => {
  return api.get<Category[]>("/category/all-categories").then((r) => r.data);
};
