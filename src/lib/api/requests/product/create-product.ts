import type { CreateProductData } from "@/api/types";

import { api } from "@/api/instance";

// export const createProduct = async (data: FormData) =>
//   api("/product/create", {
//     method: "POST",
//     body: data,
//   });

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
