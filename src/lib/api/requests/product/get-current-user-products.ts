import type { Product } from "@/types";

import { api } from "@/api/instance";

export const getCurrentUserProducts = async () =>
  api<Product[]>("/product/my-products");
