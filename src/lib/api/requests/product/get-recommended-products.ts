import type { Product } from "@/types";

import { api } from "@/api/instance";

export const getRecommendedProducts = async (subcategoryId: number, limit = 12) =>
  api<Product[]>(`/product/recommended?subcategoryId=${subcategoryId}&limit=${limit}`);
