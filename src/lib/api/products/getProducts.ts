import type { Product, ProductFilters } from "./types";
import { api } from "../instance";

export const getProducts = (query?: ProductFilters) =>
  api<Product[]>("/product/all-products", { query });
