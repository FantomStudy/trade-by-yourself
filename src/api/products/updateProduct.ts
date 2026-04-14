import z from "zod";
import { api } from "../instance";

export const updateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  state: z.enum(["NEW", "USED"]).optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  videoUrl: z.string().optional(),
  fieldValues: z.record(z.string(), z.string()).optional(),
  images: z.array(z.instanceof(File)).optional(),
});

export type UpdateProductBody = z.infer<typeof updateProductSchema>;

export const updateProduct = async (productId: number, body: UpdateProductBody) => {
  const formData = new FormData();

  if (body.name) formData.append("name", body.name);
  if (body.price !== undefined) formData.append("price", body.price.toString());
  if (body.state) formData.append("state", body.state);
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

  return api(`/product/${productId}`, { method: "PATCH", body: formData });
};
