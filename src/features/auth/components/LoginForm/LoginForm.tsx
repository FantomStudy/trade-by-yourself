import type { ChangeEvent, FormEvent } from "react";

import { useState } from "react";

import { Button, Input } from "@/shared/ui";

import styles from "../form.module.css";

export const LoginForm = () => {
  // const [form, setForm] = useState({
  //   login: "",
  //   password: "",
  // });

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;

  //   setForm((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     await fetch("/auth/sign-in", {
  //       method: "POST",
  //       // body: form
  //     });
  //   } catch (err) {
  //     console.log("Login error", err);
  //   }
  // };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Вход</h2>
      <form className={styles.form}>
        <Input name="login" placeholder="Почта / Номер телефона" />
        <Input type="password" name="password" placeholder="Пароль" />
        <Button type="submit">Войти</Button>
      </form>

      <div className={styles.recover}>
        <p>Забыли пароль?</p>
        <Button variant="link">Восстановить пароль</Button>
      </div>

      <div className={styles.register}>
        <p>У вас нет аккаунта?</p>
        <Button color="green">Зарегистрироваться</Button>
      </div>
    </div>
  );
};
