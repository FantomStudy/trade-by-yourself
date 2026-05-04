import type { CreateProductData } from "@/api/types";

import { api } from "@/api/instance";

import { buildProductFormData } from "./create-product";

/** Сохранить черновик: тот же multipart, что и create. */
export const createDraftProduct = async (data: CreateProductData) =>
  api("/product/create-draft", {
    method: "POST",
    body: buildProductFormData(data),
  });
