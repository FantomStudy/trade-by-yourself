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

  if (data.description) formData.append("description", data.description);
  if (data.brand) formData.append("brand", data.brand);
  if (data.model) formData.append("model", data.model);
  if (data.address) formData.append("address", data.address);
  if (data.latitude !== undefined)
    formData.append("latitude", data.latitude.toString());
  if (data.longitude !== undefined)
    formData.append("longitude", data.longitude.toString());

  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const response = await api("/product/create", {
    method: "POST",
    body: formData,
  });

  return response;
};
