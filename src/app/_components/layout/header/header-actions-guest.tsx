"use client";

import { useState } from "react";

import { AuthDialog } from "@/components/auth";
import { Button } from "@/components/ui";

export const HeaderActionsGuest = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuthDialog = () => {
    setIsAuthOpen(true);
  };

  return (
    <div className="flex items-center gap-8">
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
