import type { Product } from "../products/getProducts";
import { api } from "../instance";

export const getFavorites = async () => api<Product[]>("/product/my-favorites");
