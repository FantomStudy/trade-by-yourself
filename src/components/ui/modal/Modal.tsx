"use client";

import type { ReactNode } from "react";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

import { Button } from "../button/Button";
import { CrossIcon } from "../icons";

import styles from "./Modal.module.css";

export interface ModalProps {
  children?: ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const Modal = ({ children, isOpen, onOpenChange }: ModalProps) => {
  const handleClose = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleClose, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (typeof window === "undefined" || !isOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.modal} data-open={isOpen}>
      <div
        aria-hidden="true"
        className={styles.backdrop}
        onClick={handleClose}
      />
      <div className={styles.content} aria-modal="true" role="dialog">
        <Button
          aria-label="Закрыть модальное окно"
          className={styles.closeButton}
          size="icon"
          variant="ghost"
          onClick={handleClose}
        >
          <CrossIcon />
        </Button>
        {children}
      </div>
    </div>,
    document.body
  );
};
