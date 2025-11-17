import type { AuthScreenProps } from "../types";

import { Button, Typography } from "@/components/ui";

import { LoginForm } from "./login-form";

export const LoginScreen = ({ onClose, onChangeScreen }: AuthScreenProps) => {
  return (
    <>
      <LoginForm onSuccess={onClose} />

      <div className="text-center">
        <Typography className="text-muted">Вы забыли пароль?</Typography>

        <Button variant="link" onClick={() => onChangeScreen("recover")}>
          Восстановить пароль
        </Button>
      </div>

      <div className="flex flex-col gap-4 text-center">
        <Typography className="text-muted">У вас нет аккаунта?</Typography>
        <Button variant="secondary" onClick={() => onChangeScreen("register")}>
          Зарегистрироваться
        </Button>
      </div>
    </>
  );
};
