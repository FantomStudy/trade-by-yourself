"use client";

import type { ComponentProps } from "react";

import type { AuthScreen } from "./screens/types";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { CURRENT_USER_QUERY_KEY } from "@/lib/api/hooks/queries/useCurrentUser";

import { LoginScreen, RecoverScreen, RegisterScreen, VerifyCodeScreen } from "./screens";

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
  "verify-code": {
    id: "verify-code",
    title: "Подтверждение номера",
    component: VerifyCodeScreen,
  },
};

export const AuthDialog = ({ open, onOpenChange }: ComponentProps<typeof Dialog>) => {
  const queryClient = useQueryClient();
  const [screen, setScreen] = useState<AuthScreen>("login");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setScreen("login");
        setPhoneNumber("");
      }
      onOpenChange?.(isOpen);
    },
    [onOpenChange],
  );

  const handleClose = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  const completeAuthFlow = useCallback(() => {
    toast("Регистрация прошла успешно!");
    void queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    handleOpenChange(false);
  }, [queryClient, handleOpenChange]);

  const getOnCloseHandler = useCallback(() => {
    if (screen === "verify-code") {
      return completeAuthFlow;
    }
    return handleClose;
  }, [screen, completeAuthFlow, handleClose]);

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{AUTH_SCREENS[screen].title}</DialogTitle>
        </DialogHeader>

        {AUTH_SCREENS[screen].component({
          onChangeScreen: setScreen,
          onClose: getOnCloseHandler(),
          phoneNumber,
          onPhoneNumberChange: setPhoneNumber,
          onAuthComplete: completeAuthFlow,
        })}
      </DialogContent>
    </Dialog>
  );
};
