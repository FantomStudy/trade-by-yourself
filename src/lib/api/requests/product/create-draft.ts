import type { CreateProductData } from "@/api/types";

import { api } from "@/api/instance";

type DraftProductData = Partial<CreateProductData>;

/** Для черновика можно отправлять пустой JSON или только заполненные поля. */
export const createDraftProduct = async (data: DraftProductData = {}) => {
  const hasImages = Array.isArray(data.images) && data.images.length > 0;

  if (!hasImages) {
    const payload = {
      ...(data.name ? { name: data.name } : {}),
      ...(typeof data.price === "number" ? { price: data.price } : {}),
      ...(typeof data.quantity === "number" ? { quantity: data.quantity } : {}),
      ...(data.state ? { state: data.state } : {}),
      ...(typeof data.categoryId === "number" ? { categoryId: data.categoryId } : {}),
      ...(typeof data.subcategoryId === "number" ? { subcategoryId: data.subcategoryId } : {}),
      ...(typeof data.typeId === "number" ? { typeId: data.typeId } : {}),
      ...(data.description ? { description: data.description } : {}),
      ...(data.address ? { address: data.address } : {}),
      ...(typeof data.latitude === "number" ? { latitude: data.latitude } : {}),
      ...(typeof data.longitude === "number" ? { longitude: data.longitude } : {}),
      ...(data.videoUrl ? { videoUrl: data.videoUrl } : {}),
      ...(data.fieldValues ? { fieldValues: data.fieldValues } : {}),
    };

    return api("/product/create-draft", {
      method: "POST",
      body: payload,
    });
  }

  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (typeof data.price === "number") formData.append("price", data.price.toString());
  if (typeof data.quantity === "number") formData.append("quantity", data.quantity.toString());
  if (data.state) formData.append("state", data.state);
  if (typeof data.categoryId === "number") formData.append("categoryId", data.categoryId.toString());
  if (typeof data.subcategoryId === "number")
    formData.append("subcategoryId", data.subcategoryId.toString());
  if (typeof data.typeId === "number") formData.append("typeld", data.typeId.toString());
  if (data.description) formData.append("description", data.description);
  if (data.address) formData.append("address", data.address);
  if (typeof data.latitude === "number") formData.append("latitude", data.latitude.toString());
  if (typeof data.longitude === "number") formData.append("longitude", data.longitude.toString());
  if (data.videoUrl) formData.append("videoUrl", data.videoUrl);
  if (data.fieldValues) formData.append("fieldValues", JSON.stringify(data.fieldValues));
  data.images?.forEach((image) => {
    formData.append("images", image);
  });

  return api("/product/create-draft", {
    method: "POST",
    body: formData,
  });
};
