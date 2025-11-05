import { Button } from "@/components/ui";

import type { AuthScreenProps } from "../auth-modal/types";

import { RecoverForm } from "../forms";

import styles from "./screen.module.css";

export const RecoverScreen = ({ onClose, onSwitchMode }: AuthScreenProps) => {
  return (
    <div className={styles.content}>
      <h2>Восстановление</h2>

      <RecoverForm onSuccess={onClose} />

      <div className={styles.action}>
        <p className="text-muted">У вас нет аккаунта?</p>

        <Button color="green" onClick={() => onSwitchMode("register")}>
          Зарегистрироваться
        </Button>
      </div>
    </div>
  );
};
