import type { Product } from "@/types";

import { api } from "../../instance";

export const getAllProducts = async () => {
  return api.get<Product[]>("/product/all-products").then((r) => r.data);
};
