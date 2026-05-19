"use client";

import type { SubmitHandler } from "react-hook-form";

import type { AuthFormProps } from "../types";
import type { ForgotPasswordData } from "@/lib/api";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useRecoverMutation } from "@/api/hooks";
import { changePassword, forgotPasswordSchema, verifyCode } from "@/lib/api";
import { getCleanPhoneForSubmit, isValidPhoneNumber } from "@/lib/phone";
import { Field } from "@/components/ui";
import { Button } from "@/components/ui/Button";

import styles from "../forms.module.css";

type RecoverStep = "send" | "verify" | "done";

export const RecoverForm = ({ onSuccess }: AuthFormProps) => {
  const recoverMutation = useRecoverMutation();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      where: "email",
      email: "",
      phoneNumber: "",
      code: "",
      newPassword: "",
    },
  });

  const [step, setStep] = useState<RecoverStep>("send");
  const [error, setError] = useState<string>();
  const [sentMessage, setSentMessage] = useState<string>("");

  const where = watch("where") || "email";

  const onSendCode: SubmitHandler<ForgotPasswordData> = async (formData) => {
    setError(undefined);
    const payload: ForgotPasswordData = {
      where,
      email: where === "email" ? formData.email : undefined,
      phoneNumber:
        where === "sms" && formData.phoneNumber
          ? getCleanPhoneForSubmit(formData.phoneNumber)
          : undefined,
    };

    if (where === "email" && !payload.email) {
      setError("Введите email");
      return;
    }
    if (where === "sms") {
      if (!formData.phoneNumber) {
        setError("Введите номер телефона");
        return;
      }
      if (!isValidPhoneNumber(formData.phoneNumber)) {
        setError("Введите корректный номер телефона");
        return;
      }
    }

    recoverMutation.mutate(payload, {
      onSuccess: (res) => {
        // Новый код — новая сессия восстановления.
        setSentMessage(res.message || "Код отправлен");
        setStep("verify");
      },
      onError: (err) => {
        setError(err.message);
      },
    });
  };

  const onApplyCode: SubmitHandler<ForgotPasswordData> = async (formData) => {
    try {
      setError(undefined);
      const code = (formData.code || "").trim();
      const newPassword = (formData.newPassword || "").trim();

      if (!/^\d{6}$/.test(code)) {
        setError("Введите 6-значный код");
        return;
      }
      if (newPassword.length < 6) {
        setError("Пароль должен быть не менее 6 символов");
        return;
      }

      const verifyRes = await verifyCode(code);
      const maybeUserId = Number(verifyRes?.userId);
      if (!Number.isFinite(maybeUserId) || maybeUserId <= 0) {
        setError("Не удалось получить userId после проверки кода");
        return;
      }

      await changePassword({ userId: maybeUserId, password: newPassword });
      setStep("done");
      setTimeout(() => onSuccess?.(), 500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка при восстановлении пароля");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(step === "send" ? onSendCode : onApplyCode)}>
      <div className={styles.inputGroup}>
        <div className="flex gap-2">
          <Button type="button" variant={where === "email" ? "primary" : "success"} onClick={() => setValue("where", "email")}>
            Email
          </Button>
          <Button type="button" variant={where === "sms" ? "primary" : "success"} onClick={() => setValue("where", "sms")}>
            SMS
          </Button>
        </div>
        <input type="radio" value="email" {...register("where")} className="hidden" />
        <input type="radio" value="sms" {...register("where")} className="hidden" />

        {where === "email" ? (
          <Field disabled={step !== "send"} type="email" error={errors.email?.message} placeholder="Email" {...register("email")} />
        ) : (
          <Field disabled={step !== "send"} type="tel" error={errors.phoneNumber?.message} placeholder="Номер телефона" {...register("phoneNumber")} />
        )}
      </div>

      {step !== "send" && (
        <div className={styles.inputGroup}>
          <Field placeholder="Код из сообщения" {...register("code")} />
          <Field type="password" placeholder="Новый пароль" {...register("newPassword")} />
        </div>
      )}

      {error && <span className={styles.error}>{error}</span>}
      {sentMessage && step !== "done" && <span className="text-muted">{sentMessage}</span>}
      {step === "done" && <span className="text-muted">Пароль успешно изменен</span>}

      {step === "send" ? (
        <Button disabled={isSubmitting || recoverMutation.isPending} type="submit">
          {recoverMutation.isPending ? "Отправка..." : "Отправить код"}
        </Button>
      ) : (
        <Button disabled={isSubmitting || step === "done"} type="submit">
          Сменить пароль
        </Button>
      )}
    </form>
  );
};
