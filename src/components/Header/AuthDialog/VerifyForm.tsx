"use client";

import type { SubmitHandler } from "react-hook-form";
import type { VerifyPhoneQuery } from "@/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { verifyMobileCode, verifyPhoneSchema } from "@/api/auth";
import { Button, Field, Input } from "../../ui";
import styles from "./AuthDialog.module.css";

interface VerifyFormProps {
  phoneNumber: string;
  onSuccess: () => void;
}

export const VerifyForm = ({ phoneNumber, onSuccess }: VerifyFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(verifyPhoneSchema),
    defaultValues: {
      phoneNumber,
      code: "",
    },
  });

  const onSubmit: SubmitHandler<VerifyPhoneQuery> = async (data) => {
    setSubmitError(null);

    try {
      await verifyMobileCode(data);
      onSuccess();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Не удалось подтвердить код");
    }
  };

  return (
    <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
      <input type="hidden" {...form.register("phoneNumber")} value={phoneNumber} />

      <Controller
        name="code"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <Input
              {...field}
              type="text"
              inputMode="numeric"
              maxLength={6}
              aria-invalid={fieldState.invalid}
              placeholder="Введите код из SMS"
            />
            {fieldState.invalid && <Field.Error errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {submitError && <span className={styles.error}>{submitError}</span>}

      <Button type="submit" variant="success" disabled={form.formState.isSubmitting}>
        Подтвердить
      </Button>
    </form>
  );
};
