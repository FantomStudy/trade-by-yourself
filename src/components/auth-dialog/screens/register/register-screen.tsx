import type { AuthScreenProps } from "../types";

import { Button, Typography } from "@/components/ui";

import { RegisterForm } from "./register-form";

import styles from "../screens.module.css";

export const RegisterScreen = ({ onChangeScreen }: AuthScreenProps) => {
  const handleRegisterSuccess = () => {
    onChangeScreen("verify-code");
  };

  return (
    <>
      <RegisterForm onSuccess={handleRegisterSuccess} />

      <div className={styles.actions}>
        <Typography>Уже есть аккаунт?</Typography>

        <Button onClick={() => onChangeScreen("login")}>Войти</Button>
      </div>
    </>
  );
};
