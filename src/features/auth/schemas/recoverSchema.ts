import z from "zod";

export const recoverSchema = z.object({
  email: z.email("Введите корректный email").min(1, "Email обязателен"),
  code: z.string().optional(),
});

export type RecoverData = z.infer<typeof recoverSchema>;
