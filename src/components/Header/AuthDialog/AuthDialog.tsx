"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button, Dialog } from "../../ui";
import { LoginForm } from "./LoginForm";
import { RecoverForm } from "./RecoverForm";
import { RegisterForm } from "./RegisterForm";
import { VerifyForm } from "./VerifyForm";
import styles from "./AuthDialog.module.css";

const SCREEN_TITLE = {
  login: "Вход",
  register: "Регистрация",
  recover: "Восстановление",
  verify: "Подтверждение номера",
} as const;

type Screen = keyof typeof SCREEN_TITLE;

export const AuthDialog = ({ open, onOpenChange }: React.ComponentProps<typeof Dialog>) => {
  const [screen, setScreen] = useState<Screen>("login");
  const [phoneNumber, setPhoneNumber] = useState("");
  type OpenChangeDetails = Parameters<NonNullable<typeof onOpenChange>>[1];

  const handleOpenChange = (nextOpen: boolean, eventDetails: OpenChangeDetails) => {
    if (!nextOpen) {
      setScreen("login");
      setPhoneNumber("");
    }

    onOpenChange?.(nextOpen, eventDetails);
  };

  const closeDialog = () => {
    setScreen("login");
    setPhoneNumber("");
    onOpenChange?.(false, {} as OpenChangeDetails);
  };

  const handleLoginSuccess = () => {
    closeDialog();
  };

  const handleRegisterSuccess = (nextPhoneNumber: string) => {
    setPhoneNumber(nextPhoneNumber);
    setScreen("verify");
  };

  const handleVerifySuccess = () => {
    toast("Регистрация прошла успешно");
    closeDialog();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title className={styles.title}>{SCREEN_TITLE[screen]}</Dialog.Title>
        </Dialog.Header>

        {screen === "login" && (
          <>
            <LoginForm onSuccess={handleLoginSuccess} />

            <div className={styles.linkActions}>
              <p>Вы забыли пароль?</p>
              <Button variant="link" onClick={() => setScreen("recover")}>
                Восстановить пароль
              </Button>
            </div>

            <div className={styles.actions}>
              <p>У вас нет аккаунта?</p>
              <Button variant="success" onClick={() => setScreen("register")}>
                Зарегистрироваться
              </Button>
            </div>
          </>
        )}

        {screen === "recover" && (
          <>
            <RecoverForm />

            <div className={styles.actions}>
              <p>Вспомнили пароль?</p>
              <Button variant="link" onClick={() => setScreen("login")}>
                Войти
              </Button>
            </div>
          </>
        )}

        {screen === "register" && (
          <>
            <RegisterForm onSuccess={handleRegisterSuccess} />

            <div className={styles.actions}>
              <p>Уже есть аккаунт?</p>
              <Button variant="link" onClick={() => setScreen("login")}>
                Войти
              </Button>
            </div>
          </>
        )}

        {screen === "verify" && (
          <>
            <p className={styles.description}>
              Код подтверждения отправлен на ваш номер телефона. Введите его ниже.
            </p>

            <VerifyForm phoneNumber={phoneNumber} onSuccess={handleVerifySuccess} />

            <div className={styles.actions}>
              <p>Не получили код?</p>
              <Button onClick={() => setScreen("register")}>Отправить снова</Button>
            </div>
          </>
        )}
      </Dialog.Content>
    </Dialog>
  );
};
