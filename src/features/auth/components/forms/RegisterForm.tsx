"use client";

import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, FormField } from "@/components/ui";
import { register as registerRequest, ResponseError } from "@/lib/api";

import type { RegisterData } from "../../schemas";
import type { AuthFormProps } from "./types";

import { registerSchema } from "../../schemas";

import styles from "./form.module.css";

export const RegisterForm = ({ onSuccess }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });
  const [error, setError] = useState<string>();

  const onSubmit: SubmitHandler<RegisterData> = async (
    formData: RegisterData
  ) => {
    try {
      await registerRequest({
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        profileType: formData.profileType,
      });
      onSuccess?.();
      setError(undefined);
    } catch (err) {
      if (err instanceof ResponseError) {
        setError(
          err.response.data?.message || err.message || "Ошибка регистрации"
        );
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <FormField
        type="text"
        error={errors.fullName?.message}
        placeholder="ФИО"
        {...register("fullName")}
      />

      <FormField
        type="email"
        error={errors.email?.message}
        placeholder="Почта"
        {...register("email")}
      />

      <FormField
        type="tel"
        error={errors.phoneNumber?.message}
        placeholder="Номер телефона"
        {...register("phoneNumber")}
      />

      <FormField
        type="password"
        error={errors.password?.message}
        placeholder="Пароль"
        {...register("password")}
      />

      <div className={styles.action}>
        <p className="text-muted">Выберите тип</p>

        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="radio"
              value="INDIVIDUAL"
              {...register("profileType")}
            />
            ИП
          </label>

          <label>
            <input type="radio" value="OOO" {...register("profileType")} />
            ООО
          </label>
        </div>

        {errors.profileType && (
          <p className="text-danger">{errors.profileType.message}</p>
        )}
      </div>

      {error && <p className="text-danger">{error}</p>}

      <Button type="submit" disabled={isSubmitting} color="green">
        Зарегистрироваться
      </Button>
    </form>
  );
};
