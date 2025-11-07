import type { Product } from "@/types";

import { api } from "../../instance";

export const getMyProducts = async () => {
  return api.get<Product[]>("/product/my-products").then((r) => r.data);
};
