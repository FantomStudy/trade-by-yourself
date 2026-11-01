"use client";

import { useState } from "react";
import { toast } from "sonner";

import { verifyEmailCode } from "@/lib/api/requests/user";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { Field } from "@/components/ui";
import { Button } from "@/components/ui/Button";

import styles from "../forms.module.css";

interface VerifyEmailFormProps {
  onSuccess?: () => void;
}

export const VerifyEmailForm = ({ onSuccess }: VerifyEmailFormProps) => {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim();
    if (!cleanCode) {
      setError("Введите код подтверждения");
      return;
    }
    if (cleanCode.length !== 6) {
      setError("Код должен состоять из 6 цифр");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(undefined);
      await verifyEmailCode(cleanCode);
      toast.success("Почта успешно подтверждена!");
      onSuccess?.();
    } catch (err) {
      setError(getApiErrorMessage(err, "Неверный код подтверждения"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <Field
          maxLength={6}
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, ""));
            setError(undefined);
          }}
          placeholder="Введите 6 цифр из письма"
        />
      </div>

      {error && <span className={styles.error}>{error}</span>}

      <Button disabled={isSubmitting || code.length < 6} type="submit" variant="success">
        Подтвердить почту
      </Button>
    </form>
  );
};
