import type { AuthScreenProps } from "../types";

import { Typography } from "@/components/ui";
import { Button } from "@/components/ui-lab/Button";

import { VerifyCodeForm } from "./verify-code-form";
import styles from "../screens.module.css";

export const VerifyCodeScreen = ({
  onClose,
  onChangeScreen,
  phoneNumber,
}: AuthScreenProps) => {
  return (
    <>
      <Typography className={styles.description}>
        Код подтверждения отправлен на ваш номер телефона. Введите его ниже.
      </Typography>

      <VerifyCodeForm phoneNumber={phoneNumber || ""} onSuccess={onClose} />

      <div className={styles.actions}>
        <Typography>Не получили код?</Typography>

        <Button onClick={() => onChangeScreen("register")}>
          Отправить снова
        </Button>
      </div>
    </>
  );
};
