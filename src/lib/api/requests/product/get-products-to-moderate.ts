import type { Product } from "@/types";

import { api } from "../../instance";

export const getProductsToModerate = async () =>
  api<Product[]>("/product/all-products-to-moderate");
