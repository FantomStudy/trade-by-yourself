import type { ExtendedProduct } from "@/types";

import { api } from "../../instance";

export const createProduct = async (data: ExtendedProduct) => {
  return api.post("/product/create", data).then((r) => r.data);
};
