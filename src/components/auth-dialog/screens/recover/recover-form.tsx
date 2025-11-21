"use client";

import type { SubmitHandler } from "react-hook-form";

import type { AuthFormProps } from "../types";
import type { ForgotPasswordData } from "@/lib/api";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useRecoverMutation } from "@/api/hooks";
import { Button, Field } from "@/components/ui";
import { forgotPasswordSchema } from "@/lib/api";

import styles from "../forms.module.css";

export const RecoverForm = ({ onSuccess }: AuthFormProps) => {
  const recoverMutation = useRecoverMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const [error, setError] = useState<string>();
  const [codeSent, setCodeSent] = useState(false);

  const onSubmit: SubmitHandler<ForgotPasswordData> = async (formData) => {
    recoverMutation.mutate(formData.email, {
      onSuccess: () => {
        setCodeSent(true);
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
        disabled={codeSent}
        type="email"
        error={errors.email?.message}
        placeholder="Email"
        {...register("email")}
      />

      {codeSent && (
        <div className={styles.inputGroup}>
          <Field
            // {...register("code")}
            // error={errors.code?.message}
            placeholder="Код"
          />
          <Button type="button" onClick={() => onSuccess?.()}>
            Применить
          </Button>
        </div>
      )}

      {error && <span className={styles.error}>{error}</span>}

      {codeSent && (
        <span className="text-muted">
          Код отправлен на указанный email. Проверьте почту.
        </span>
      )}

      <Button disabled={isSubmitting || codeSent} type="submit">
        {codeSent ? "Код отправлен" : "Восстановить пароль"}
      </Button>
    </form>
  );
};
