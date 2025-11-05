"use client";

import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, FormField } from "@/components/ui";
import { login, ResponseError } from "@/lib/api";

import type { LoginData } from "../../schemas";
import type { AuthFormProps } from "./types";

import { loginSchema } from "../../schemas";

import styles from "./form.module.css";

export const LoginForm = ({ onSuccess }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const [error, setError] = useState();

  const onSubmit: SubmitHandler<LoginData> = async (formData: LoginData) => {
    try {
      await login(formData);
      onSuccess?.();
      setError(undefined);
    } catch (err) {
      if (err instanceof ResponseError) {
        setError(
          err.response.data?.message || err.message || "Ошибка авторизации"
        );
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <FormField
        {...register("login")}
        error={errors.login?.message}
        placeholder="Почта / Номер телефона"
      />
      <FormField
        {...register("password")}
        error={errors.password?.message}
        placeholder="Пароль"
      />

      {error && <p className="text-danger">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        Войти
      </Button>
    </form>
  );
};
