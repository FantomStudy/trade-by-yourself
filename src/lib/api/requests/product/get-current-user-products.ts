import type { Product } from "@/types";

import { api } from "@/api/instance";

export const getCurrentUserProducts = async (userId: number) =>
  api<Product[]>(`/product/user-products/${userId}`);
