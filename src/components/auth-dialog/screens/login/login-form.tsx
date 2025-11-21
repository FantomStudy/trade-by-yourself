"use client";

import type { SubmitHandler } from "react-hook-form";

import type { AuthFormProps } from "../types";
import type { LoginData } from "@/api/types";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useLoginMutation } from "@/api/hooks";
import { loginSchema } from "@/api/types";
import { Button, Field } from "@/components/ui";

import styles from "../forms.module.css";

export const LoginForm = ({ onSuccess }: AuthFormProps) => {
  const loginMutation = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const [error, setError] = useState<string>();

  const onSubmit: SubmitHandler<LoginData> = async (formData) => {
    loginMutation.mutate(formData, {
      onSuccess: () => {
        onSuccess?.();
        setError(undefined);
      },
      onError: (err) => {
        setError(err.message);
      },
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Field
        {...register("login")}
        error={errors.login?.message}
        placeholder="Почта / Номер телефона"
      />
      <Field
        error={errors.password?.message}
        {...register("password")}
        placeholder="Пароль"
      />

      {error && <span className={styles.error}>{error}</span>}

      <Button disabled={isSubmitting} type="submit">
        Войти
      </Button>
    </form>
  );
};
