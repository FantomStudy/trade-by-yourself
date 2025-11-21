"use client";

import { useState } from "react";

import { AuthDialog } from "@/components/auth-dialog";
import { Button } from "@/components/ui";

import styles from "./header.module.css";

export const HeaderActionsGuest = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuthDialog = () => {
    setIsAuthOpen(true);
  };

  return (
    <div className={styles.actions}>
      <Button variant="ghost" onClick={openAuthDialog}>
        Вход / Регистрация
      </Button>

      <Button variant="secondary" onClick={openAuthDialog}>
        Разместить объявление
      </Button>

      <AuthDialog onOpenChange={setIsAuthOpen} open={isAuthOpen} />
    </div>
  );
};
