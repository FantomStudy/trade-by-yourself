"use client";

import type { SubmitHandler } from "react-hook-form";
import type { RegisterData } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/api";
import { useRegisterMutation } from "@/api/hooks";
import { Button, Field, PhoneField, usePhoneField } from "@/components/ui";
import styles from "../forms.module.css";

interface RegisterFormProps {
  onSuccess?: (phoneNumber: string) => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const registerMutation = useRegisterMutation();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      where: "sms" as const,
    },
  });
  const [error, setError] = useState<string>();
  const verificationMethod = watch("where");

  const phoneField = usePhoneField({
    control,
    name: "phoneNumber",
    storeCleanValue: true,
  });

  const onSubmit: SubmitHandler<RegisterData> = async (formData) => {
    registerMutation.mutate(formData, {
      onSuccess: () => {
        onSuccess?.(formData.phoneNumber);
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

      <div style={{ display: "flex", gap: "8px", width: "100%" }}>
        <Button
          variant={verificationMethod === "sms" ? "success" : "ghost"}
          onClick={() => setValue("where", "sms")}
          style={{ flex: 1 }}
        >
          SMS
        </Button>
        <Button
          variant={verificationMethod === "telegram" ? "success" : "ghost"}
          onClick={() => setValue("where", "telegram")}
          style={{ flex: 1 }}
        >
          Telegram
        </Button>
      </div>

      {error && <span className={styles.error}>{error}</span>}

      <Button disabled={isSubmitting} type="submit" variant="success">
        Зарегистрироваться
      </Button>
    </form>
  );
};
