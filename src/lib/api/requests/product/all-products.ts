import type { Product } from "@/types";

import { api } from "../../instance";

export const getAllProducts = async () => {
  const response = await api.get<Product[]>("/product/all-products");
  return response.data;
};
