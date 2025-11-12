import z from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  address: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.number(),
  description: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
  model: z.string().optional(),
  price: z.number().min(0, "Цена должна быть положительным числом"),
  state: z.enum(["NEW", "USED"]),
  subcategoryId: z.number(),
});

export type CreateProductData = z.infer<typeof createProductSchema>;
