import type { Product } from "@/types";

import type { CreateProductData } from "../types";

import { api } from "../instance";

//FIXME: ADD TYPES
export const getAllProducts = async () =>
  api.get<Product[]>("/product/all-products");

export const getProductById = async (productId: number) =>
  api.get<unknown>(`/product/product-card/${productId}`);

export const getCurrentUserProducts = async () =>
  api.get<Product[]>("/product/my-products");

// export const getSearchedProducts = async (query: unknown) =>
//   api.get<unknown[]>(`/product/search`, {
//     query: { query },
//   });

export const createProduct = async (data: CreateProductData) =>
  api.post<unknown>("/product/create-product", { body: data });
