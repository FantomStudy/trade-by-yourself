import z from "zod";
import { api } from "../instance";

export const createProductSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  price: z.number().min(0, "Цена должна быть положительным числом"),
  state: z.enum(["NEW", "USED"]),
  description: z.string().optional(),
  address: z.string().optional(),
  categoryId: z.number(),
  subcategoryId: z.number(),
  typeId: z.number(),
  fieldValues: z.record(z.string(), z.string()).optional(),
  images: z.array(z.instanceof(File)).optional(),
  videoUrl: z.string().optional(),
});

export type CreateProductBody = z.infer<typeof createProductSchema>;

export const createProduct = (body: CreateProductBody) => {
  const formData = new FormData();

  formData.append("name", body.name);
  formData.append("price", body.price.toString());
  formData.append("state", body.state);
  formData.append("categoryId", body.categoryId.toString());
  formData.append("subcategoryId", body.subcategoryId.toString());
  formData.append("typeId", body.typeId.toString());

  if (body.description) formData.append("description", body.description);
  if (body.address) formData.append("address", body.address);
  if (body.videoUrl) formData.append("videoUrl", body.videoUrl);

  if (body.fieldValues && Object.keys(body.fieldValues).length > 0) {
    formData.append("fieldValues", JSON.stringify(body.fieldValues));
  }

  if (body.images && body.images.length > 0) {
    body.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return api("/product/create", { method: "POST", body: formData });
};
