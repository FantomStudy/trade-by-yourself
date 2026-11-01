import type { Product } from "./types";
import { api } from "../instance";

export const getUserProducts = (userId: number, activeOnly = true) =>
  api<Product[]>(`/product/user-products/${userId}${activeOnly ? "?activeOnly=true" : ""}`);
