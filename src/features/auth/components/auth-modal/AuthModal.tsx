"use client";

import { useCallback, useState } from "react";

import type { ModalProps } from "@/components/ui";

import { Modal } from "@/components/ui";

import type { AuthMode } from "./types";

import { LoginScreen, RecoverScreen, RegisterScreen } from "../screens";

interface AuthModalProps extends ModalProps {
  initialMode?: AuthMode;
}

export const AuthModal = ({
  initialMode = "login",
  onOpenChange,
  ...modalProps
}: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setMode(initialMode);
      }
      onOpenChange?.(isOpen);
    },
    [initialMode, onOpenChange]
  );

  const handleClose = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  return (
    <Modal onOpenChange={handleOpenChange} {...modalProps}>
      {mode === "login" && (
        <LoginScreen onClose={handleClose} onSwitchMode={setMode} />
      )}

      {mode === "register" && (
        <RegisterScreen onClose={handleClose} onSwitchMode={setMode} />
      )}

      {mode === "recover" && (
        <RecoverScreen onClose={handleClose} onSwitchMode={setMode} />
      )}
    </Modal>
  );
};
