"use client";

import type { SubmitHandler } from "react-hook-form";
import type { RegisterBody } from "@/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { register, registerSchema } from "@/api/auth";
import { formatPhone, normalizePhone } from "@/lib/phone";
import { Button, Field, Input } from "../../ui";
import styles from "./AuthDialog.module.css";

interface RegisterFormProps {
  onSuccess: (phoneNumber: string) => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      phoneNumber: "",
      where: "sms",
    },
  });

  const onSubmit: SubmitHandler<RegisterBody> = async (data) => {
    setSubmitError(null);

    try {
      await register(data);
      onSuccess(data.phoneNumber);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Не удалось зарегистрироваться");
    }
  };

  return (
    <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="fullName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <Input {...field} aria-invalid={fieldState.invalid} placeholder="ФИО" />
            {fieldState.invalid && <Field.Error errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <Input {...field} type="email" aria-invalid={fieldState.invalid} placeholder="Почта" />
            {fieldState.invalid && <Field.Error errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="phoneNumber"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <Input
              {...field}
              value={formatPhone(field.value ?? "")}
              onChange={(event) => field.onChange(normalizePhone(event.target.value))}
              type="tel"
              inputMode="tel"
              maxLength={18}
              aria-invalid={fieldState.invalid}
              placeholder="Номер телефона"
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

      <Controller
        name="where"
        control={form.control}
        render={({ field }) => (
          <Field>
            <div
              className={styles.verificationGroup}
              role="radiogroup"
              aria-label="Способ верификации"
            >
              <label
                className={styles.verificationOption}
                data-checked={field.value === "sms" ? "true" : undefined}
              >
                <input
                  ref={field.ref}
                  className={styles.verificationInput}
                  type="radio"
                  name={field.name}
                  value="sms"
                  checked={field.value === "sms"}
                  onChange={() => field.onChange("sms")}
                  onBlur={field.onBlur}
                />
                <span className={styles.verificationLabel}>SMS</span>
              </label>

              <label
                className={styles.verificationOption}
                data-checked={field.value === "telegram" ? "true" : undefined}
              >
                <input
                  className={styles.verificationInput}
                  type="radio"
                  name={field.name}
                  value="telegram"
                  checked={field.value === "telegram"}
                  onChange={() => field.onChange("telegram")}
                  onBlur={field.onBlur}
                />
                <span className={styles.verificationLabel}>Telegram</span>
              </label>
            </div>
          </Field>
        )}
      />

      {submitError && <span className={styles.error}>{submitError}</span>}

      <Button variant="success" type="submit" disabled={form.formState.isSubmitting}>
        Зарегистрироваться
      </Button>
    </form>
  );
};
