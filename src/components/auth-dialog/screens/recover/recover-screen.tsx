import type { AuthScreenProps } from "../types";

import { Button, Typography } from "@/components/ui";

import { RecoverForm } from "./recover-form";

import styles from "../screens.module.css";

export const RecoverScreen = ({ onClose, onChangeScreen }: AuthScreenProps) => {
  return (
    <>
      <RecoverForm onSuccess={onClose} />

      <div className={styles.actions}>
        <Typography>У вас нет аккаунта?</Typography>

        <Button variant="secondary" onClick={() => onChangeScreen("register")}>
          Зарегистрироваться
        </Button>
      </div>
    </>
  );
};
