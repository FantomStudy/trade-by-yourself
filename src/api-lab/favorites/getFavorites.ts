import type { Product } from "@/types/products";
import { api } from "../instance";

export const getFavorites = async () => api<Product[]>("/product/my-favorites");
