import type { AuthScreenProps } from "../types";
import { Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { RegisterForm } from "./register-form";
import styles from "../screens.module.css";

export const RegisterScreen = ({ onChangeScreen, onPhoneNumberChange }: AuthScreenProps) => {
  const handleRegisterSuccess = (phoneNumber: string) => {
    onPhoneNumberChange?.(phoneNumber);
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
