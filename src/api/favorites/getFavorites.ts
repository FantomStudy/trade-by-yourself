import type { Product } from "../products/getProducts";
import { api } from "../instance";

export const getFavorites = () => api<Product[]>("/product/my-favorites");
