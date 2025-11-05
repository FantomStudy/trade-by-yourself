import type { ExtendedProduct } from "@/types";

import { api } from "../../instance";

export const getProduct = async (productId: number) => {
  const response = await api.get<ExtendedProduct>(
    `product/product-card/${productId}`
  );
  return response.data;
};
