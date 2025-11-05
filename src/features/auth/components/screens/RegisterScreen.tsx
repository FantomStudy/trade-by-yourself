import { Button } from "@/components/ui";

import type { AuthScreenProps } from "../auth-modal/types";

import { RegisterForm } from "../forms";

import styles from "./screen.module.css";

export const RegisterScreen = ({ onClose, onSwitchMode }: AuthScreenProps) => {
  return (
    <div className={styles.content}>
      <h2>Регистрация</h2>

      <RegisterForm onSuccess={onClose} />

      <div className={styles.action}>
        <p className="text-muted">Уже есть аккаунт?</p>

        <Button onClick={() => onSwitchMode("login")}>Войти</Button>
      </div>
    </div>
  );
};
