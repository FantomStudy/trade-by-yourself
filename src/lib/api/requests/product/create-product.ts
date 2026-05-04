import type { CreateProductData } from "@/api/types";

import { api } from "@/api/instance";

/** Сборка multipart как у публичного create — переиспользуем для черновика. */
export function buildProductFormData(data: CreateProductData): FormData {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("price", data.price.toString());
  formData.append("quantity", data.quantity.toString());
  formData.append("state", data.state);
  formData.append("categoryId", data.categoryId.toString());
  formData.append("subcategoryId", data.subcategoryId.toString());
  // Бэкенд ожидает опечатку в имени поля
  formData.append("typeld", data.typeId.toString());

  if (data.description) formData.append("description", data.description);
  if (data.address) formData.append("address", data.address);
  if (data.latitude !== undefined) formData.append("latitude", data.latitude.toString());
  if (data.longitude !== undefined) formData.append("longitude", data.longitude.toString());
  if (data.videoUrl) formData.append("videoUrl", data.videoUrl);

  if (data.fieldValues && Object.keys(data.fieldValues).length > 0) {
    formData.append("fieldValues", JSON.stringify(data.fieldValues));
  }

  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return formData;
}

export const createProduct = async (data: CreateProductData) => {
  const response = await api("/product/create", {
    method: "POST",
    body: buildProductFormData(data),
  });

  return response;
};
