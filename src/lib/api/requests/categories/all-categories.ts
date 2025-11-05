import type { Category } from "@/types";

import { api } from "../../instance";

export const getAllCategories = async () => {
  const response = await api.get<Category[]>("/category/all-categories", {
    next: {
      revalidate: 600,
    },
  });
  return response.data;
};
