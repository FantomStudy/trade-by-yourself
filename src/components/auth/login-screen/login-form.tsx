"use client";

import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Field } from "@/components/ui";

import type { AuthFormProps } from "../types";
import { LoginData, loginSchema } from "@/api/types";
import { useLoginMutation } from "@/api/hooks";

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
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
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

      {error && <span className="form-error">{error}</span>}

      <Button type="submit" disabled={isSubmitting}>
        Войти
      </Button>
    </form>
  );
};
