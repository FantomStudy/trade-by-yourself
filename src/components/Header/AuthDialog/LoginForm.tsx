"use client";

import type { SubmitHandler } from "react-hook-form";
import type { LoginBody } from "@/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { login, loginSchema } from "@/api/auth";
import { Button, Field, Input } from "../../ui";
import styles from "./AuthDialog.module.css";

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginBody> = async (data) => {
    setSubmitError(null);

    try {
      await login(data);
      onSuccess();
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Не удалось войти");
    }
  };

  return (
    <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="login"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder="Почта / Номер телефона"
            />
            {fieldState.invalid && <Field.Error errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <Input
              {...field}
              type="password"
              aria-invalid={fieldState.invalid}
              placeholder="Пароль"
            />
            {fieldState.invalid && <Field.Error errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {submitError && <span className={styles.error}>{submitError}</span>}

      <Button type="submit" disabled={form.formState.isSubmitting}>
        Войти
      </Button>
    </form>
  );
};
