import type { ExtendedProduct } from "@/types";

import { api } from "../../instance";

export const createProduct = async (data: ExtendedProduct) => {
  const response = await api.post("/product/create", data);
  return response.data;
};
