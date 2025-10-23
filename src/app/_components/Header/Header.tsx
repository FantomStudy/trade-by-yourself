"use client";
import { LoginForm } from "@/features/auth/components/LoginForm/LoginForm";
import { useModal } from "@/shared/providers/modalContext";
import { Button, Logo } from "@/shared/ui";

import styles from "./Header.module.css";

export const Header = () => {
  const { openModal } = useModal();

  const openLoginForm = () => openModal(<LoginForm />);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerWrapper}>
          <Logo className={styles.logo} />
          <div className={styles.actions}>
            <Button variant="ghost" onClick={openLoginForm}>
              Вход / Регистрация
            </Button>
            <Button color="green">Разместить объявление</Button>
          </div>
        </div>
      </div>
    </header>
  );
};
