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

/**
 * Создание нового объявления о продаже товара
 *
 * @param data - Данные для создания товара
 * @returns Promise с результатом создания
 *
 * Обязательные поля:
 * - name: Название продукта
 * - price: Цена в рублях
 * - state: Состояние товара (NEW/USED)
 * - categoryId: ID категории
 * - subcategoryId: ID подкатегории
 *
 * Опциональные поля:
 * - brand: Бренд
 * - model: Модель
 * - description: Описание товара
 * - address: Адрес продавца
 * - images: Массив файлов изображений (до 8 файлов)
 */
export const createProduct = async (data: CreateProductData) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("price", data.price.toString());
  formData.append("state", data.state);
  formData.append("categoryId", data.categoryId.toString());
  formData.append("subcategoryId", data.subcategoryId.toString());

  if (data.description) formData.append("description", data.description);
  if (data.brand) formData.append("brand", data.brand);
  if (data.model) formData.append("model", data.model);
  if (data.address) formData.append("address", data.address);
  if (data.latitude !== undefined)
    formData.append("latitude", data.latitude.toString());
  if (data.longitude !== undefined)
    formData.append("longitude", data.longitude.toString());

  // Добавляем изображения
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const response = await api.post("/product/create", formData);

  return response;
};
