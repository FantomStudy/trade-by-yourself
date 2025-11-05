"use client";

import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, FormField } from "@/components/ui";
import { forgotPassword, ResponseError } from "@/lib/api";

import type { RecoverData } from "../../schemas";
import type { AuthFormProps } from "./types";

import { recoverSchema } from "../../schemas";

import styles from "./form.module.css";

export const RecoverForm = ({ onSuccess }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(recoverSchema),
  });
  const [error, setError] = useState<string>();
  const [codeSent, setCodeSent] = useState(false);

  const onSubmit: SubmitHandler<RecoverData> = async (
    formData: RecoverData
  ) => {
    try {
      await forgotPassword({ email: formData.email });
      setCodeSent(true);
      setError(undefined);
    } catch (err) {
      if (err instanceof ResponseError) {
        setError(
          err.response.data?.message ||
            err.message ||
            "Ошибка восстановления пароля"
        );
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <FormField
        type="email"
        disabled={codeSent}
        error={errors.email?.message}
        placeholder="Email"
        {...register("email")}
      />

      {codeSent && (
        <div className={styles.codeInput}>
          <FormField
            {...register("code")}
            error={errors.code?.message}
            placeholder="Код"
          />
          <Button type="button" onClick={() => onSuccess?.()}>
            Применить
          </Button>
        </div>
      )}

      {error && <p className="text-danger">{error}</p>}

      {codeSent && (
        <p className="text-muted">
          Код отправлен на указанный email. Проверьте почту.
        </p>
      )}

      <Button type="submit" disabled={isSubmitting || codeSent}>
        {codeSent ? "Код отправлен" : "Восстановить пароль"}
      </Button>
    </form>
  );
};
