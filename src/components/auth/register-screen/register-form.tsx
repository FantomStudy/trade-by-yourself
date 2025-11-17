"use client";

import type { SubmitHandler } from "react-hook-form";

import type { AuthFormProps } from "../types";
import type { RegisterData } from "@/lib/api";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Field, PhoneField, usePhoneField } from "@/components/ui";
import { registerSchema, useRegisterMutation } from "@/lib/api";

export const RegisterForm = ({ onSuccess }: AuthFormProps) => {
  const registerMutation = useRegisterMutation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const [error, setError] = useState<string>();

  const phoneField = usePhoneField({
    control,
    name: "phoneNumber",
    storeCleanValue: true,
  });

  const onSubmit: SubmitHandler<RegisterData> = async (formData) => {
    registerMutation.mutate(formData, {
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
        type="text"
        error={errors.fullName?.message}
        placeholder="ФИО"
        {...register("fullName")}
      />

      <Field
        type="email"
        error={errors.email?.message}
        placeholder="Почта"
        {...register("email")}
      />

      <PhoneField placeholder="Номер телефона" {...phoneField} />

      <Field
        type="password"
        error={errors.password?.message}
        placeholder="Пароль"
        {...register("password")}
      />

      {error && <span className="form-error">{error}</span>}

      <Button disabled={isSubmitting} type="submit" variant="secondary">
        Зарегистрироваться
      </Button>
    </form>
  );
};
