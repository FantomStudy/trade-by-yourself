"use client";

import type { PropsWithChildren, ReactNode } from "react";

import { createContext, use, useMemo, useState } from "react";

import { Modal } from "../ui/Modal/Modal";

interface ModalContextType {
  isOpen: boolean;
  stackSize: number;
  closeAllModals: () => void;
  closeModal: () => void;
  openModal: (config: ReactNode) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [modalStack, setModalStack] = useState<ReactNode[]>([]);

  const openModal = (content: ReactNode) => {
    setModalStack((prev) => [...prev, content]);
  };

  const closeModal = () => {
    setModalStack((prev) => {
      if (prev.length === 0) {
        return prev;
      }
      return prev.slice(0, -1);
    });
  };

  const closeAllModals = () => {
    setModalStack([]);
  };

  const value = useMemo(
    () => ({
      openModal,
      closeModal,
      closeAllModals,
      isOpen: modalStack.length > 0,
      stackSize: modalStack.length,
    }),
    [modalStack.length]
  );

  return (
    <ModalContext value={value}>
      {children}

      {modalStack.length > 0 && (
        <Modal
          content={modalStack[modalStack.length - 1]}
          onClose={closeAllModals}
        />
      )}
    </ModalContext>
  );
};

export const useModal = () => {
  const context = use(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
};
