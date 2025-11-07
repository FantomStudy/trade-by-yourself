"use client";

import { useState } from "react";

import { Button } from "@/components/ui";
import { AuthModal } from "@/features/auth";

import styles from "./Header.module.css";

export const GuestHeaderActions = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <div className={styles.actions}>
        <Button variant="ghost" onClick={() => setIsAuthModalOpen(true)}>
          Вход / Регистрация
        </Button>

        <Button color="green" onClick={() => setIsAuthModalOpen(true)}>
          Разместить объявление
        </Button>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  );
};
