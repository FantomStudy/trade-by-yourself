import type { AuthScreenProps } from "../types";
import { Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { VkLoginButton } from "../../vk-login-button";
import { LoginForm } from "./login-form";

import styles from "../screens.module.css";

export const LoginScreen = ({ onClose, onChangeScreen }: AuthScreenProps) => {
  return (
    <>
      <LoginForm onSuccess={onClose} />

      <VkLoginButton />

      <div className={styles.linkActions}>
        <Typography>Вы забыли пароль?</Typography>

        <Button variant="link" onClick={() => onChangeScreen("recover")}>
          Восстановить пароль
        </Button>
      </div>

      <div className={styles.actions}>
        <Typography>У вас нет аккаунта?</Typography>
        <Button variant="success" onClick={() => onChangeScreen("register")}>
          Зарегистрироваться
        </Button>
      </div>
    </>
  );
};
