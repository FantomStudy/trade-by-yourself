import z from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  address: z.string().optional(),
  categoryId: z.number(),
  description: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  price: z.number().min(0, "Цена должна быть положительным числом"),
  quantity: z.number().int().min(1, "Количество должно быть целым числом больше 0"),
  state: z.enum(["NEW", "USED"]),
  subcategoryId: z.number(),
  typeId: z.number(),
  fieldValues: z.record(z.string(), z.string()).optional(),
  videoUrl: z.string().optional(),
});

export type CreateProductData = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().int().min(1).optional(),
  state: z.enum(["NEW", "USED"]).optional(),
  categoryId: z.number().optional(),
  subcategoryId: z.number().optional(),
  typeId: z.number().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  videoUrl: z.string().optional(),
  fieldValues: z.record(z.string(), z.string()).optional(),
  images: z.array(z.instanceof(File)).optional(),
});

export type UpdateProductData = z.infer<typeof updateProductSchema>;
