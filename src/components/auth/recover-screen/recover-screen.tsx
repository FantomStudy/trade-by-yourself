import type { AuthScreenProps } from "../types";

import { Button, Typography } from "@/components/ui";

import { RecoverForm } from "./recover-form";

export const RecoverScreen = ({ onClose, onChangeScreen }: AuthScreenProps) => {
  return (
    <>
      <RecoverForm onSuccess={onClose} />

      <div className="flex flex-col gap-4 text-center">
        <Typography className="text-muted">У вас нет аккаунта?</Typography>

        <Button variant="secondary" onClick={() => onChangeScreen("register")}>
          Зарегистрироваться
        </Button>
      </div>
    </>
  );
};
