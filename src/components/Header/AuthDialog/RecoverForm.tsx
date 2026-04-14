"use client";

import type { SubmitHandler } from "react-hook-form";
import type { ForgotPasswordBody } from "@/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { forgotPassword, forgotPasswordSchema } from "@/api/auth";
import { Button, Field, Input } from "../../ui";
import styles from "./AuthDialog.module.css";

export const RecoverForm = () => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordBody> = async (data) => {
    setSubmitError(null);

    try {
      await forgotPassword(data);
      setIsCodeSent(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Не удалось отправить код");
    }
  };

  return (
    <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <Input
              {...field}
              disabled={isCodeSent}
              type="email"
              aria-invalid={fieldState.invalid}
              placeholder="Почта"
            />
            {fieldState.invalid && <Field.Error errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {submitError && <span className={styles.error}>{submitError}</span>}

      {isCodeSent && (
        <span className={styles.mutedText}>Код отправлен на указанный email. Проверьте почту.</span>
      )}

      <Button type="submit" disabled={form.formState.isSubmitting || isCodeSent}>
        {isCodeSent ? "Код отправлен" : "Восстановить пароль"}
      </Button>
    </form>
  );
};
