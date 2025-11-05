import z from "zod";

export const loginSchema = z.object({
  login: z.string().min(1, "Почта или номер телефона обязательны"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

export type LoginData = z.infer<typeof loginSchema>;
