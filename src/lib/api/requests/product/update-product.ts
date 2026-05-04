import type { UpdateProductData } from "@/api/types";

import { api } from "@/api/instance";

export const updateProduct = async (productId: number, data: UpdateProductData) => {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.price !== undefined) formData.append("price", data.price.toString());
  if (data.quantity !== undefined) formData.append("quantity", data.quantity.toString());
  if (data.state) formData.append("state", data.state);
  if (data.description) formData.append("description", data.description);
  if (data.address) formData.append("address", data.address);
  if (data.videoUrl) formData.append("videoUrl", data.videoUrl);

  // Добавляем дополнительные поля как JSON
  if (data.fieldValues && Object.keys(data.fieldValues).length > 0) {
    formData.append("fieldValues", JSON.stringify(data.fieldValues));
  }

  // Добавляем новые изображения
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const response = await api(`/product/${productId}`, {
    method: "PATCH",
    body: formData,
  });

  return response;
};
