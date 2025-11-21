import type { AuthScreenProps } from "../types";

import { Button, Typography } from "@/components/ui";

import { LoginForm } from "./login-form";

import styles from "../screens.module.css";

export const LoginScreen = ({ onClose, onChangeScreen }: AuthScreenProps) => {
  return (
    <>
      <LoginForm onSuccess={onClose} />

      <div className={styles.linkActions}>
        <Typography>Вы забыли пароль?</Typography>

        <Button variant="link" onClick={() => onChangeScreen("recover")}>
          Восстановить пароль
        </Button>
      </div>

      <div className={styles.actions}>
        <Typography>У вас нет аккаунта?</Typography>
        <Button variant="secondary" onClick={() => onChangeScreen("register")}>
          Зарегистрироваться
        </Button>
      </div>
    </>
  );
};
