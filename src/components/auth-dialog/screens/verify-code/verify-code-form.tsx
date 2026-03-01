"use client";

import type { SubmitHandler } from "react-hook-form";

import type { AuthFormProps } from "../types";
import type { VerifyMobileCodeData } from "@/lib/api";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useVerifyMobileCodeMutation } from "@/api/hooks";
import { Field } from "@/components/ui";
import { Button } from "@/components/ui-lab/Button";
import { verifyMobileCodeSchema } from "@/lib/api";
import styles from "../forms.module.css";

interface VerifyCodeFormProps extends AuthFormProps {
  phoneNumber: string;
}

export const VerifyCodeForm = ({
  phoneNumber,
  onSuccess,
}: VerifyCodeFormProps) => {
  const verifyMutation = useVerifyMobileCodeMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyMobileCodeData>({
    resolver: zodResolver(verifyMobileCodeSchema),
    defaultValues: {
      phoneNumber,
    },
  });
  const [error, setError] = useState<string>();

  const onSubmit: SubmitHandler<VerifyMobileCodeData> = async (formData) => {
    verifyMutation.mutate(formData, {
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
      <div className={styles.inputGroup}>
        <Field
          maxLength={6}
          type="text"
          error={errors.code?.message}
          placeholder="Введите код из SMS"
          {...register("code")}
        />
      </div>

      {error && <span className={styles.error}>{error}</span>}

      <Button
        disabled={isSubmitting || verifyMutation.isPending}
        type="submit"
        variant="secondary"
      >
        Подтвердить
      </Button>
    </form>
  );
};
