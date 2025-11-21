import type { AuthScreenProps } from "../types";

import { Button, Typography } from "@/components/ui";

import { RegisterForm } from "./register-form";

import styles from "../screens.module.css";

export const RegisterScreen = ({
  onClose,
  onChangeScreen,
}: AuthScreenProps) => {
  return (
    <>
      <RegisterForm onSuccess={onClose} />

      <div className={styles.actions}>
        <Typography>Уже есть аккаунт?</Typography>

        <Button onClick={() => onChangeScreen("login")}>Войти</Button>
      </div>
    </>
  );
};
