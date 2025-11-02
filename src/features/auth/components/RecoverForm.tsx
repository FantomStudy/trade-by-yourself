"use client";

import clsx from "clsx";
import { useActionState } from "react";

import { Button, Input } from "../../../components/ui";
import { recoverAction } from "../actions";

import styles from "./form.module.css";

export const RecoverForm = () => {
  const [error, action, isPending] = useActionState(recoverAction, "");

  return (
    <form className={styles.form} action={action}>
      <Input name="login" placeholder="Почта / Номер телефона" />

      <div className={styles.codeInput}>
        <Input name="code" placeholder="Код" />
        <Button>Применить</Button>
      </div>

      {Boolean(error) && <p className="text-red">{error}</p>}

      <Button type="submit" disabled={isPending} color="green">
        Войти
      </Button>

      <div className={clsx(styles.actionWrapper, "text-muted")}>
        <p>У вас есть аккаунт?</p>
        <Button>Войти</Button>
      </div>
    </form>
  );
};
