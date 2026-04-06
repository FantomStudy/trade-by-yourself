import type { Product } from "@/types";

import { api } from "@/api/instance";

export const getProducts = async () => api<Product[]>("/product/all-products");
