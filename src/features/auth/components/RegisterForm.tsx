"use client";

import clsx from "clsx";
import { useActionState } from "react";

import { Button, Input } from "../../../components/ui";
import { registerAction } from "../actions";

import styles from "./form.module.css";

export const RegisterForm = () => {
  const [error, action, isPending] = useActionState(registerAction, "");

  return (
    <form className={styles.form} action={action}>
      <Input name="fullname" placeholder="ФИО" />
      <Input name="email" placeholder="Почта" />
      <Input name="phoneNumber" placeholder="Номер телефона" />
      <Input name="password" placeholder="Пароль" />

      <div className={styles.actionWrapper}>
        <p className="text-muted">Выберите тип</p>

        <div className={styles.checkboxGroup}>
          <label>
            <input type="radio" name="type" value="ip" /> ИП
          </label>

          <label>
            <input type="radio" name="type" value="ooo" /> ООО
          </label>
        </div>
      </div>

      {Boolean(error) && <p className="text-red">{error}</p>}

      <Button type="submit" disabled={isPending} color="green">
        Зарегистрироваться
      </Button>

      <div className={clsx(styles.actionWrapper, "text-muted")}>
        <p>У вас есть аккаунт?</p>
        <Button>Войти</Button>
      </div>
    </form>
  );
};
