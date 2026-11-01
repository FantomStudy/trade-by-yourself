"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { AuthScreenProps } from "../types";
import { sendVerifyEmail } from "@/lib/api/requests/user";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";

import { VerifyEmailForm } from "./verify-email-form";

import styles from "../screens.module.css";

export const VerifyEmailScreen = ({ onClose, onAuthComplete, email }: AuthScreenProps) => {
  const [resendTimer, setResendTimer] = useState(60);
  const [isSending, setIsSending] = useState(false);

  // Send verification email on initial mount
  useEffect(() => {
    let mounted = true;
    sendVerifyEmail().catch((err) => {
      if (mounted) {
        toast.error(getApiErrorMessage(err, "Не удалось отправить код на почту"));
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResend = async () => {
    if (resendTimer > 0 || isSending) return;
    try {
      setIsSending(true);
      await sendVerifyEmail();
      toast.success("Код подтверждения отправлен на вашу почту");
      setResendTimer(60);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Ошибка повторной отправки кода"));
    } finally {
      setIsSending(false);
    }
  };

  const handleSuccess = () => {
    if (onAuthComplete) {
      onAuthComplete();
    } else {
      onClose();
    }
  };

  return (
    <>
      <Typography className={styles.description}>
        {email ? (
          <>
            Код подтверждения отправлен на почту <b>{email}</b>. Введите его ниже.
          </>
        ) : (
          "Код подтверждения отправлен на вашу электронную почту. Введите его ниже."
        )}
      </Typography>

      <VerifyEmailForm onSuccess={handleSuccess} />

      <div className={styles.actions}>
        <Typography>Не получили письмо?</Typography>

        <Button
          disabled={resendTimer > 0 || isSending}
          onClick={handleResend}
          type="button"
        >
          {resendTimer > 0
            ? `Отправить снова (${resendTimer}с)`
            : isSending
              ? "Отправка..."
              : "Отправить снова"}
        </Button>
      </div>
    </>
  );
};
