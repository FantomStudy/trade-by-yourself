"use client";

import type { ComponentProps } from "react";

import type { AuthScreen } from "./screens/types";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";

import { LoginScreen, RecoverScreen, RegisterScreen } from "./screens";

const AUTH_SCREENS = {
  login: {
    id: "login",
    title: "Вход",
    component: LoginScreen,
  },
  recover: {
    id: "recover",
    title: "Восстановление",
    component: RecoverScreen,
  },
  register: {
    id: "register",
    title: "Регистрация",
    component: RegisterScreen,
  },
};

export const AuthDialog = ({
  open,
  onOpenChange,
}: ComponentProps<typeof Dialog>) => {
  const [screen, setScreen] = useState<AuthScreen>("login");

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setScreen("login");
      }
      onOpenChange?.(isOpen);
    },
    [onOpenChange],
  );

  const handleClose = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  const handleRegisterSuccess = useCallback(() => {
    toast("Регистрация прошла успешно!");
    setScreen("login");
  }, []);

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{AUTH_SCREENS[screen].title}</DialogTitle>
        </DialogHeader>

        {AUTH_SCREENS[screen].component({
          onChangeScreen: setScreen,
          onClose:
            AUTH_SCREENS[screen].id === "register"
              ? handleRegisterSuccess
              : handleClose,
        })}
      </DialogContent>
    </Dialog>
  );
};
