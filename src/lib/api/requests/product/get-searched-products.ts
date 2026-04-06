import type { Product } from "@/types";

import { api } from "@/api/instance";

export const getSearchedProducts = async (query: unknown) =>
  api<Product[]>(`/product/search`, {
    query: { query },
  });
