import type { Category } from "@/types";

import { api } from "@/api/instance";

export const getCategories = async () =>
  api<Category[]>("/category/find-all");
