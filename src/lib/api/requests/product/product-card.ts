import type { ExtendedProduct } from "@/types";

import { api } from "../../instance";

export const getProduct = async (productId: number) => {
  return api
    .get<ExtendedProduct>(`product/product-card/${productId}`)
    .then((r) => r.data);
};
