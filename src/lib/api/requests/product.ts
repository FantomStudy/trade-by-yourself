import type { CreateProductData } from "../types";
import type { ExtendedProduct, Product } from "@/types";

import { api } from "../instance";

// FIXME: ADD TYPES
export const getAllProducts = async () =>
  api<Product[]>("/product/all-products");

export const getProductById = async (productId: number) =>
  api<ExtendedProduct>(`/product/product-card/${productId}`);

export const getCurrentUserProducts = async () => {
  console.log("Calling /product/my-products...");
  const response = await api<Product[]>("/product/my-products");
  console.log("Raw API response from /product/my-products:", response);
  console.log("Response type:", typeof response);
  console.log("Response is array:", Array.isArray(response));
  if (Array.isArray(response) && response.length > 0) {
    console.log("First item from API:", response[0]);
    console.log(
      "First item stringified:",
      JSON.stringify(response[0], null, 2),
    );
  }
  return response;
};

export const getSearchedProducts = async (query: unknown) =>
  api<unknown[]>(`/product/search`, {
    query: { query },
  });

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
 * - typeId: ID типа подкатегории
 *
 * Опциональные поля:
 * - description: Описание товара
 * - address: Адрес продавца
 * - images: Массив файлов изображений (до 8 файлов)
 * - fieldValues: Объект с дополнительными полями (ключ - ID поля, значение - строка)
 */
export const createProduct = async (data: CreateProductData) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("price", data.price.toString());
  formData.append("state", data.state);
  formData.append("categoryId", data.categoryId.toString());
  formData.append("subcategoryId", data.subcategoryId.toString());
  formData.append("typeld", data.typeId.toString()); // typeld вместо typeId!

  if (data.description) formData.append("description", data.description);
  if (data.address) formData.append("address", data.address);
  if (data.latitude !== undefined)
    formData.append("latitude", data.latitude.toString());
  if (data.longitude !== undefined)
    formData.append("longitude", data.longitude.toString());

  // Добавляем дополнительные поля как JSON
  if (data.fieldValues && Object.keys(data.fieldValues).length > 0) {
    formData.append("fieldValues", JSON.stringify(data.fieldValues));
  }

  // Добавляем изображения
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  console.log("FormData содержимое:");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  const response = await api("/product/create", {
    method: "POST",
    body: formData,
  });

  return response;
};
