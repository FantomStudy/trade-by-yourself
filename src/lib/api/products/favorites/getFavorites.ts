import type { Product } from "../types";
import { api } from "@/api/instance";

export const getFavorites = () => api<Product[]>("/product/my-favorites");
