import type { Subcategory } from "@/types";

import { api } from "../../instance";

export const getAllSubcategories = async () => {
  return api
    .get<Subcategory[]>("/category/all-subcategories")
    .then((r) => r.data);
};
