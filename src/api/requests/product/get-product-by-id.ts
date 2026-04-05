import type { ExtendedProduct } from "@/types";

import { api } from "@/api/instance";

export const getProductById = async (productId: number) =>
  api<ExtendedProduct>(`/product/product-card/${productId}`);
