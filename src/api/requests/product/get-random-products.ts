import type { Product } from "@/types";

import { api } from "../../instance";

export const getRandomProducts = async () => api<Product[]>("/product/random-products");
