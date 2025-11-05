import type { Subcategory } from "@/types";

import { api } from "../../instance";

export const getAllSubcategories = async () => {
  const response = await api.get<Subcategory[]>("/category/all-subcategories");
  return response.data;
};
