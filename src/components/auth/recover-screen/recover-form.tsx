"use client";

import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { ForgotPasswordData } from "@/lib/api";

import { Button, Field } from "@/components/ui";
import { forgotPasswordSchema } from "@/lib/api";

import type { AuthFormProps } from "../types";

import { useRecoverMutation } from "../../../lib/api/hooks/mutations/useRecoverMutation";

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
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <Field
        type="email"
        disabled={codeSent}
        error={errors.email?.message}
        placeholder="Email"
        {...register("email")}
      />

      {codeSent && (
        <div className="flex flex-col gap-2">
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

      {error && <span className="form-error">{error}</span>}

      {codeSent && (
        <span className="text-muted">
          Код отправлен на указанный email. Проверьте почту.
        </span>
      )}

      <Button type="submit" disabled={isSubmitting || codeSent}>
        {codeSent ? "Код отправлен" : "Восстановить пароль"}
      </Button>
    </form>
  );
};
