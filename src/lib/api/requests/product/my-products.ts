import type { Product } from "@/types";

import { api } from "../../instance";

export const getMyProducts = async () => {
  const response = await api.get<Product[]>("/product/my-products");
  return response.data;
};
