import type { UpdateProductData } from "@/api/types";

import { api } from "@/api/instance";

export const updateProduct = async (productId: number, data: UpdateProductData) => {
  const hasNewImages = Array.isArray(data.images) && data.images.length > 0;

  if (!hasNewImages) {
    const payload = {
      ...(data.name ? { name: data.name } : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.quantity !== undefined ? { quantity: data.quantity } : {}),
      ...(data.state ? { state: data.state } : {}),
      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
      ...(data.subcategoryId !== undefined
        ? { subcategoryId: data.subcategoryId, subCategoryId: data.subcategoryId }
        : {}),
      ...(data.typeId !== undefined ? { typeId: data.typeId, typeld: data.typeId } : {}),
      ...(data.description ? { description: data.description } : {}),
      ...(data.address ? { address: data.address } : {}),
      ...(data.videoUrl ? { videoUrl: data.videoUrl } : {}),
      ...(data.fieldValues && Object.keys(data.fieldValues).length > 0
        ? { fieldValues: data.fieldValues }
        : {}),
    };

    return api(`/product/${productId}`, {
      method: "PATCH",
      body: payload,
    });
  }

  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.price !== undefined) formData.append("price", data.price.toString());
  if (data.quantity !== undefined) formData.append("quantity", data.quantity.toString());
  if (data.state) formData.append("state", data.state);
  if (data.categoryId !== undefined) formData.append("categoryId", data.categoryId.toString());
  if (data.subcategoryId !== undefined) formData.append("subCategoryId", data.subcategoryId.toString());
  if (data.subcategoryId !== undefined) formData.append("subcategoryId", data.subcategoryId.toString());
  if (data.typeId !== undefined) formData.append("typeId", data.typeId.toString());
  if (data.typeId !== undefined) formData.append("typeld", data.typeId.toString());
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

  return api(`/product/${productId}`, {
    method: "PATCH",
    body: formData,
  });
};
