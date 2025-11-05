import { Button } from "@/components/ui";

import type { AuthScreenProps } from "../auth-modal/types";

import { LoginForm } from "../forms";

import styles from "./screen.module.css";

export const LoginScreen = ({ onClose, onSwitchMode }: AuthScreenProps) => {
  return (
    <div className={styles.content}>
      <h2>Вход</h2>

      <LoginForm onSuccess={onClose} />

      <div>
        <p className="text-muted">Вы забыли пароль?</p>

        <Button variant="link" onClick={() => onSwitchMode("recover")}>
          Восстановить пароль
        </Button>
      </div>

      <div className={styles.action}>
        <p className="text-muted">У вас нет аккаунта?</p>
        <Button color="green" onClick={() => onSwitchMode("register")}>
          Зарегистрироваться
        </Button>
      </div>
    </div>
  );
};
