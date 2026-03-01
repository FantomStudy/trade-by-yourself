"use client";

import { useEffect, useState } from "react";

import { AuthDialog } from "@/components/auth-dialog";
import { Button } from "@/components/ui-lab/Button";
import styles from "./header.module.css";

export const HeaderActionsGuest = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuthDialog = () => {
    setIsAuthOpen(true);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "1") {
      setIsAuthOpen(true);
      params.delete("auth");
      const url = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.replaceState({}, "", url);
    }
  }, []);

  return (
    <div className={styles.actions}>
      <Button variant="ghost" onClick={openAuthDialog}>
        Вход / Регистрация
      </Button>

      <Button variant="success" onClick={openAuthDialog}>
        Разместить объявление
      </Button>

      <AuthDialog onOpenChange={setIsAuthOpen} open={isAuthOpen} />
    </div>
  );
};
