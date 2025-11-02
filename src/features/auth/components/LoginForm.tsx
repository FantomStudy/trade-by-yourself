"use client";

import clsx from "clsx";
import { useActionState } from "react";

import { Button, Input } from "@/components/ui";

import { loginAction } from "../actions";

import styles from "./form.module.css";

export const LoginForm = () => {
  const [error, action, isPending] = useActionState(loginAction);

  return (
    <form className={styles.form} action={action}>
      <Input name="login" placeholder="Почта / Номер телефона" />

      <Input name="password" placeholder="Пароль" />

      <Button type="submit" disabled={isPending}>
        Войти
      </Button>

      <p className="text-muted">
        Вы забыли пароль? <br />
        <Button variant="link">Восстановить пароль</Button>
      </p>

      <div className={clsx(styles.actionWrapper, "text-muted")}>
        <p>У вас нет аккаунта?</p>
        <Button color="green">Зарегистрироваться</Button>
      </div>
    </form>
  );
};
