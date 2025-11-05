import z from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(1, "ФИО обязательно"),
  email: z.email("Введите корректный email").min(1, "Email обязателен"),
  phoneNumber: z
    .string()
    .min(1, "Номер телефона обязателен")
    .regex(/^\+?\d{10,15}$/, "Введите корректный номер телефона"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  profileType: z.enum(["INDIVIDUAL", "OOO"], {
    message: "Выберите тип профиля",
  }),
});

export type RegisterData = z.infer<typeof registerSchema>;
