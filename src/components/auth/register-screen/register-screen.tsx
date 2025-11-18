import type { AuthScreenProps } from "../types";

import { Button, Typography } from "@/components/ui";

import { RegisterForm } from "./register-form";

export const RegisterScreen = ({
  onClose,
  onChangeScreen,
}: AuthScreenProps) => {
  return (
    <>
      <RegisterForm onSuccess={onClose} />

      <div className="flex flex-col gap-4 text-center">
        <Typography className="text-muted-foreground">
          Уже есть аккаунт?
        </Typography>

        <Button onClick={() => onChangeScreen("login")}>Войти</Button>
      </div>
    </>
  );
};
